let tableBody= document.getElementById("tableBodyDonator");
const tabpaneForm = document.getElementById("donatorTabPillForm");
const tabPaneTable = document.getElementById("donatorTabPillTable");
const tabPillForm = document.getElementById("donatorFormPill");
const tabPillTable = document.getElementById("donatorTablePill");

window.addEventListener("load",()=>{
     // enable tooltip
  $('[data-bs-toggle="tooltip"]').tooltip();
    userPrivi=getHttpServiceRequest("/userprivilegebymodule?modulename=Donator");
    // call refresh table function
    refreshDonatorTable();
    // call refresh form function
    refreshDonatorForm();
})

// disable donator form elements
const disableElement=()=>{
    document.getElementById("radioIndividual").disabled=true;
    document.getElementById("radioOrganization").disabled=true;
    document.getElementById("textName").disabled=true;
    document.getElementById("textContactNo").disabled=true;
    document.getElementById("textEmail").disabled=true;
    document.getElementById("textAddress").disabled=true;
    document.getElementById("selectDonatorStatus").disabled=true;
    document.getElementById("textDonatorNote").disabled=true;
}

const refreshDonatorTable = () => {
    // IF table is already DataTable THEN remove it THEN create new DataTable
    if ($.fn.DataTable.isDataTable('#tableDonator')) {
        $('#tableDonator').DataTable().destroy();
    }

    let donators = ajaxGetrequest("/donator/alldata");

    // property array
    let displayProperty = [
        { propertyName: "donatortype", dataType: "string" },
        { propertyName: "name", dataType: "string" },
        { propertyName: "contactno", dataType: "string" },
        { propertyName: "email", dataType: "string" },
        { propertyName: "address", dataType: "string" },
        { propertyName: getDonatorStatus, dataType: "function" }
    ];

    //fill data into table function
    fillDataIntoTableEight(
        tableBody,
        donators,
        displayProperty,
        refillDonatorForm
    );

    buttonDonatorSubmit.classList.remove("d-none");
    buttonDonatorUpdate.classList.add("d-none");
    buttonDonatorPrint.classList.add("d-none");
    buttonDonatorDelete.classList.add("d-none");

    $("#tableDonator").DataTable({
        responsive: true,
        autoWidth: false
    });
}

// get donator status
const getDonatorStatus = (ob) => {
    if (ob.donatorstatus_id.name == "Active") {
        return '<i class="fa-solid fa-circle-check fa-lg me-1 " style="color:rgb(0, 189, 72);"></i>';
    }
    if (ob.donatorstatus_id.name == "Inactive") {
        return '<i class="fa-solid fa-circle-xmark fa-lg me-1 " style="color: #ff0000;"></i>';
    }
    if (ob.donatorstatus_id.name == "Deleted") {
        return '<i class="fa-solid fa-trash fa-lg me-1" style="color: rgb(255, 0, 0);"></i>';
    }
}

const refillDonatorForm=(dataOb)=>{
    setInitial([
        textName,
        textContactNo,
        textEmail,
        textAddress,
        textDonatorNote,
        selectDonatorStatus
    ])

    // shift to tab pane form
    tabpaneForm.classList.add('show', 'active');
    tabPaneTable.classList.remove('show', 'active');
    // shift to  form pill tab
    tabPillForm.classList.add('show', 'active');
    tabPillTable.classList.remove('show', 'active');

    // direct assign - reference variable
    donator = getHttpServiceRequest("donator/byid/"+ dataOb.id);
    oldDonator = getHttpServiceRequest("donator/byid/"+ dataOb.id);

    //donator type
    if (donator.donatortype == "Individual") {
        radioIndividual.checked = true;
    } else {
        radioOrganization.checked = true;
    }

    textName.value= donator.name;

    let contactNoWithoutZero=donator.contactno.substring(1);
    textContactNo.value=contactNoWithoutZero;

    if(donator.email != undefined || donator.email != null){
        textEmail.value= donator.email;
    }else{
        textEmail.value="";
    }
    if(donator.address != undefined || donator.address != null){
        textAddress.value= donator.address;
    }else{
        textAddress.value="";
    }
    if(donator.note != undefined || donator.note != null){
        textDonatorNote.value= donator.note;
    }else{
        textDonatorNote.value="";
    }

    //donator status
    selectDonatorStatus.value = JSON.stringify(donator.donatorstatus_id);
    selectDonatorStatus.disabled=false;

    if(!userPrivi.privi_update){
        buttonDonatorUpdate.classList.add("d-none");
    }else {
        buttonDonatorUpdate.classList.remove("d-none");
    }
    if(!userPrivi.privi_delete){
        buttonDonatorDelete.classList.add("d-none");
    }else {
        buttonDonatorDelete.classList.remove("d-none");
    }

    // set button visibility
    // only showing update. submit space also not showing
    buttonDonatorSubmit.classList.add("d-none");
    buttonDonatorPrint.classList.remove("d-none");


}

// define function for donator delete
const deleteDonatorRecord = (dataOb) => {
    // confrimation
    donator = getHttpServiceRequest("donator/byid/"+dataOb.id)
    Swal.fire({
        title: "Confirm Deletion",
        html: `<p>Are you sure to Delete this Donator Record ?</p>
          <p>Donator Type : <strong>${donator.donatortype || ''}</strong><br>
          Donator Name : <strong>${donator.name || ''}</strong><br>
           Donator Contact No : <strong>${donator.contactno || ''}</strong></p>`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ff0000ff",
        cancelButtonColor: "rgb(0, 102, 255)",
        confirmButtonText: "Yes, Delete",
        cancelButtonText: "Cancel",
        reverseButtons: true

    }).then((result) => {
        if (result.isConfirmed) {
            let deleteServiceResponse = getHttpServiceRequest("/donator/delete", "DELETE", dataOb)
            if (deleteServiceResponse == "OK") {
                Swal.fire({
                    title: "Deleted!",
                    text: "Donator Record Deleted Successfully.",
                    icon: 'success',
                });
                //refresh table
                refreshDonatorTable();
                // refresh form
                refreshDonatorForm();
                // shift to tab pane table
                tabpaneForm.classList.remove('show', 'active');
                tabPaneTable.classList.add('show', 'active');
                // shift to  table pill tab
                tabPillForm.classList.remove('show', 'active');
                tabPillTable.classList.add('show', 'active');
            } else {
                Swal.fire({
                    title: 'Deletion Failed',
                    html: `<p>Donator Record Could not be Deleted.</p>
                <p>Details: ${deleteServiceResponse}</p>`,
                    confirmButtonText: 'OK'
                });
            }
        } else {
            //refresh table
        }
    })
}

//function for open print modal
const printDonatorRecord = (dataOb) => {
    let donatorModal_view = new bootstrap.Modal(
        document.getElementById("modalDonatorView"), {}
    );
    donatorModal_view.show();
    tdDonatorType.innerText= dataOb.donatortype  ;
    tdDonatorName.innerText= dataOb.name  ;
    tdDonatorContactNo.innerText= dataOb.contactno  ;
    tdDonatorEmail.innerText= dataOb.email  ;
    tdDonatorAddress.innerText= dataOb.address  ;
    tdDonatorStatus.innerText= dataOb.donatorstatus_id.name  ;
    tdDonatorNote.innerText= dataOb.note  ;
}

// print function
const printDonator = () => {
    let tab = window.open();
    tab.document.write('<html>'
        + '<head><title>Print Donator Record</title>'
        + '<link rel="stylesheet" href="../resources/bootstrap-5.2.3/css/bootstrap.min.css"/>'
        + '</head>'
        + '<body>'
        + divCardPrintDonator.outerHTML
        + '</body></html>');

    setInterval(() => {
        tab.stop();
        tab.print();
        tab.close();
    }, 700);
}

const refreshDonatorForm=()=>{
    donatorForm.reset();
    if(!userPrivi.privi_insert){
        disableElement();
        buttonDonatorSubmit.classList.add("d-none");
        tabpaneForm.classList.remove('show', 'active');
        tabPillForm.classList.remove('show','active')
        tabPaneTable.classList.add('show', 'active');
        tabPillTable.classList.add('show','active')
    }
    // create new donator oject for store valid form value
    donator = new Object();

    let donatorStatus= ajaxGetrequest("/donatorstatus/alldata");
    fillDataIntoSelect(
        selectDonatorStatus,
        "Select Donator Status",
        donatorStatus,
        "name"
    );

    setInitial([
        textName,
        textContactNo,
        textEmail,
        textAddress,
        textDonatorNote,
        selectDonatorStatus
    ])

    selectDonatorStatus.value=JSON.stringify(donatorStatus[0]);
    selectDonatorStatus.style.borderBottom="2px solid lightgreen"
    donator.donatorstatus_id= donatorStatus[0];
    selectDonatorStatus.disabled=true;
}

//check form errors
const checkDonatorFormErrors=()=>{
    let errors="";
    if(donator.donatortype== null){
        errors+="Please Select Donator Type.<br>"
    }
    if (donator.name == null) {
        textName.style.borderBottom = "2px solid pink";
        errors += "Please Enter Donator Name.<br>";
    }
    if (donator.contactno == null) {
        textContactNo.style.borderBottom = "2px solid pink";
        errors += "Please Enter Contact Number.<br>";
    }
    if (donator.donatorstatus_id == null) {
        selectDonatorStatus.style.borderBottom = "2px solid pink";
        errors += "Please Select Donator Status.<br>";
    }
    return errors;
}

// define function for submit button
const buttonSubmitDonator = () => {

    let formErrors = checkDonatorFormErrors();
    if (formErrors === "") {
        // form has not any errors
        Swal.fire({
            title: "Confirm Save",
            html: `<p>Are you sure to save this donator record?</p>`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ff0000ff",
            cancelButtonColor: "rgb(0, 102, 255)",
            confirmButtonText: "Yes, Save",
            cancelButtonText: "Cancel",
            reverseButtons: true

        }).then((result) => {
            if (result.isConfirmed) {
                let fullDonatorContactNo = "0" + textContactNo.value;
                donator.contactno = fullDonatorContactNo;

                console.log(donator);

                // call post service
                let postServiceResponse = getHttpServiceRequest("/donator/insert", "POST", donator);

                if (postServiceResponse == "OK") {
                    // save successs
                    Swal.fire({
                        title: "Saved!",
                        text: "Donator record saved successfully.",
                        icon: 'success',

                    });
                    refreshDonatorTable();
                    refreshDonatorForm();
                    // shift to tab pane table
                    tabpaneForm.classList.remove('show', 'active');
                    tabPaneTable.classList.add('show', 'active');
                    // shift to  table pill tab
                    tabPillForm.classList.remove('show', 'active');
                    tabPillTable.classList.add('show', 'active');

                } else {
                    // save not completed
                    Swal.fire({
                        title: 'Save Failed',
                        html: `<p>Donator record could not be saved.</p>
                <p>Details: ${postServiceResponse}</p>`,
                        confirmButtonText: 'OK'
                    });

                }
            } else {
                //get user confirm for form discard
                // can get user confrimation for form refresh
                Swal.fire({
                    title: "Confirm Refresh",
                    text: "Do you need to refresh donator form ?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#ff0000ff",
                    cancelButtonColor: "rgb(0, 102, 255)",
                    confirmButtonText: "OK",
                    reverseButtons: true

                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload();
                    }
                })

            }
        })
    } else {
        // form has errors
        Swal.fire({
            title: 'Save Failed',
            html: `<p>Form has Following Errors.</p>
                <p>${formErrors}</p>`,
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
}

// define check updates function
const checkDonatorFormUpdates=()=>{
    let updates="";
    if(donator!=null && oldDonator!=null){

        if (donator.donatortype != oldDonator.donatortype) {
            updates += "Donator Type is changed " + oldDonator.donatortype + " into " + donator.donatortype + ".<br>";
        }

        if (donator.name != oldDonator.name) {
            updates += "Donator Name is changed " + oldDonator.name + " into " + donator.name + ".<br>";
        }
        if (donator.contactno != oldDonator.contactno) {
            updates += "Contact Number is changed " + oldDonator.contactno + " into " + donator.contactno + ".<br>";
        }
        if (donator.email != oldDonator.email) {
            updates += "Email is changed " + oldDonator.email + " into " + donator.email + ".<br>";
        }

        if (donator.address != oldDonator.address) {
            updates += "Address is changed " + oldDonator.address + " into " + donator.address + ".<br>";
        }
        if (donator.donatorstatus_id.name != oldDonator.donatorstatus_id.name) {
            updates += "Status is changed " + oldDonator.donatorstatus_id.name + " into " + donator.donatorstatus_id.name + ".<br>";
        }
        if (donator.note != oldDonator.note) {
            updates += "Note is changed " + oldDonator.note + " into " + donator.note + ".<br>";
        }
    }
    return updates;
}

// define function for update record
const buttonUpdateDonator = () => {
    let fullDonatorContactNo = "0" + textContactNo.value;
    donator.contactno = fullDonatorContactNo;

    console.log(donator);

    // need to check  all required feild with valid value
    let formErrors = checkDonatorFormErrors();
    if (formErrors == "") {
        let formUpdates = checkDonatorFormUpdates();
        if (formUpdates == "") {
            //no updates
            Swal.fire({
                title: 'Update Failed',
                text: "Form has not any changes to update.",
                confirmButtonText: 'OK'
            });
        } else {
            // has updates
            Swal.fire({
                title: "Confirm Update",
                html: `<p>Are you sure to update this donator record?</p>
            <p>${formUpdates}</p>`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#ff0000ff",
                cancelButtonColor: "rgb(0, 102, 255)",
                confirmButtonText: "Yes, Update",
                cancelButtonText: "Cancel",
                reverseButtons: true

            }).then((result) => {
                if (result.isConfirmed) {
                    let updateServiceResponse = getHttpServiceRequest("/donator/update", "PUT", donator);
                    if (updateServiceResponse == "OK") {
                        //user confrim update
                        Swal.fire({
                            title: "Updated!",
                            text: "Donator record updated successfully.",
                            icon: 'success',

                        });
                        //refresh form and table
                        refreshDonatorTable();
                        refreshDonatorForm();

                        // shift to tab pane table
                        tabpaneForm.classList.remove('show', 'active');
                        tabPaneTable.classList.add('show', 'active');
                        // shift to  table pill tab
                        tabPillForm.classList.remove('show', 'active');
                        tabPillTable.classList.add('show', 'active');

                    } else {
                        // user cancel updates
                        Swal.fire({
                            title: 'Update Failed',
                            html: `<p>Donator record could not be updated.</p>
                <p>${updateServiceResponse}</p>`,
                            confirmButtonText: 'OK'
                        });

                    }
                }
            })
        }
    } else {
        // form has errors
        Swal.fire({
            title: 'Update Failed',
            html: `<p>Form has Following Errors.</p>
                <p>${formErrors}</p>`,
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
}
