
// tab panes

const tabpaneForm = document.getElementById("membershipTypeTabPillForm");
const tabPaneTable = document.getElementById("membershipTypeTabPillTable");
const tabPillForm = document.getElementById("membershipTypeFormPill");
const tabPillTable = document.getElementById("membershipTypeTablePill");

const selectStatusElement = document.querySelector("#selectStatus");
const radioContainer = document.getElementById("radioMembershipTypeYear");
const selectMembershipTypeCategoryElement= document.querySelector("#selectMembershipTypeCategory")
const nameElement = document.getElementById("textName");
const durationElement= document.getElementById("numberDuration");
const numberReservationFeeElement= document.getElementById("numberReservationFee")

// table body
let tableBody= document.querySelector("#tableBodyMembershipType")

// access browser on load event
window.addEventListener("load",()=>{
     // enable tooltip
  $('[data-bs-toggle="tooltip"]').tooltip();

  //get logged user privilege
    userPrivi=getHttpServiceRequest("/userprivilegebymodule?modulename=Membership-Type")

    // call refresh table function
    refreshMembershipTypeTable();

    // call refresh form function
    refreshMembershipTypeForm();
})

// function for disable form elements
const disableElement=()=>{
    document.getElementById("textName").disabled=true;
    document.getElementById("selectMembershipTypeCategory").disabled=true;
    document.getElementById("numberDuration").disabled=true;
    document.getElementById("numberMembershipFee").disabled=true;
    document.getElementById("numberRenewalFee").disabled=true;
    document.getElementById("numberBorrowDuration").disabled=true;
    document.getElementById("numberBorrowLimit").disabled=true;
    document.getElementById("numberReservationDuration").disabled=true;
    document.getElementById("numberReservationLimit").disabled=true;
    document.getElementById("numberDelayFineFee").disabled=true;
    document.getElementById("selectStatus").disabled=true;
    document.getElementById("textDescription").disabled=true;
    numberReservationFeeElement
}

// generate name function
const generateName=()=>{
    let year= membershiptype.year;
    let membershipTypeCategory = JSON.parse(selectMembershipTypeCategoryElement.value).name;

    let generatedName= `${year} ${membershipTypeCategory} Membership`;
    textName.value=generatedName;
    textName.style.borderBottom="2px solid lightgreen";
    membershiptype.name=generatedName;
}

// function for fill duration according to membershiptype category
const fillDuration=()=>{

    let membershipTypeCategory = JSON.parse(selectMembershipTypeCategoryElement.value).name;
    let duration= null;

    let year= membershiptype.year;
    // leap year check - leap year should be : divisible by 4
    // but years divisible by 100 are NOT leap
    // years divisible by 400 ARE leap
    const isLeap = (y) => (y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0));
    // maximum days in year (leap year - 366) (normal year - 365)
    const maxDay = isLeap(parseInt(year)) ? 366 : 365;

    if(membershipTypeCategory==="Child Annual" || membershipTypeCategory==="Adult Annual"){
        duration=maxDay;

    }

    else if(membershipTypeCategory==="Child Semi-Annual" || membershipTypeCategory==="Adult Semi-Annual"){
        duration=180;
    }

    else if(membershipTypeCategory==="Child Quarterly" || membershipTypeCategory==="Adult Quarterly"){
        duration=90;
    }

    else if(membershipTypeCategory==="Child Monthly" || membershipTypeCategory==="Adult Monthly"){
        duration=30;
    }

    else if(membershipTypeCategory==="Child Daily" || membershipTypeCategory==="Adult Daily"){
        duration=1;
    }

    if(duration !==null){
        numberDuration.value = duration;
        numberDuration.style.borderBottom = "2px solid lightgreen";
        membershiptype.membershipduration = duration;
    }

}

// refresh table function
refreshMembershipTypeTable=()=>{

    // IF table is already DataTable THEN remove it THEN create new DataTable
    if ($.fn.DataTable.isDataTable('#tableMembershipTypes')) {
        $('#tableMembershipTypes').DataTable().destroy();
    }
    let membershiptypes= ajaxGetrequest("/membershiptype/alldata");

    // property array
    let displayProperty=[
        {propertyName :"name" , dataType:"string"},
        {propertyName :"membershipduration" , dataType:"string"},
        {propertyName :"membershipfee" , dataType:"string"},
        {propertyName :"renewalfee" , dataType:"string"},
        {propertyName :"borrowduration" , dataType:"string"},
        {propertyName :"borrowlimit" , dataType:"string"},
        {propertyName :"reservationduration" , dataType:"string"},
        {propertyName :"reservationlimit" , dataType:"string"},
        {propertyName :"reservationfee" , dataType:"string"},
        {propertyName :"fineprice" , dataType:"string"},
        { propertyName: getMembershipTypeStatus, dataType: "function" }
    ];

    //fill data into table function
    fillDataIntoTableEight(
        tableBody,
        membershiptypes,
        displayProperty,
        refillmembershipTypeForm
    );

    buttonSubmit.classList.remove("d-none");
    buttonUpdate.classList.add("d-none");
    buttonPrint.classList.add("d-none");
    buttonDelete.classList.add("d-none");

    $("#tableMembershipTypes").DataTable({
        responsive: true,
        autoWidth: false
    });
}

// get membership type status for table
const getMembershipTypeStatus=(ob)=>{
    if(ob.membershiptypestatus_id.name=="Valid"){
        return '<i class="fa-solid fa-circle-check fa-lg me-1 " style="color:rgb(0, 189, 72);"></i>';
    }
    if(ob.membershiptypestatus_id.name=="Invalid"){
        return '<i class="fa-solid fa-circle-xmark fa-lg me-1 " style="color: #ff0000;"></i>';
    }
    if (ob.membershiptypestatus_id.name == "Deleted") {
        return '<i class="fa-solid fa-trash fa-lg" style="color: rgb(255, 0, 0);"></i>';
    }
}

// refill form
const refillmembershipTypeForm=(dataOb)=>{
    setInitial([
        textName,
        selectMembershipTypeCategoryElement,
        // refill year
        numberDuration,
        numberMembershipFee,
        numberRenewalFee,
        numberBorrowDuration,
        numberBorrowLimit,
        numberReservationDuration,
        numberReservationLimit,
        numberDelayFineFee,
        selectStatus,
        textDescription,
        numberReservationFee
    ])
    console.log(dataOb);


    // shift to tab pane form
    tabpaneForm.classList.add('show', 'active');
    tabPaneTable.classList.remove('show', 'active');
    // shift to  form pill tab
    tabPillForm.classList.add('show', 'active');
    tabPillTable.classList.remove('show', 'active');

    // direct assign - reference variable
    membershiptype= getHttpServiceRequest("membershiptype/byid/"+dataOb.id);
    oldMembershiptype= getHttpServiceRequest("membershiptype/byid/"+dataOb.id);

    textName.value= membershiptype.name ;
    selectMembershipTypeCategoryElement.value= JSON.stringify(membershiptype.membershiptypecategory_id);
    // year refill
    document.querySelectorAll('input[name="membershipTypeYear"]').forEach(
        radio=>{
            if(radio.value=== membershiptype.year){
                radio.checked=true;
            }
        }
    )
    numberDuration.value= membershiptype.membershipduration ;
    numberMembershipFee.value= membershiptype.membershipfee;
    numberRenewalFee.value= membershiptype.renewalfee ;
    numberBorrowDuration.value= membershiptype.borrowduration ;
    numberBorrowLimit.value= membershiptype.borrowlimit ;
    numberReservationDuration.value= membershiptype.reservationduration ;
    numberReservationLimit.value= membershiptype.reservationlimit ;
    numberReservationFee.value= membershiptype.reservationfee;
    numberDelayFineFee.value= membershiptype.fineprice ;
    selectStatus.value= JSON.stringify(membershiptype.membershiptypestatus_id) ;
    selectStatus.disabled=false;

    // optional
    if(membershiptype.description != undefined || membershiptype.description!= null){
        textDescription.value= membershiptype.description ;
    }else{
        textDescription.value="";
    }

    if(!userPrivi.privi_update){
        buttonUpdate.classList.add("d-none");
    }else {
        buttonUpdate.classList.remove("d-none");
    }
    if(!userPrivi.privi_delete){
        buttonDelete.classList.add("d-none");
    }else {
        buttonDelete.classList.remove("d-none");
    }

    // set button visibility
    // only showing update. submit space also not showing
    buttonSubmit.classList.add("d-none");
    buttonPrint.classList.remove("d-none");

}

// define function for delete membership type record
const deleteMembershipTypeRecord=(dataOb)=>{
    book = getHttpServiceRequest("membershiptype/byid/"+ dataOb.id);
    Swal.fire({
        title: "Confirm Deletion",
        html: `<p>Are you sure to Delete this Membership Type Record ?</p>
            <p>Name : <strong>${membershiptype.name}</strong></p>
          <p>Status : <strong>${membershiptype.membershiptypestatus_id.name || ''}</strong><br></p>`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ff0000ff",
        cancelButtonColor: "rgb(0, 102, 255)",
        confirmButtonText: "Yes, Delete",
        cancelButtonText: "Cancel",
        reverseButtons: true

    }).then((result) => {
        if (result.isConfirmed) {
            let deleteServiceResponse = getHttpServiceRequest("/membershiptype/delete", "DELETE", dataOb)
            if (deleteServiceResponse == "OK") {
                Swal.fire({
                    title: "Deleted!",
                    text: "Membership Type Record Deleted Successfully.",
                    icon: 'success',

                });
                //refresh table
                refreshMembershipTypeTable();
                //refresh form
                refreshMembershipTypeForm();
                // shift to tab pane table
                tabpaneForm.classList.remove('show', 'active');
                tabPaneTable.classList.add('show', 'active');

                // shift to  table pill tab
                tabPillForm.classList.remove('show', 'active');
                tabPillTable.classList.add('show', 'active');
            } else {
                Swal.fire({
                    title: 'Deletion Failed',
                    html: `<p>Membership Type record could not be deleted.</p>
                <p>Details: ${deleteServiceResponse}</p>`,
                    confirmButtonText: 'OK'
                });
            }
        } else {
            //refresh table
        }
    })
}

//define function to print membership type
const printmembershipTypeRecord=(dataOb)=>{
    let membershipTypeModal_view= new bootstrap.Modal(
        document.getElementById("modalMembershipTypeView"),{}
    );
    membershipTypeModal_view.show();
    membershiptype= getHttpServiceRequest("membershiptype/byid/"+dataOb.id);

    tdName.innerText= dataOb.name ;
    tdDuration.innerText= dataOb.membershipduration ;
    tdMembershipFee.innerText= dataOb.membershipfee ;
    tdRenewalFee.innerText= dataOb.renewalfee ;
    tdBorrowDuration.innerText= dataOb.borrowduration ;
    tdBorrowLimit.innerText= dataOb.borrowlimit ;
    tdReservationDuration.innerText= dataOb.reservationduration ;
    tdReservationLimit.innerText= dataOb.reservationlimit ;
    tdReservationFee.innerText= dataOb.reservationfee;
    tdDelayfineFee.innerText= dataOb.fineprice ;
    tdStatus.innerText= dataOb.membershiptypestatus_id.name ;
    tdDescription.innerText= dataOb.description ;
}

// print function
const printMembershipType = () => {
    let tab = window.open();
    tab.document.write('<html>'
        + '<head><title>Print Membership Type Record</title>'
        + '<link rel="stylesheet" href="../resources/bootstrap-5.2.3/css/bootstrap.min.css"/>'
        + '</head>'
        + '<body>'
        + divCardPrintMembershipType.outerHTML
        + '</body></html>');

    setInterval(() => {
        tab.stop();
        tab.print();
        tab.close();
    }, 700);
}

// refrsh membership type form
refreshMembershipTypeForm=()=>{
    membershipTypeForm.reset();

    if(!userPrivi.privi_insert){
        disableElement();
        buttonSubmit.classList.add("d-none");
        tabpaneForm.classList.remove('show', 'active');
        tabPillForm.classList.remove('show','active')
        tabPaneTable.classList.add('show', 'active');
        tabPillTable.classList.add('show','active')
    }

    // create empty object
    membershiptype= new Object();

    let membershipcategories= ajaxGetrequest("/membershiptypecategory/alldata");
    fillDataIntoSelect(selectMembershipTypeCategoryElement,"Select Membership Type Category", membershipcategories,"name");

    let membershipStatues= ajaxGetrequest("/membershiptypestatus/alldata");
    fillDataIntoSelect(selectStatusElement, "Select Membership Type Status", membershipStatues,"name");

    const currentYear= new Date().getFullYear();
    const numberofYears=3;
    let membershiptypeYears=[];
    for(let i=0; i<numberofYears; i++){
        membershiptypeYears.push({year:currentYear+i});
    }

    radioContainer.innerHTML="";

    membershiptypeYears.forEach((yearOb,index)=>{
        let radioId = index;
        let radio= document.createElement("input");
        radio.type="radio";
        radio.name="membershipTypeYear";
        radio.id=radioId;

        radio.classList.add("form-check-input");
        radio.value = yearOb.year;
        radio.required = true;

        radio.onchange = () => {
            membershiptype.year = radio.value;
            generateName();
        };

        let label = document.createElement("label");
        label.htmlFor = radioId;
        label.innerText = yearOb.year;
        label.classList.add("form-check-label", "me-3");

        let wrapper = document.createElement("div");
        wrapper.classList.add("form-check");
        wrapper.appendChild(radio);
        wrapper.appendChild(label);

        radioContainer.appendChild(wrapper);

    });

    nameElement.disabled=true;
    durationElement.disabled=true;

    setInitial([
                textName,
                selectMembershipTypeCategoryElement,
                // refill year
                numberDuration,
                numberMembershipFee,
                numberRenewalFee,
                numberBorrowDuration,
                numberBorrowLimit,
                numberReservationDuration,
                numberReservationLimit,
                numberDelayFineFee,
                selectStatus,
                textDescription,
                numberReservationFee
            ])

    selectStatusElement.value= JSON.stringify(membershipStatues[0]);
    selectStatusElement.style.borderBottom="2px solid lightgreen";
    membershiptype.membershiptypestatus_id=membershipStatues[0];
    selectStatusElement.disabled=true;
}

// function for check errors
const checkMembershipTypeFormErrors=()=>{
    let errors="";
    if(membershiptype.membershiptypecategory_id==null){
        selectMembershipTypeCategoryElement.style.borderBottom="2px solid pink";
        errors +="Please Select Membership Type Category.<br>";
    }
    // check errors for year
    if(membershiptype.year==null){
        // radioContainer.style.borderBottom="2px solid pink";
        errors+="Please Select Year.<br>";
    }

    if(membershiptype.membershipfee == null){
        numberMembershipFee.style.borderBottom="2px solid pink";
        errors += "Please Enter Membership Fee.<br>";
    }
    if(membershiptype.renewalfee == null){
        numberRenewalFee.style.borderBottom="2px solid pink";
        errors += "Please Enter Renewal Fee.<br>";
    }
    if(membershiptype.borrowduration == null){
        numberBorrowDuration.style.borderBottom="2px solid pink";
        errors += "Please Enter Borrow Duration.<br>";
    }
    if(membershiptype.borrowlimit == null){
        numberBorrowLimit.style.borderBottom="2px solid pink";
        errors += "Please Enter Borrow Limit.<br>";
    }
    if(membershiptype.reservationduration == null){
        numberReservationDuration.style.borderBottom="2px solid pink";
        errors += "Please Enter Reservation Duration.<br>";
    }
    if(membershiptype.reservationlimit == null){
        numberReservationLimit.style.borderBottom="2px solid pink";
        errors += "Please Enter Reservation Limit.<br>";
    }
    if(membershiptype.reservationfee == null){
        numberReservationFee.style.borderBottom="2px solid pink";
        errors += "Please Enter Reservation Fee.<br>";
    }
    if(membershiptype.fineprice == null){
        numberDelayFineFee.style.borderBottom="2px solid pink";
        errors += "Please Enter Delay Fine Price.<br>";
    }
    if(membershiptype.membershiptypestatus_id == null){
        selectStatus.style.borderBottom="2px solid pink";
        errors += "Please Enter Status.<br>";
    }

    return errors;
}

// submit button function
const buttonMembershipTypeSubmit = () => {
    console.log(membershiptype);

    // check form has valid value
    let formErrors = checkMembershipTypeFormErrors();
    if (formErrors === "") {
        // form has not any errors
        Swal.fire({
            title: "Confirm Save",
            html: `<p>Are you sure to save this membership type record?</p>`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ff0000ff",
            cancelButtonColor: "rgb(0, 102, 255)",
            confirmButtonText: "Yes, Save",
            cancelButtonText: "Cancel",
            reverseButtons: true

        }).then((result) => {
            if (result.isConfirmed) {
                // call post service
                let postServiceResponse = getHttpServiceRequest("/membershiptype/insert", "POST", membershiptype);

                if (postServiceResponse == "OK") {
                    // save successs
                    Swal.fire({
                        title: "Saved!",
                        text: "Membership Type record saved successfully.",
                        icon: 'success',

                    });
                    refreshMembershipTypeTable();
                    refreshMembershipTypeForm();

                    // shift to tab pill table
                    tabpaneForm.classList.remove('show', 'active');
                    tabPaneTable.classList.add('show', 'active');
                    // shift to  table pill tab
                    tabPillForm.classList.remove('show', 'active');
                    tabPillTable.classList.add('show', 'active');

                } else {
                    // save not completed
                    Swal.fire({
                        title: 'Save Failed',
                        html: `<p>Membership Type record could not be saved.</p>
                <p>Details: ${postServiceResponse}</p>`,
                        confirmButtonText: 'OK'
                    });
                }
            } else {
                //get user confirm for form discard
                // can get user confrimation for form refresh
                Swal.fire({
                    title: "Confirm Refresh",
                    text: "Do you need to refresh membership type form ?",
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
        // default / prdefined library / custom
        Swal.fire({
            title: 'Save Failed',
            html: `<p>Form has Following Errors.</p>
                <p>${formErrors}</p>`,
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
}

// function to check updates
const checkmembershipTypeFormUpdates=()=>{
    let updates="";
    if(membershiptype!= null && oldMembershiptype!= null){
        if(membershiptype.membershiptypecategory_id.name != oldMembershiptype.membershiptypecategory_id.name){
            updates +="Membership Type Category is changed."+
                oldMembershiptype.membershiptypecategory_id.name+" into "+
                membershiptype.membershiptypecategory_id.name+
                ".<br>"
        }
        // year

        if(membershiptype.year != oldMembershiptype.year){
            updates+="Year is changed."+
                oldMembershiptype.year +" into "+
                membershiptype.year +
                ".<br>"
        }


        if(membershiptype.name != oldMembershiptype.name){
            updates+="Name is changed."+
                oldMembershiptype.name +" into "+
                membershiptype.name +
                ".<br>"
        }
        if(membershiptype.year != oldMembershiptype.year){
            updates+="Year is changed."+
                oldMembershiptype.year +" into "+
                membershiptype.year +
                ".<br>"
        }
        if(membershiptype.membershipduration != oldMembershiptype.membershipduration){
            updates+="Membership Duration is changed "+
                oldMembershiptype.membershipduration +" into "+
                membershiptype.membershipduration +
                ".<br>"
        }
        if(membershiptype.membershipfee != oldMembershiptype.membershipfee){
            updates+="Membership Fee is changed "+
                oldMembershiptype.membershipfee +" into "+
                membershiptype.membershipfee +
                ".<br>"
        }
        if(membershiptype.renewalfee != oldMembershiptype.renewalfee){
            updates+="Renewal Fee is changed "+
                oldMembershiptype.renewalfee +" into "+
                membershiptype.renewalfee +
                ".<br>"
        }
        if(membershiptype.borrowduration != oldMembershiptype.borrowduration){
            updates+="Borrow Duration is changed "+
                oldMembershiptype.borrowduration +" into "+
                membershiptype.borrowduration +
                ".<br>"
        }
        if(membershiptype.borrowlimit != oldMembershiptype.borrowlimit){
            updates+="Borrow Limit is changed "+
                oldMembershiptype.borrowlimit +" into "+
                membershiptype.borrowlimit +
                ".<br>"
        }
        if(membershiptype.reservationduration != oldMembershiptype.reservationduration){
            updates+="Reservation Duration is changed "+
                oldMembershiptype.reservationduration +" into "+
                membershiptype.reservationduration +
                ".<br>"
        }
        if(membershiptype.reservationlimit != oldMembershiptype.reservationlimit){
            updates+="Reservation Limit is changed "+
                oldMembershiptype.reservationlimit +" into "+
                membershiptype.reservationlimit +
                ".<br>"
        }
        if(membershiptype.reservationfee != oldMembershiptype.reservationfee){
            updates+="Reservation Fee is changed "+
                oldMembershiptype.reservationfee +" into "+
                membershiptype.reservationfee +
                ".<br>"
        }
        if(membershiptype.fineprice != oldMembershiptype.fineprice){
            updates+="Delay Fine Fee is changed "+
                oldMembershiptype.fineprice +" into "+
                membershiptype.fineprice +
                ".<br>"
        }
        if(membershiptype.membershiptypestatus_id.name != oldMembershiptype.membershiptypestatus_id.name){
            updates+="Status is changed "+
                oldMembershiptype.membershiptypestatus_id.name +" into "+
                membershiptype.membershiptypestatus_id.name +
                ".<br>"
        }
        if(membershiptype.description != oldMembershiptype.description){
            updates+="Description is changed "+
                oldMembershiptype.description +" into "+
                membershiptype.description +
                ".<br>"
        }

    }
    return updates;
}

// define function for update record
const buttonMembershipTypeUpdate = () => {
    // need to check  all required feild with valid value
    let formErrors = checkMembershipTypeFormErrors();
    if (formErrors == "") {
        let formUpdates = checkmembershipTypeFormUpdates();
        if (formUpdates == "") {
            //no updates
            Swal.fire({
                title: 'Update Failed',
                text: "Form has not any changes to update.",
                confirmButtonText: 'OK'
            });
        } else {
            //has updates
            Swal.fire({
                title: "Confirm Update",
                html: `<p>Are you sure to update this membership type record?</p>
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
                    let updateServiceResponse = getHttpServiceRequest("/membershiptype/update", "PUT", membershiptype);

                    if (updateServiceResponse == "OK") {
                        //user confrim update
                        Swal.fire({
                            title: "Updated!",
                            text: "Membership Type record updated successfully.",
                            icon: 'success',

                        });
                        //refresh form and table
                        refreshMembershipTypeTable();
                        refreshMembershipTypeForm();

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
                            html: `<p>Membership Type record could not be updated.</p>
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
};