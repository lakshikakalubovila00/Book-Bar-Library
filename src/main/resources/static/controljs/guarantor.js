let tableBody= document.getElementById("tableBodyGuarantor");
const tabpaneForm = document.getElementById("guarantorTabPillForm");
const tabPaneTable = document.getElementById("guarantorTabPillTable");
const tabPillForm = document.getElementById("guarantorFormPill");
const tabPillTable = document.getElementById("guarantorTablePill");

window.addEventListener("load",()=>{
     // enable tooltip
  $('[data-bs-toggle="tooltip"]').tooltip();
    userPrivi=getHttpServiceRequest("/userprivilegebymodule?modulename=Guarantor");
    // call refresh table function
  refreshGuarantorTable();
  // call refersh form function
  refreshGuarantorForm();
})

// disable guarantor form elements
const disableElement=()=>{
    document.getElementById("textGuarantorNic").disabled=true;
    document.getElementById("textGuarantorName").disabled=true;
    document.getElementById("textGuarantorEmail").disabled=true;
    document.getElementById("textGuarantorMobileNo").disabled=true;
    document.getElementById("textGuarantorAddress").disabled=true;
    document.getElementById("checkboxGuarantorStatus").disabled=true;
}

// function  for refresh guarantor table
const refreshGuarantorTable = () => {

    // IF table is already DataTable THEN remove it THEN create new DataTable
    if ($.fn.DataTable.isDataTable('#tableGuarantor')) {
        $('#tableGuarantor').DataTable().destroy();
    }

  let guarantors = ajaxGetrequest("/guarantor/alldata");

  // property array
  let displayProperty = [
    { propertyName: "name", dataType: "string" },
    { propertyName: "nic", dataType: "string" },
    { propertyName: "email", dataType: "string" },
    { propertyName: "mobileno", dataType: "string" },
    { propertyName: "address", dataType: "string" },
    { propertyName: getGuarantorStatus, dataType: "function" }
  ];

  //fill data into table function
  fillDataIntoTableEight(
    tableBody,
    guarantors,
    displayProperty,
    refillGuarantorForm
  );

  buttonSubmitGuarantor.classList.remove("d-none");
  buttonUpdateGuarantor.classList.add("d-none");
  buttonPrintGuarantor.classList.add("d-none");
  buttonDeleteGuarantor.classList.add("d-none");

    $("#tableGuarantor").DataTable({
        responsive: true,
        autoWidth: false
    });
}

const getGuarantorStatus = (ob) => {
    if (ob.guarantorstatus_id.name == "Active") {
        return '<i class="fa-solid fa-circle-check fa-lg me-1 " style="color:rgb(0, 189, 72);"></i>';
    }
    if (ob.guarantorstatus_id.name == "Blacklisted") {
        return '<i class="fa-solid fa-ban fa-lg me-1" style="color: #75001d;"></i>';
    }
    if (ob.guarantorstatus_id.name == "Deleted") {
        return '<i class="fa-solid fa-trash fa-lg me-1" style="color: rgb(255, 0, 0);"></i>';
    }
}

// define function for guarantor edit
const refillGuarantorForm = (dataOb) => {

    setInitial([
        textGuarantorName,
        textGuarantorNic,
        textGuarantorEmail,
        textGuarantorMobileNo,
        textGuarantorAddress,
        selectGuarantorStatus
    ])

    // shift to tab pane form
    tabpaneForm.classList.add('show', 'active');
    tabPaneTable.classList.remove('show', 'active');
    // shift to  form pill tab
    tabPillForm.classList.add('show', 'active');
    tabPillTable.classList.remove('show', 'active');

    // direct assign - reference variable
    guarantor = getHttpServiceRequest("guarantor/byid/"+ dataOb.id);
    oldGuarantor = getHttpServiceRequest("guarantor/byid/"+ dataOb.id);

    textGuarantorName.value = guarantor.name;
    textGuarantorNic.value = guarantor.nic;

    // email - optional
    if (guarantor.email != undefined || guarantor.email != null) {
        textGuarantorEmail.value = guarantor.email;
    } else {
        textGuarantorEmail.value = "";
    }

    let mobileNoWithoutZero = guarantor.mobileno.substring(1);
    textGuarantorMobileNo.value = mobileNoWithoutZero;

    textGuarantorAddress.value = guarantor.address;

    //guarantor status
    selectGuarantorStatus.value = JSON.stringify(guarantor.guarantorstatus_id);


    if(!userPrivi.privi_update){
        buttonUpdateGuarantor.classList.add("d-none");
    }else {
        buttonUpdateGuarantor.classList.remove("d-none");
    }
    if(!userPrivi.privi_delete){
        buttonDeleteGuarantor.classList.add("d-none");
    }else {
        buttonDeleteGuarantor.classList.remove("d-none");
    }

    // set button visibility
    // only showing update. submit space also not showing
    buttonSubmitGuarantor.classList.add("d-none");
    buttonPrintGuarantor.classList.remove("d-none");
}

// define function for guarantor delete
const deleteGuarantorRecord = (dataOb) => {
    // confrimation
    guarantor = getHttpServiceRequest("guarantor/byid/"+dataOb.id)
    Swal.fire({
        title: "Confirm Deletion",
        html: `<p>Are you sure to Delete this Guarantor Record ?</p>
          <p>Guarantor Name : <strong>${guarantor.name || ''}</strong><br>
           Guarantor NIC : <strong>${guarantor.nic || ''}</strong><br>
           Guarantor Email : <strong>${guarantor.email || ''}</strong></p>`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ff0000ff",
        cancelButtonColor: "rgb(0, 102, 255)",
        confirmButtonText: "Yes, Delete",
        cancelButtonText: "Cancel",
        reverseButtons: true

    }).then((result) => {
        if (result.isConfirmed) {
            let deleteServiceResponse = getHttpServiceRequest("/guarantor/delete", "DELETE", dataOb)
            if (deleteServiceResponse == "OK") {
                Swal.fire({
                    title: "Deleted!",
                    text: "Guarantor Record Deleted Successfully.",
                    icon: 'success',
                });
                // alert("Guarantor record Deleted Successfully..!");
                //refresh table
                refreshGuarantorTable();
                // refresh form
                refreshGuarantorForm();
                // shift to tab pane table
                tabpaneForm.classList.remove('show', 'active');
                tabPaneTable.classList.add('show', 'active');
                // shift to  table pill tab
                tabPillForm.classList.remove('show', 'active');
                tabPillTable.classList.add('show', 'active');
            } else {
                Swal.fire({
                    title: 'Deletion Failed',
                    html: `<p>Guarantor Record Could not be Deleted.</p>
                <p>Details: ${deleteServiceResponse}</p>`,
                    confirmButtonText: 'OK'
                });
                // alert("Fail to Delete Guarantor. Has following errors \n" + deleteServiceResponse);
            }
        } else {
            //refresh table
        }
    })
}

//function for open print modal
const printGuarantorRecord = (dataOb) => {
    let guarantorModal_view = new bootstrap.Modal(
        document.getElementById("modalGuarantorView"), {}
    );
    guarantorModal_view.show();
    //tdMemberPhoto
    tdGuarantorName.innerText = dataOb.name;
    tdGuarantorNic.innerText = dataOb.nic;
    tdGuarantorEmail.innerText = dataOb.email;
    tdGuarantorMobileNo.innerText = dataOb.mobileno;
    tdGuarantorAddress.innerText = dataOb.address;
    tdGuarantorStatus.innerText = dataOb.guarantorstatus_id.name;
}

// print function
const printGuarantor = () => {
    let tab = window.open();
    tab.document.write('<html>'
        + '<head><title>Print Guarantor Record</title>'
        + '<link rel="stylesheet" href="../resources/bootstrap-5.2.3/css/bootstrap.min.css"/>'
        + '</head>'
        + '<body>'
        + divCardPrintGuarantor.outerHTML
        + '</body></html>');

    setInterval(() => {
        tab.stop();
        tab.print();
        tab.close();
    }, 700);
}

// function for refresh guarantor form
const refreshGuarantorForm = () => {
  // clean static element- only value- empty static element
  guarantorForm.reset();

    if(!userPrivi.privi_insert){
        disableElement();
        buttonSubmitGuarantor.classList.add("d-none");
        tabpaneForm.classList.remove('show', 'active');
        tabPillForm.classList.remove('show','active')
        tabPaneTable.classList.add('show', 'active');
        tabPillTable.classList.add('show','active')
    }
  // create new guarantor oject for store valid form value
  guarantor = new Object();

    let guarantorStatus= ajaxGetrequest("/guarantorstatus/alldata");
    fillDataIntoSelect(
        selectGuarantorStatus,
        "Select Guarantor Status",
        guarantorStatus,
        "name"
    );

  setInitial([
      textGuarantorName,
      textGuarantorNic,
      textGuarantorEmail,
      textGuarantorMobileNo,
      textGuarantorAddress,
      selectGuarantorStatus
  ])
    selectGuarantorStatus.value=JSON.stringify(guarantorStatus[0]);
    selectGuarantorStatus.style.borderBottom="2px solid lightgreen"
    guarantor.guarantorstatus_id= guarantorStatus[0];

}

// check form errors
const checkGuarantorFormErrors = () => {
  let errors = "";
  if (guarantor.name == null) {
    textGuarantorName.style.borderBottom = "2px solid pink";
    errors += "Please Enter Guarantor Name.<br>";
  }
  if (guarantor.nic == null) {
    textGuarantorNic.style.borderBottom = "2px solid pink";
    errors += "Please Enter Guarantor NIC.<br>";
  }
  if (guarantor.mobileno == null) {
    textGuarantorMobileNo.style.borderBottom = "2px solid pink";
    errors += "Please Enter Mobile Number.<br>";
  }
  if (guarantor.address == null) {
    textGuarantorAddress.style.borderBottom = "2px solid pink";
    errors += "Please Enter Address.<br>";
  }
    if (guarantor.guarantorstatus_id == null) {
        selectGuarantorStatus.style.borderBottom = "2px solid pink";
        errors += "Please Select Guarantor Status.<br>";
    }
  return errors;
}

// define function for submit button
const buttonGuarantorSubmit = () => {

  let formErrors = checkGuarantorFormErrors();
  if (formErrors === "") {
    // form has not any errors
    Swal.fire({
      title: "Confirm Save",
      html: `<p>Are you sure to save this guarantor record?</p>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ff0000ff",
      cancelButtonColor: "rgb(0, 102, 255)",
      confirmButtonText: "Yes, Save",
      cancelButtonText: "Cancel",
        reverseButtons: true

    }).then((result) => {
      if (result.isConfirmed) {
          let fullGuarantorMobileNo = "0" + textGuarantorMobileNo.value;
          guarantor.mobileno = fullGuarantorMobileNo;

          console.log(guarantor);

        // call post service
        let postServiceResponse = getHttpServiceRequest("/guarantor/insert", "POST", guarantor);

        if (postServiceResponse == "OK") {
          // save successs
          Swal.fire({
            title: "Saved!",
            text: "Guarantor record saved successfully.",
            icon: 'success',

          });
          refreshGuarantorTable();
          refreshGuarantorForm();
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
            html: `<p>Guarantor record could not be saved.</p>
                <p>Details: ${postServiceResponse}</p>`,
            confirmButtonText: 'OK'
          });

        }
      } else {
        //get user confirm for form discard
        // can get user confrimation for form refresh
        Swal.fire({
          title: "Confirm Refresh",
          text: "Do you need to refresh guarantor form ?",
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
const checkGuarantorFormUpdates = () => {
    let updates = "";
    if (guarantor != null && oldGuarantor != null) {
        if (guarantor.name != oldGuarantor.name) {
            updates += "Guarantor Name is changed " + oldGuarantor.name + " into " + guarantor.name + ".<br>";
        }
        if (guarantor.nic != oldGuarantor.nic) {
            updates += "NIC is changed " + oldGuarantor.nic + " into " + guarantor.nic + ".<br>";
        }
        if (guarantor.email != oldGuarantor.email) {
            updates += "Email is changed " + oldGuarantor.email + " into " + guarantor.email + ".<br>";
        }
        if (guarantor.mobileno != oldGuarantor.mobileno) {
            updates += "Mobile Number is changed " + oldGuarantor.mobileno + " into " + guarantor.mobileno + ".<br>";
        }
        if (guarantor.address != oldGuarantor.address) {
            updates += "Address is changed " + oldGuarantor.address + " into " + guarantor.address + ".<br>";
        }
        if (guarantor.guarantorstatus_id.name != oldGuarantor.guarantorstatus_id.name) {
            updates += "Status is changed " + oldGuarantor.guarantorstatus_id.name + " into " + guarantor.guarantorstatus_id.name + ".<br>";
        }
    }
    return updates;
}

// define function for update record
const buttonGuarantorUpdate = () => {
    let fullGuarantorMobileNo = "0" + textGuarantorMobileNo.value;
    guarantor.mobileno = fullGuarantorMobileNo;

    console.log(guarantor);
    // need to check  all required feild with valid value
    let formErrors = checkGuarantorFormErrors();
    if (formErrors == "") {
        let formUpdates = checkGuarantorFormUpdates();
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
                html: `<p>Are you sure to update this guarantor record?</p>
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
                    let updateServiceResponse = getHttpServiceRequest("/guarantor/update", "PUT", guarantor);
                    if (updateServiceResponse == "OK") {
                        //user confrim update
                        Swal.fire({
                            title: "Updated!",
                            text: "Guarantor record updated successfully.",
                            icon: 'success',

                        });
                        //refresh form and table
                        refreshGuarantorTable();
                        refreshGuarantorForm();

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
                            html: `<p>Guarantor record could not be updated.</p>
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

