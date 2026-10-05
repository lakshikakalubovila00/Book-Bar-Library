const tabpaneForm = document.getElementById("membershipRenewalTabPillForm");
const tabPaneTable = document.getElementById("membershipRenewalTabPillTable");
const tabPillForm = document.getElementById("membershipRenewalFormPill");
const tabPillTable = document.getElementById("membershipRenewalTablePill");

const tableBody = document.getElementById("tableBodyMemberships");

const  dateStartDateElement = document.getElementById("dateStartDate");
const dateEndDateElement = document.getElementById("dateEndDate");
const numberRenewMembershipFeeElement = document.getElementById("numberRenewMembershipFee");

const selectMembershipElement = document.getElementById("selectMembership");
const textMemberNoElement = document.getElementById("textMemberNo");
const selectStatusElement = document.getElementById("selectStatus");

window.addEventListener("load",()=>{
    // enable tooltip
    $('[data-bs-toggle="tooltip"]').tooltip();
    userPrivi=getHttpServiceRequest("/userprivilegebymodule?modulename=Renew-Membership")
    // call membership table refresh function
    refreshMembershipTable();
    // call new membership form refresh function
    refreshRenewMembershipForm();
})

$(function () {
    let holidays= getHttpServiceRequest("/holidays/alldata")

    $("#dateStartDate").datepicker({
        dateFormat: "yy-mm-dd",
        beforeShowDay: function (date){
            let month= String(date.getMonth()+1).padStart(2,'0');
            let day= String(date.getDate()).padStart(2,'0');
            let formattedDate = date.getFullYear() + "-" + month + "-" + day;
            for(let holiday of holidays){
                if(holiday.date=== formattedDate ){
                    return [true,"holiday-date",holiday.name];
                }
            }
            return[true,""];
        }
    });

});

// function for disable elements
const disableElement=()=>{
    textMemberNoElement.disabled=true;
    selectMembershipElement.disabled=true;
    dateStartDateElement.disabled=true;
    dateEndDateElement.disabled=true;
    numberRenewMembershipFeeElement.disabled=true;
    selectStatusElement.disabled=true;
    document.getElementById("textNote").disabled=true;
}

// function for refresh table
const refreshMembershipTable=()=>{

    // IF table is already DataTable THEN remove it THEN create new DataTable
    if ($.fn.DataTable.isDataTable('#tableMemberships')) {
        $('#tableMemberships').DataTable().destroy();
    }

    let memberships= ajaxGetrequest("/membership/alldata");

    let displayProperty=[
        {propertyName:getRegistrationType, dataType:"function"},
        {propertyName:getMemberNo, dataType:"function"},
        {propertyName:getMemberName, dataType:"function"},
        {propertyName:getMembershipType, dataType:"function"},
        {propertyName:"startdate", dataType:"string"},
        {propertyName:"enddate", dataType:"string"},
        {propertyName:getMembershipStatus, dataType:"function"}
    ]

    fillDataIntoTableEight(
        tableBody,
        memberships,
        displayProperty,
        refillRenewMembershipForm
    );
    buttonSubmit.classList.remove("d-none");
    buttonUpdate.classList.add("d-none");
    buttonPrint.classList.add("d-none");
    buttonDelete.classList.add("d-none");

    $("#tableMemberships").DataTable({
        responsive: true,
        autoWidth: false
    });
}

// define function for get registration type or membership category - new or renew
const getRegistrationType= (ob)=>{
    return ob.membershipcategory_id.name;
}

// define function for get member no
const getMemberNo=(ob)=>{
    return ob.member_id.memberno;
}

const getMemberName=(ob)=>{
    return ob.member_id.name;
}

// define function for get membership type
const getMembershipType=(ob)=>{
    return ob.membershiptype_id.name;
}

// define function for get membership status
const getMembershipStatus=(ob)=>{
    if(ob.membershipstatus_id.name=="Active"){
        return '<i class="fa-solid fa-circle-check fa-lg me-1 " style="color:rgb(0, 189, 72);"></i>';
    }
    if(ob.membershipstatus_id.name=="Expired"){
        return '<i class="fa-solid fa-calendar-xmark fa-lg me-1" style="color: #878787;"></i>';
    }
    if(ob.membershipstatus_id.name=="Cancelled"){
        return '<i class="fa-solid fa-ban fa-lg me-1" style="color: #75001d;"></i>';
    }
    if (ob.membershipstatus_id.name == "Deleted") {
        return '<i class="fa-solid fa-trash fa-lg" style="color: rgb(255, 0, 0);"></i>';
    }

}

// function for refill form
const refillRenewMembershipForm=(dataOb)=>{
    setInitial([
        textMemberNoElement,
        selectMembershipElement,
        dateStartDateElement,
        dateEndDateElement,
        numberRenewMembershipFeeElement,
        selectStatusElement,
        textNote
    ])
// shift to tab pane form
    tabpaneForm.classList.add('show', 'active');
    tabPaneTable.classList.remove('show', 'active');
    // shift to  form pill tab
    tabPillForm.classList.add('show', 'active');
    tabPillTable.classList.remove('show', 'active');

    membership= getHttpServiceRequest("/membership/byid/"+ dataOb.id);
    oldMembership =getHttpServiceRequest("/membership/byid/"+ dataOb.id);

    textMemberNoElement.value= membership.member_id.memberno ;
    textMemberNoElement.disabled=true;

    let memberType = membership.member_id.membertype;

    if (memberType == "Adult") {
        let membershipTypes = ajaxGetrequest("/adultmembershiptypes/valid");
        fillDataIntoSelect(selectMembershipElement, "Select Membership Type", membershipTypes, "name");
    } else {
        let membershipTypes = ajaxGetrequest("/childmembershiptypes/valid");
        fillDataIntoSelect(selectMembershipElement, "Select Membership Type", membershipTypes, "name");
    }

    selectMembershipElement.value= JSON.stringify(membership.membershiptype_id) ;
    selectMembershipElement.disabled=true;
    dateEndDateElement.value= membership.enddate ;
    numberRenewMembershipFeeElement.value= membership.fee ;
    selectStatusElement.value= JSON.stringify(membership.membershipstatus_id) ;
    selectStatusElement.disabled=false;

    if(membership.note != undefined || membership.note!= null){
        textNote.value= membership.note ;
    }else {
        textNote.value="";
    }

    dateStartDateElement.value= membership.startdate ;
    dateStartDateElement.max= getDateValue(new Date());
    dateStartDateElement.disabled=true;

    textMemberName.innerText= membership.member_id.name;

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

// define function for membership delete
const deleteMembershipRecord = (dataOb) => {
    //  confirmation
    membership = getHttpServiceRequest("/membership/byid/"+ dataOb.id)

    Swal.fire({
        title: "Confirm Deletion",
        html: `<p>Are you sure to Delete this Membership Record ?</p>
            <p>Membership Category : <strong>${membership.membershipcategory_id.name || ''}</strong></p>
          <p>Member Name : <strong>${membership.member_id.name || ''}</strong><br></p>
           <p>Membership Type : <strong>${membership.membershiptype_id.name || ''}</strong><br></p>`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ff0000ff",
        cancelButtonColor: "rgb(0, 102, 255)",
        confirmButtonText: "Yes, Delete",
        cancelButtonText: "Cancel",
        reverseButtons: true

    }).then((result) => {
        if (result.isConfirmed) {
            let deleteServiceResponse = getHttpServiceRequest("/membership/delete", "DELETE", dataOb)
            if (deleteServiceResponse == "OK") {
                Swal.fire({
                    title: "Deleted!",
                    text: "Membership Record Deleted Successfully.",
                    icon: 'success',

                });

                //refresh table
                refreshMembershipTable();
                refreshRenewMembershipForm();
                // shift to tab pane table
                tabpaneForm.classList.remove('show', 'active');
                tabPaneTable.classList.add('show', 'active');

                // shift to  table pill tab
                tabPillForm.classList.remove('show', 'active');
                tabPillTable.classList.add('show', 'active');
            } else {
                Swal.fire({
                    title: 'Deletion Failed',
                    html: `<p>Membership record could not be deleted.</p>
                <p>Details: ${deleteServiceResponse}</p>`,
                    confirmButtonText: 'OK'
                });
            }
        } else {
            //refresh table
        }
    })
}

// define function for membership print
const printMembershipRecord = (dataOb) => {
    let membershipModal_view = new bootstrap.Modal(
        document.getElementById("modalMembershipView"),
        {}
    );
    membershipModal_view.show();
    membership = getHttpServiceRequest("/membership/byid/"+ dataOb.id)

    tdMembershipCategory.innerText = dataOb.membershipcategory_id.name  ;
    tdMemberNo.innerText = dataOb.member_id.memberno  ;
    tdMemberName.innerText= dataOb.member_id.name;
    tdMembershipType.innerText = dataOb.membershiptype_id.name ;
    tdStartDate.innerText = dataOb.startdate  ;
    tdEndDate.innerText = dataOb.enddate  ;
    tdFee.innerText = dataOb.fee ;
    tdStatus.innerText = dataOb.membershipstatus_id.name  ;
    tdNote.innerText = dataOb.note  ;
}

const printMembership = () => {
    let tab = window.open();
    tab.document.write('<html>'
        + '<head><title>Print Membership Record</title>'
        + '<link rel="stylesheet" href="../resources/bootstrap-5.2.3/css/bootstrap.min.css"/>'
        + '</head>'
        + '<body>'
        + divCardPrintMembership.outerHTML
        + '</body></html>');

    setInterval(() => {
        tab.stop();
        tab.print();
        tab.close();
    }, 700);
}

const resetMembershipInfo = () => {
    textExistingMembership.innerText = " - ";
    textExistingMembershipStartDate.innerText = " - ";
    textExistingMembershipEndDate.innerText = " - ";
    textExistingMembershipStatus.innerText = " - ";

    selectMembershipElement.disabled=true;
    dateStartDateElement.disabled=true;
    dateEndDateElement.disabled=true;
    numberRenewMembershipFeeElement.disabled=true;
    selectStatusElement.disabled=true;
    document.getElementById("textNote").disabled=true;
};

// member no validate and set as member_id
textMemberNoElement.addEventListener("keyup", ()=>{
    const textMemberNoValue = textMemberNoElement.value;
    let pattern= "^MEM[0-9]{9}$";
    const regExpPttern= new RegExp(pattern);
    if(textMemberNoValue !=""){
        // value is not empty
        if(regExpPttern.test(textMemberNoValue)){
            // value is valid
            let memberByMemberNo= getHttpServiceRequest("/member/bymemberno/"+textMemberNoValue)
            if(memberByMemberNo && memberByMemberNo.id){
                // member found
                membership.member_id= memberByMemberNo;
                textMemberNoElement.style.borderBottom = " 2px solid lightgreen";
                console.log(membership);
                textMemberName.innerText=memberByMemberNo.name ;
                if(memberByMemberNo.memberphoto){
                    imgMemberPhoto.src= atob(memberByMemberNo.memberphoto);
                }else{
                    imgMemberPhoto.src="/resources/images/memberdefault.png";
                }

                let lastMembership= ajaxGetrequest("/membership/bymember/"+memberByMemberNo.id)

                if(!lastMembership){
                    resetMembershipInfo();
                    return;
                }
                textExistingMembership.innerText= lastMembership.membershiptype_id.name ?? " - " ;
                textExistingMembershipStartDate.innerText= lastMembership.startdate  ?? " - ";
                textExistingMembershipEndDate.innerText= lastMembership.enddate ?? " - " ;
                textExistingMembershipStatus.innerText= lastMembership.membershipstatus_id.name ?? " - " ;

                selectMembershipElement.disabled=false;
                dateStartDateElement.disabled=false;
                selectStatusElement.disabled=true;
                document.getElementById("textNote").disabled=false;

                let membertype= memberByMemberNo.membertype
                if(membertype=="Adult"){
                    let membershipTypes=ajaxGetrequest("/adultmembershiptypes/valid");
                    fillDataIntoSelect(selectMembership,"Select Membership Type",membershipTypes,"name");
                }else{
                    let membershipTypes=ajaxGetrequest("/childmembershiptypes/valid");
                    fillDataIntoSelect(selectMembership,"Select Membership Type",membershipTypes,"name");
                }

                let minMembershipStartDate = new Date(lastMembership.enddate);
                minMembershipStartDate.setDate(minMembershipStartDate.getDate() + 1);
                let today= new Date();
                if(today<minMembershipStartDate){
                     // member comes early
                    // only active the day after last membership end date

                    $("#dateStartDate").datepicker("setDate", minMembershipStartDate);

                    $("#dateStartDate").datepicker("option",{
                        dateFormat: "yy-mm-dd",
                        minDate: minMembershipStartDate,
                        maxDate: minMembershipStartDate,
                    });

                   // dateStartDateElement.value= getDateValue(minMembershipStartDate);
                    //dateStartDateElement.min=getDateValue(minMembershipStartDate);
                    //dateStartDateElement.max=getDateValue(minMembershipStartDate);
                    membership.startdate= dateStartDateElement.value;
                    dateStartDateElement.style.borderBottom="2px solid lightgreen";
                }else{
                    // member comes late
                    // if member has no books kept in the membership expired duration - start date is today
                    $("#dateStartDate").datepicker("setDate", today);

                    $("#dateStartDate").datepicker("option",{
                        dateFormat: "yy-mm-dd",
                        minDate: minMembershipStartDate,
                        maxDate: today,
                    });
                    //dateStartDateElement.value=getDateValue(today);
                    membership.startdate= dateStartDateElement.value;
                    dateStartDateElement.style.borderBottom="2px solid lightgreen";
                    // if member kept books in membership expired duration - start date is the day after last membership end date
                    //dateStartDateElement.min=getDateValue(minMembershipStartDate);
                    //dateStartDateElement.max= getDateValue(today);

                }


            }else{
                // member not found
                membership.member_id= null;
                textMemberNoElement.style.borderBottom = " 2px solid pink";

                textMemberName.innerText="-" ;
                textExistingMembership.innerText = " - ";
                textExistingMembershipStartDate.innerText = " - ";
                textExistingMembershipEndDate.innerText = " - ";
                textExistingMembershipStatus.innerText = " - ";
                imgMemberPhoto.src="/resources/images/memberdefault.png";

                selectMembershipElement.disabled=true;
                dateStartDateElement.disabled=true;
                dateEndDateElement.disabled=true;
                numberRenewMembershipFeeElement.disabled=true;
                selectStatusElement.disabled=true;
                document.getElementById("textNote").disabled=true;
            }

        }else{
            // value is invalid
            textMemberNoElement.style.borderBottom = " 2px solid pink";
            textMemberName.innerText="-" ;
            textExistingMembership.innerText = " - ";
            textExistingMembershipStartDate.innerText = " - ";
            textExistingMembershipEndDate.innerText = " - ";
            textExistingMembershipStatus.innerText = " - ";
            imgMemberPhoto.src="/resources/images/memberdefault.png";
        }
    }else{
        // value is empty
        if (textMemberNoElement.required) {
            textMemberNoElement.style.borderBottom = "2px solid pink";
            textMemberName.innerText="-" ;
            textExistingMembership.innerText = " - ";
            textExistingMembershipStartDate.innerText = " - ";
            textExistingMembershipEndDate.innerText = " - ";
            textExistingMembershipStatus.innerText = " - ";
            imgMemberPhoto.src="/resources/images/memberdefault.png";
        } else {
            textMemberNoElement.style.borderBottom = "white";
        }
    }
})

// get fee according to membership type
selectMembershipElement.addEventListener("change", ()=>{
    let membershipType = JSON.parse(selectMembership.value);
    membership.membershiptype_id = membershipType;

    // binding to membership object
    membership.fee= membershipType.renewalfee;
    //appear on ui
    numberRenewMembershipFee.value= membership.fee;
    // set valid color
    numberRenewMembershipFee.style.borderBottom="2px solid lightgreen";

})

// get end date according to start date and duration of membership type
const getEndDate=()=>{
    if (!selectMembership.value) return;
    let membershipType = JSON.parse(selectMembership.value);

    let duration = Number(membershipType.membershipduration);
    console.log(duration);

    // get start date value
    let startDateValue= new Date(dateStartDateElement.value);
    // return if no value in start date
    if(!startDateValue)return;


    // end sate value as Date  object and equal to start date
    let endDate = new Date(startDateValue);

    // value set to end date= start date + duration
    endDate.setDate(endDate.getDate()+duration-1);

    //Converts the end date to YYYY-MM-DD format
    dateEndDate.value =getDateValue(endDate);
    console.log(endDate)
    dateEndDate.style.borderBottom="2px solid lightgreen";
    membership.enddate= dateEndDate.value;
}

// function for refresh form
const refreshRenewMembershipForm=()=>{
    // clean static element- only value- empty static element
    membershipRenewForm.reset();

    if(!userPrivi.privi_insert){
        disableElement();
        buttonSubmit.classList.add("d-none");
        tabpaneForm.classList.remove('show', 'active');
        tabPillForm.classList.remove('show','active')
        tabPaneTable.classList.add('show', 'active');
        tabPillTable.classList.add('show','active')
    }
    // create new membership oject for store valid form value
    membership= new Object;

    setInitial([
        textMemberNoElement,
        selectMembershipElement,
        dateStartDateElement,
        dateEndDateElement,
        numberRenewMembershipFeeElement,
        selectStatusElement,
        textNote
    ])

    let membershipStatuses= ajaxGetrequest("/membershipstatus/alldata");
    fillDataIntoSelect(selectStatus,"Select Membership Status",membershipStatuses,"name");
    // auto select status - fill default value for membership status - Active
    selectStatusElement.value= JSON.stringify(membershipStatuses[0]);
    selectStatusElement.style.borderBottom="2px solid lightgreen";
    // binding to object
    membership.membershipstatus_id=membershipStatuses[0];
    selectStatusElement.disabled=true;

    selectMembershipElement.disabled=true;

    // setting membership category/ registration type as new
    let membershipCategories= ajaxGetrequest("/membershipcategory/alldata");
    membership.membershipcategory_id=membershipCategories[1];

}

// define check errors function
const checkRenewMembershipFormErrors=()=>{
    let errors="";
    if(membership.member_id==null){
        textMemberNoElement.style.borderBottom = "2px solid pink";
        errors += "Please Enter Member No.<br>";
    }

    if(membership.membershiptype_id==null){
        selectMembershipElement.style.borderBottom = "2px solid pink";
        errors += "Please Select Membership Type.<br>";
    }

    if(membership.startdate==null){
        dateStartDateElement.style.borderBottom = "2px solid pink";
        errors += "Please Select Start Date.<br>";
    }
    return errors;
}

// define function for submit form
const buttonRenewMembershipSubmit = () => {
    console.log(membership);

    // check form has valid value
    let formErrors = checkRenewMembershipFormErrors();
    if (formErrors === "") {
        Swal.fire({
            title: "Confirm Save",
            html: `<p>Are you sure to save this membership record?</p>`,
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
                let postServiceResponse = getHttpServiceRequest("/membership/insert", "POST", membership);
                if (postServiceResponse == "OK") {

                    let memberId = membership.member_id.id;

                    //get last record of a member's memberships
                    let lastMembership=ajaxGetrequest("/membership/bymember/"+memberId);

                    // save successs
                    Swal.fire({
                        title: "Saved!",
                        text: "Membership record saved successfully.",
                        icon: 'success',
                        confirmButtonText: "Proceed to Payment",
                        allowOutsideClick: false,   // block outside click
                        allowEscapeKey: false,
                    }).then((result)=>{
                        if (result.isConfirmed){
                            window.location.replace("/payment?membershipid="+lastMembership.id);
                        }
                    })
                    refreshMembershipTable();
                    refreshRenewMembershipForm();
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
                        html: `<p>Membership record could not be saved.</p>
                <p>Details: ${postServiceResponse}</p>`,
                        confirmButtonText: 'OK'
                    });
                }
            } else {
                //get user confirm for form discard
                // can get user confrimation for form refresh
                Swal.fire({
                    title: "Confirm Refresh",
                    text: "Do you need to refresh membership form ?",
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

// define function for check updates
const checkRenewMembershipFormUpdates=()=>{

    let updates="";
    if(membership != null && oldMembership != null){
        if(membership.member_id.memberno != oldMembership.member_id.memberno){
            updates += "Member No is changed " +
                oldMembership.member_id.memberno + " into " +
                membership.member_id.memberno +
                ".<br>";
        }
        if(membership.membershiptype_id.name != oldMembership.membershiptype_id.name){
            updates += "Membership Type is changed " +
                oldMembership.membershiptype_id.name + " into " +
                membership.membershiptype_id.name +
                ".<br>";
        }
        if(membership.startdate != oldMembership.startdate){
            updates += "Start Date is changed " +
                oldMembership.startdate + " into " +
                membership.startdate +
                ".<br>";
        }
        if(membership.enddate != oldMembership.enddate){
            updates += "End Date is changed " +
                oldMembership.enddate + " into " +
                membership.enddate +
                ".<br>";
        }
        if(membership.fee != oldMembership.fee){
            updates += "Fee is changed " +
                oldMembership.fee + " into " +
                membership.fee +
                ".<br>";
        }
        if(membership.membershipstatus_id.name != oldMembership.membershipstatus_id.name){
            updates += "Status is changed " +
                oldMembership.membershipstatus_id.name + " into " +
                membership.membershipstatus_id.name +
                ".<br>";
        }
        if(membership.note != oldMembership.note){
            updates += "Note is changed " +
                oldMembership.note + " into " +
                membership.note +
                ".<br>";
        }

    }
    return updates;
}

// define function for update record
const buttonRenewMembershipUpdate = () => {
    // need to check  all required feild with valid value
    let formErrors = checkRenewMembershipFormErrors();
    if (formErrors == "") {
        let formUpdates = checkRenewMembershipFormUpdates();
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
                html: `<p>Are you sure to update this membership record?</p>
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
                    let updateServiceResponse = getHttpServiceRequest("/membership/update", "PUT", membership);
                    if (updateServiceResponse == "OK") {
                        //user confrim update
                        Swal.fire({
                            title: "Updated!",
                            text: "Membership record updated successfully.",
                            icon: 'success',

                        });
                        //refresh form and table
                        refreshMembershipTable();
                        refreshRenewMembershipForm();

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
                            html: `<p>Membership record could not be updated.</p>
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
