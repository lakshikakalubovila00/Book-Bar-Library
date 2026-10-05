let tableBody= document.getElementById("tableBodyBookReservation");
const tabpaneForm = document.getElementById("bookReservationTabPillForm");
const tabPaneTable = document.getElementById("bookReservationTabPillTable");
const tabPillForm = document.getElementById("bookReservationFormPill");
const tabPillTable = document.getElementById("bookReservationTablePill");

const textMemberNoElement= document.getElementById("textMemberNo")
const textAccessionNoElement= document.getElementById("textAccessionNo")
const dateBookReserveDateElement= document.getElementById("dateBookReserveDate")
const dateBookBorrowDateElement= document.getElementById("dateBookBorrowDate")
const selectReservationStatusElement= document.getElementById("selectReservationStatus")
const textareaNoteElement= document.getElementById("textareaNote")

window.addEventListener("load",()=>{
    // enable tooltip
    $('[data-bs-toggle="tooltip"]').tooltip();
    userPrivi=getHttpServiceRequest("/userprivilegebymodule?modulename=Book-Reservation");
    // call refresh table function
    refreshReservationTable();
    // call refresh form function
    refreshReservationForm();

    let urlParam= window.location.search;
    let searchParams = new URLSearchParams(urlParam);

    if(searchParams.has("bookcopyId")){
        refillReservationFormFromOpac(searchParams.get("bookcopyId"));
        window.history.replaceState({}, document.title,"/reservation")
    }
})

$(function () {
    let holidays= getHttpServiceRequest("/holidays/alldata")

    $("#dateBookReserveDate").datepicker({
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

    $("#dateBookBorrowDate").datepicker({
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

const disableElement=()=>{
    textMemberNoElement.disabled=true;
    textAccessionNoElement.disabled=true;
    dateBookReserveDateElement.disabled=true;
    dateBookBorrowDateElement.disabled=true;
    selectReservationStatusElement.disabled=true;
    textareaNoteElement.disabled=true;
}

const refreshReservationTable=()=>{
    // IF table is already DataTable THEN remove it THEN create new DataTable
    if ($.fn.DataTable.isDataTable('#tableReservation')) {
        $('#tableReservation').DataTable().destroy();
    }

    let reservations = ajaxGetrequest("/reservation/alldata");

    // property array
    let displayProperty = [
        { propertyName: "reservationno", dataType: "string" },
        { propertyName: getAccessionNo, dataType: "function" },
        { propertyName: getBookName, dataType: "function" },
        { propertyName: getMemberNo, dataType: "function" },
        { propertyName: getMemberName, dataType: "function" },
        { propertyName: "reserveddate", dataType: "string" },
        { propertyName: "borrowdate", dataType: "string" },
        { propertyName: getReservationStatus, dataType: "function" }
    ];

    //fill data into table function
    fillDataIntoTableEight(
        tableBody,
        reservations,
        displayProperty,
        refillReservationForm
    );

    buttonSubmit.classList.remove("d-none");
    buttonUpdate.classList.add("d-none");
    buttonPrint.classList.add("d-none");
    buttonDelete.classList.add("d-none");

    $("#tableReservation").DataTable({
        responsive: true,
        autoWidth: false
    });
}

const getAccessionNo=(ob)=>{
    return ob.bookcopy_id.accessionno;
}

const getBookName=(ob)=>{
    return ob.bookcopy_id.book_id.title;
}

const getMemberNo=(ob)=>{
    return ob.member_id.memberno;
}

const getMemberName=(ob)=>{
    return ob.member_id.name;
}

const getReservationStatus=(ob)=>{
    if (ob.reservationstatus_id.name == "Pending") {
        return '<i class="fa-solid fa-clock fa-lg me-1 ms-2" style="color: #ff9500;"></i>';
    }
    if (ob.reservationstatus_id.name == "Approved") {
        return '<i class="fa-solid fa-check-to-slot fa-lg me-1 ms-2" style="color: rgb(29, 206, 153);"></i>';
    }
    if (ob.reservationstatus_id.name == "Issued") {
        return '<i class="fa-solid fa-download fa-lg me-1" style="color: #4bb1ff;"></i>';
    }
    if (ob.reservationstatus_id.name == "Cancelled") {
        return '<i class="fa-solid fa-xmark fa-lg me-1" style="color: #ff0000;"></i>';
    }
    if (ob.reservationstatus_id.name == "Expired") {
        return '<i class="fa-solid fa-calendar-xmark fa-lg me-1" style="color: #878787;"></i>';
    }
    if (ob.reservationstatus_id.name == "Deleted") {
        return '<i class="fa-solid fa-trash fa-lg me-1" style="color: rgb(255, 0, 0);"></i>';
    }
}

const resetMembershipInfo = () => {
    textMemberName.innerText="-" ;
    textReservationDuration.innerText="-" ;
    textReservationLimit.innerText="-" ;
    textReservedBookCount.innerText="-" ;
    textRemainingReservationLimit.innerText="-" ;
    textReservationFee.innerText="-" ;
    imgMemberPhoto.src="/resources/images/memberdefault.png";
};

// member no validate and set as member_id
textMemberNoElement.addEventListener("keyup", ()=>{
    const textMemberNoValue = textMemberNoElement.value;
    let pattern= "^[M][E][M][0-9]{9}$";
    const regExpPattern= new RegExp(pattern);
    if(textMemberNoValue !=""){
        // value is not empty
        if(regExpPattern.test(textMemberNoValue)){
            // value is valid
            let memberByMemberNo= getHttpServiceRequest("/member/bymemberno/"+textMemberNoValue)
            if(memberByMemberNo && memberByMemberNo.id){
                // member found
                reservation.member_id= memberByMemberNo;
                textMemberNoElement.style.borderBottom = " 2px solid lightgreen";
                console.log(reservation);

                textAccessionNoElement.disabled=false;

                textMemberName.innerText=memberByMemberNo.name ;

                if(memberByMemberNo.memberphoto){
                    imgMemberPhoto.src= atob(memberByMemberNo.memberphoto);
                }else{
                    imgMemberPhoto.src="/resources/images/memberdefault.png";
                }

                let lastMembershipByMemberNo= getHttpServiceRequest("/membership/bymember/"+memberByMemberNo.id);

                if(!lastMembershipByMemberNo){
                    resetMembershipInfo();
                    textAccessionNoElement.disabled=true;
                    return;
                }

                if(lastMembershipByMemberNo && lastMembershipByMemberNo.id){

                    let membershipEndDate= lastMembershipByMemberNo.enddate;
                    let reserveDate= getDateValue(new Date());
                    if(reserveDate>=membershipEndDate){
                        Swal.fire({
                            icon: 'warning',
                            title: "Membership Expired",
                            html: ` <p>Member Name : <strong>${memberByMemberNo.name || ''}</strong><br></p>
                                    <p>Member No : <strong>${memberByMemberNo.memberno || ''}</strong><br></p>
                                    <p>Membership Start Date : <strong>${lastMembershipByMemberNo.startdate || ''}</strong><br></p>
                                     <p>Membership End Date : <strong>${lastMembershipByMemberNo.enddate|| ''}</strong><br></p>
                                     <p>Please renew membership before reserve book.</p>`,
                            confirmButtonText: 'OK'
                        })
                        textAccessionNoElement.disabled=true;
                        return;
                    }

                    textReservationDuration.innerText= lastMembershipByMemberNo.membershiptype_id.reservationduration;
                    textReservationLimit.innerText= lastMembershipByMemberNo.membershiptype_id.reservationlimit;
                    let reservationLimit= lastMembershipByMemberNo.membershiptype_id.reservationlimit;
                    textReservationFee.innerText= lastMembershipByMemberNo.membershiptype_id.reservationfee;

                    updateBorrowDateRange();

                    // books on hand from borrow
                    // member -> borrow -> borrow has book copy -> how many books
                    let reservedBookCount = getHttpServiceRequest("/reservation/reservedcount/" + memberByMemberNo.id);
                    textReservedBookCount.innerText= reservedBookCount;
                    // remaining limit calculate
                    let remainingReservationLimit = reservationLimit - reservedBookCount;
                    textRemainingReservationLimit.innerText = remainingReservationLimit;
                    textAccessionNoElement.disabled=false;
                }
            }else{
                // member not found
                reservation.member_id= null;
                textMemberNoElement.style.borderBottom = " 2px solid pink";
                textMemberName.innerText="-" ;
                textReservationDuration.innerText="-" ;
                textReservationLimit.innerText="-" ;
                textReservedBookCount.innerText="-" ;
                textRemainingReservationLimit.innerText="-" ;
                textReservationFee.innerText="-" ;
                imgMemberPhoto.src="/resources/images/memberdefault.png";
                textAccessionNoElement.disabled=true;
            }

        }else{
            // value is invalid
            textMemberNoElement.style.borderBottom = " 2px solid pink";
            textMemberName.innerText="-" ;
            textReservationDuration.innerText="-" ;
            textReservationLimit.innerText="-" ;
            textReservedBookCount.innerText="-" ;
            textRemainingReservationLimit.innerText="-" ;
            textReservationFee.innerText="-" ;
            imgMemberPhoto.src="/resources/images/memberdefault.png";
        }
    }else{
        // value is empty
        if (textMemberNoElement.required) {
            textMemberNoElement.style.borderBottom = "2px solid pink";
            textMemberName.innerText="-" ;
            textReservationDuration.innerText="-" ;
            textReservationLimit.innerText="-" ;
            textReservedBookCount.innerText="-" ;
            textRemainingReservationLimit.innerText="-" ;
            textReservationFee.innerText="-" ;
            imgMemberPhoto.src="/resources/images/memberdefault.png";
        }else {
            textMemberNoElement.style.borderBottom = "white";
        }
    }
})

// validate book copy's accession no
textAccessionNoElement.addEventListener("keyup",()=>{
    const textAccessionNoValue= textAccessionNoElement.value;
    let pattern ="^[B][0-9]{7}[C][0-9]{3}$";
    const regExppattern= new RegExp(pattern);
    if(textAccessionNoValue!=""){
        // value is not empty
        if(regExppattern.test(textAccessionNoValue)){
            //value is valid
            // book copy status - Available , Borrowed , but not fully damaged and lost
            let bookCopyByAccessionNo= getHttpServiceRequest("/bookcopyforreservation/byaccessionno/"+textAccessionNoValue);
            if(bookCopyByAccessionNo){
                textBookTitle.innerText= bookCopyByAccessionNo.book_id.title ;
                textBookCopyStatus.innerText= bookCopyByAccessionNo.bookcopystatus_id.name ;

                reservation.bookcopy_id= bookCopyByAccessionNo;
                textAccessionNoElement.style.borderBottom = " 2px solid lightgreen";

                if(bookCopyByAccessionNo.book_id.coverimage){
                    imgBookPhoto.src= atob(bookCopyByAccessionNo.book_id.coverimage);
                }else{
                    imgBookPhoto.src="/resources/images/bookdefault.png";
                }

                /// *************************************** ///
                if(bookCopyByAccessionNo.isreserved==true){

                    // book is reserved
                    let reserveBookCopyList= getHttpServiceRequest("/reservation/bybookcopyid/"+bookCopyByAccessionNo.id);

                    textIsReserved.innerText= "Yes";

                    let noofReservations= getHttpServiceRequest("/reservationcount/bybookcopyid/"+bookCopyByAccessionNo.id);
                    textNoofReservations.innerText= noofReservations;

                    if(bookCopyByAccessionNo.bookcopystatus_id.name==="Available" || bookCopyByAccessionNo.bookcopystatus_id.name==="Borrowed"){
                        // available at the library
                        // have to get latest reservation by reservation list
                        reserveBookCopyList.sort((a,b)=>{
                            return new Date(b.borrowdate) - new Date(a.borrowdate)
                        })
                        let latestReservation= reserveBookCopyList[0];

                        // expected handover due date
                        let xBorrowDate = new Date(latestReservation.borrowdate);

                        let membersMembership= getHttpServiceRequest("/membership/bymember/"+ latestReservation.member_id.id)
                        let borrowDuration= Number(membersMembership.membershiptype_id.borrowduration);

                        let expectedHandoverDate= new Date(xBorrowDate);
                        expectedHandoverDate.setDate(expectedHandoverDate.getDate()+borrowDuration);

                        textExpectedHandoverDueDate.innerText=getDateValue(expectedHandoverDate);
                        console.log(expectedHandoverDate);

                        // book borrow date range
                        let textMemberNoValue = textMemberNoElement.value;
                        let member = getHttpServiceRequest("/member/bymemberno/"+textMemberNoValue)
                        if (!member || !member.id) {
                            // dateBookBorrowDateElement.min = "";
                            // dateBookBorrowDateElement.max = "";
                            $("#dateBookBorrowDate").datepicker("option",{
                                dateFormat: "yy-mm-dd",
                                minDate: null,
                                maxDate: null,
                            });
                            return;
                        }
                        let membership= getHttpServiceRequest("/membership/bymember/"+member.id)

                        if (!membership || !membership.membershiptype_id) {
                            // dateBookBorrowDateElement.min = "";
                            // dateBookBorrowDateElement.max = "";
                            $("#dateBookBorrowDate").datepicker("option",{
                                dateFormat: "yy-mm-dd",
                                minDate: null,
                                maxDate: null,
                            });
                            return;
                        }
                        let reservationDuration= Number(membership.membershiptype_id.reservationduration);

                        // book borrow date range
                        console.log(expectedHandoverDate)
                        // dateBookBorrowDateElement.min=getDateValue(expectedHandoverDate);
                        let maxDate=new Date(expectedHandoverDate);
                        maxDate.setDate(maxDate.getDate()+reservationDuration)
                        //dateBookBorrowDateElement.max= getDateValue(maxDate);

                        console.log(expectedHandoverDate);
                        console.log(maxDate)

                        $("#dateBookBorrowDate").datepicker("option",{
                            dateFormat: "yy-mm-dd",
                            minDate: expectedHandoverDate,
                            maxDate: maxDate,
                        });
                    }
                }
                else{
                    // book is not reserved
                    textIsReserved.innerText= "No";
                    textNoofReservations.innerText= "-";

                    if(bookCopyByAccessionNo.bookcopystatus_id.name==="Available"){
                        // available at the library

                        // expected handover due date
                        textExpectedHandoverDueDate.innerText="-";

                        let textMemberNoValue = textMemberNoElement.value;
                        let member = getHttpServiceRequest("/member/bymemberno/"+textMemberNoValue)
                        if (!member || !member.id) {
                            // dateBookBorrowDateElement.min = "";
                            // dateBookBorrowDateElement.max = "";
                            $("#dateBookBorrowDate").datepicker("option",{
                                dateFormat: "yy-mm-dd",
                                minDate: null,
                                maxDate: null,
                            });
                            return;
                        }
                        let membership= getHttpServiceRequest("/membership/bymember/"+member.id)

                        if (!membership || !membership.membershiptype_id) {
                            // dateBookBorrowDateElement.min = "";
                            // dateBookBorrowDateElement.max = "";
                            $("#dateBookBorrowDate").datepicker("option",{
                                dateFormat: "yy-mm-dd",
                                minDate: null,
                                maxDate: null,
                            });
                            return;
                        }
                        let reservationDuration= Number(membership.membershiptype_id.reservationduration);

                        // book borrow date range
                        let reserveDate= new Date(dateBookReserveDateElement.value);
                        //dateBookBorrowDateElement.min=getDateValue(reserveDate);

                        let maxDate=new Date(reserveDate);
                        maxDate.setDate(maxDate.getDate()+reservationDuration)
                        //dateBookBorrowDateElement.max= getDateValue(maxDate);

                        $("#dateBookBorrowDate").datepicker("option",{
                            dateFormat: "yy-mm-dd",
                            minDate: reserveDate,
                            maxDate: maxDate,
                        });
                    }
                    if(bookCopyByAccessionNo.bookcopystatus_id.name==="Borrowed"){
                        // borrowed

                        // expected handover due date
                        let borrowHasBookCopy= getHttpServiceRequest("/borrowhasbookcopy/bybookcopyid/"+bookCopyByAccessionNo.id);
                        if(borrowHasBookCopy.renewhandoverduedate== null || borrowHasBookCopy.renewhandoverduedate==undefined){
                            // not renewed
                            textExpectedHandoverDueDate.innerText=borrowHasBookCopy.borrow_id.handoverduedate;
                        }else{
                            // renewed
                            textExpectedHandoverDueDate.innerText=borrowHasBookCopy.renewhandoverduedate;
                        }

                        // book borrow date range
                        let textMemberNoValue = textMemberNoElement.value;
                        let member = getHttpServiceRequest("/member/bymemberno/"+textMemberNoValue)
                        if (!member || !member.id) {
                            // dateBookBorrowDateElement.min = "";
                            // dateBookBorrowDateElement.max = "";
                            $("#dateBookBorrowDate").datepicker("option",{
                                dateFormat: "yy-mm-dd",
                                minDate: null,
                                maxDate: null,
                            });
                            return;
                        }
                        let membership= getHttpServiceRequest("/membership/bymember/"+member.id)

                        if (!membership || !membership.membershiptype_id) {
                            // dateBookBorrowDateElement.min = "";
                            // dateBookBorrowDateElement.max = "";
                            $("#dateBookBorrowDate").datepicker("option",{
                                dateFormat: "yy-mm-dd",
                                minDate: null,
                                maxDate: null,
                            });
                            return;
                        }
                        let reservationDuration= Number(membership.membershiptype_id.reservationduration);

                        // book borrow date range
                        let expectedHandoverDate= new Date(textExpectedHandoverDueDate.innerText);
                        console.log(expectedHandoverDate)
                        //dateBookBorrowDateElement.min=getDateValue(expectedHandoverDate);

                        let maxDate=new Date(expectedHandoverDate);
                        maxDate.setDate(maxDate.getDate()+reservationDuration)
                        //dateBookBorrowDateElement.max= getDateValue(maxDate);

                        $("#dateBookBorrowDate").datepicker("option",{
                            dateFormat: "yy-mm-dd",
                            minDate: expectedHandoverDate,
                            maxDate: maxDate,
                        });
                    }
                }
            }else{
                // book copy is deleted or reference
                textBookTitle.innerText= "-" ;
                textBookCopyStatus.innerText="-" ;
                textExpectedHandoverDueDate.innerText="-";

                textIsReserved.innerText= "-";
                textNoofReservations.innerText="-"
            }


        }else {
            // value is invalid
            // invalid scenarios
            // accession no pattern wrong or number not exist
            // damage status - fully damaged, lost
            // book copy status - reference , deleted
            textAccessionNoElement.style.borderBottom = " 2px solid pink";
            reservation.bookcopy_id= null;
            textBookTitle.innerText= "-" ;
            textBookCopyStatus.innerText="-" ;
            textExpectedHandoverDueDate.innerText="-";

            textIsReserved.innerText= "-";
            textNoofReservations.innerText="-"


            imgBookPhoto.src="/resources/images/bookdefault.png";
        }
    }else{
        // value is empty
        if (textAccessionNoElement.required) {
            reservation.bookcopy_id= null;
            textAccessionNoElement.style.borderBottom = "2px solid pink";
            textBookTitle.innerText= "-" ;
            textBookCopyStatus.innerText="-" ;
            textExpectedHandoverDueDate.innerText="-";

            textIsReserved.innerText= "-";
            textNoofReservations.innerText="-"

            imgBookPhoto.src="/resources/images/bookdefault.png";
        }
    }
})

const checkMembershipEndDateWithBorrowDate=()=>{
    let borrowDate= dateBookBorrowDateElement.value;
    const textMemberNoValue = textMemberNoElement.value;
    let memberByMemberNo= getHttpServiceRequest("/member/bymemberno/"+textMemberNoValue)
    let lastMembershipByMemberNo= getHttpServiceRequest("/membership/bymember/"+memberByMemberNo.id);

    if(lastMembershipByMemberNo && lastMembershipByMemberNo.id) {

        let membershipEndDate = lastMembershipByMemberNo.enddate;
        if (borrowDate > membershipEndDate) {
            Swal.fire({
                icon: 'warning',
                title: "The selected borrow date exceeds the member's membership end date.",
                html: ` <p>Member Name : <strong>${memberByMemberNo.name || ''}</strong><br></p>
                        <p>Member No : <strong>${memberByMemberNo.memberno || ''}</strong><br></p>
                        <p>Membership Start Date : <strong>${lastMembershipByMemberNo.startdate || ''}</strong><br></p>
                         <p>Membership End Date : <strong>${lastMembershipByMemberNo.enddate || ''}</strong><br></p>
                         <p>Selected Borrow Date : <strong>${borrowDate || ''}</strong><br></p>
                         <p>Please renew membership before reserve book.</p>`,
                confirmButtonText: 'OK'
            })
            buttonSubmit.disabled = true;
            return;
        }
    }
}

const updateBorrowDateRange = () => {

    if(!reservation.bookcopy_id || !reservation.member_id){
        $("#dateBookBorrowDate").datepicker("option",{
            minDate:null,
            maxDate:null
        });
        return;
    }

    let membership = getHttpServiceRequest("/membership/bymember/" + reservation.member_id.id);

    if(!membership){
        return;
    }

    let reservationDuration = Number(membership.membershiptype_id.reservationduration);

    let minDate;

    if(textExpectedHandoverDueDate.innerText !== "-" &&
        textExpectedHandoverDueDate.innerText !== ""){
        minDate = new Date(textExpectedHandoverDueDate.innerText);
    }else{
        minDate = new Date(dateBookReserveDateElement.value);
    }

    let maxDate = new Date(minDate);
    maxDate.setDate(maxDate.getDate() + reservationDuration);

    $("#dateBookBorrowDate").datepicker("option",{
        minDate:minDate,
        maxDate:maxDate
    });

    $("#dateBookBorrowDate").datepicker("refresh");
}

const refillReservationFormFromOpac=(bookcopyId)=>{

    // create new object
    reservation= new Object();

    imgMemberPhoto.src="/resources/images/memberdefault.png";
    imgBookPhoto.src="/resources/images/bookdefault.png";
    imgPaySlipPhoto.src="/resources/images/payslip.png";

    textMemberName.innerText="" ;
    textReservationDuration.innerText="" ;
    textReservationLimit.innerText="" ;
    textReservedBookCount.innerText="" ;
    textRemainingReservationLimit.innerText="" ;
    textReservationFee.innerText="" ;

    let bookcopy = getHttpServiceRequest("/bookcopy/byid/" + bookcopyId);

    // book copy status- Available, Reserved , Borrowed , but not fully damaged and lost
    let bookCopyByAccessionNo= getHttpServiceRequest("/bookcopyforreservation/byaccessionno/"+bookcopy.accessionno);

    textBookTitle.innerText= bookCopyByAccessionNo.book_id.title ;
    textBookCopyStatus.innerText= bookCopyByAccessionNo.bookcopystatus_id.name ;

    reservation.bookcopy_id= bookCopyByAccessionNo;
    textAccessionNoElement.value= bookCopyByAccessionNo.accessionno;
    textAccessionNoElement.style.borderBottom = " 2px solid lightgreen";

    if(bookCopyByAccessionNo.book_id.coverimage){
        imgBookPhoto.src= atob(bookCopyByAccessionNo.book_id.coverimage);
    }else{
        imgBookPhoto.src="/resources/images/bookdefault.png";
    }

    if(bookcopy.isreserved==true){

        // book is reserved
        let reserveBookCopyList = getHttpServiceRequest("/reservation/bybookcopyid/"+bookcopy.id);

        textIsReserved.innerText= "Yes";

        let noofReservations= getHttpServiceRequest("/reservationcount/bybookcopyid/"+bookCopyByAccessionNo.id);
        textNoofReservations.innerText= noofReservations;

        if(bookcopy.bookcopystatus_id.name==="Available" || bookcopy.bookcopystatus_id.name==="Borrowed"){
            // available at the library

            // have to get latest reservation by reservation list
            reserveBookCopyList.sort((a,b)=>{
                return new Date(b.borrowdate) - new Date(a.borrowdate)
            })
            let latestReservation = reserveBookCopyList[0];

            // expected handover due date
            let xBorrowDate = new Date(latestReservation.borrowdate);

            let reservedMemberMembership= getHttpServiceRequest("/membership/bymember/"+ latestReservation.member_id.id)
            let borrowDuration= Number(reservedMemberMembership.membershiptype_id.borrowduration);

            let expectedHandoverDate= new Date(xBorrowDate);
            expectedHandoverDate.setDate(expectedHandoverDate.getDate()+borrowDuration);
            textExpectedHandoverDueDate.innerText=getDateValue(expectedHandoverDate);
            console.log(expectedHandoverDate);

            // book borrow date range

            //dateBookBorrowDateElement.min=getDateValue(expectedHandoverDate);
            let maxDate=new Date(expectedHandoverDate);
            maxDate.setDate(maxDate.getDate()+reservationDuration)
            //dateBookBorrowDateElement.max= getDateValue(maxDate);

            $("#dateBookBorrowDate").datepicker("option",{
                dateFormat: "yy-mm-dd",
                minDate: expectedHandoverDate,
                maxDate: maxDate,
            });
        }
    }
    else{
        // book is not reserved

        textIsReserved.innerText= "No";
        textNoofReservations.innerText= "-";

        if(bookcopy.bookcopystatus_id.name==="Available"){
            // available at the library

            // expected handover due date
            textExpectedHandoverDueDate.innerText="-";

            // book borrow date range
            let reserveDate= new Date(dateBookReserveDateElement.value);
            //dateBookBorrowDateElement.min=getDateValue(reserveDate);

            $("#dateBookBorrowDate").datepicker("option",{
                dateFormat: "yy-mm-dd",
                minDate: reserveDate,
            });
        }
        if(bookcopy.bookcopystatus_id.name==="Borrowed"){
            // borrowed

            // expected handover due date
            let borrowHasBookCopy= getHttpServiceRequest("/borrowhasbookcopy/bybookcopyid/"+bookcopy.id);
            if(borrowHasBookCopy.renewhandoverduedate== null || borrowHasBookCopy.renewhandoverduedate==undefined){
                // not renewed
                textExpectedHandoverDueDate.innerText=borrowHasBookCopy.borrow_id.handoverduedate;
            }else{
                // renewed
                textExpectedHandoverDueDate.innerText=borrowHasBookCopy.renewhandoverduedate;
            }

            // book borrow date range
            let expectedHandoverDate= new Date(textExpectedHandoverDueDate.innerText);
            console.log(expectedHandoverDate)

            $("#dateBookBorrowDate").datepicker("option",{
                dateFormat: "yy-mm-dd",
                minDate: expectedHandoverDate,
                maxDate: null,
            });
        }
    }

    let reservationStatus= ajaxGetrequest("/reservationstatus/alldata")
    fillDataIntoSelect(selectReservationStatusElement, "Select Reservation Status", reservationStatus, "name")

    setInitial([
        textMemberNoElement,
        textAccessionNoElement,
        dateBookReserveDateElement,
        dateBookBorrowDateElement,
        selectReservationStatusElement,
        textareaNoteElement,
    ])
    selectReservationStatusElement.value=JSON.stringify(reservationStatus[0])
    selectReservationStatusElement.style.borderBottom="2px solid lightgreen"
    reservation.reservationstatus_id=reservationStatus[0];
    selectReservationStatusElement.disabled=true;

    let today= new Date();
    $("#dateBookReserveDate").datepicker("setDate", today);

    $("#dateBookReserveDate").datepicker("option",{
        dateFormat: "yy-mm-dd",
        minDate: today,
        maxDate: today,
    });
    // dateBookReserveDateElement.min= getDateValue(today);
    //dateBookReserveDateElement.max= getDateValue(today);
    //dateBookReserveDateElement.value= getDateValue(today);
    dateBookReserveDateElement.style.borderBottom="2px solid lightgreen";
    reservation.reserveddate= dateBookReserveDateElement.value;
}

const refillReservationForm=(dataOb)=>{
    setInitial([
        textMemberNoElement,
        textAccessionNoElement,
        dateBookReserveDateElement,
        dateBookBorrowDateElement,
        selectReservationStatusElement,
        textareaNoteElement,
    ])
    // shift to tab pane form
    tabpaneForm.classList.add('show', 'active');
    tabPaneTable.classList.remove('show', 'active');
    // shift to  form pill tab
    tabPillForm.classList.add('show', 'active');
    tabPillTable.classList.remove('show', 'active');

    reservation= getHttpServiceRequest("/reservation/byid/"+ dataOb.id)
    oldReservation= getHttpServiceRequest("/reservation/byid/"+ dataOb.id)

    if(reservation.member_id.memberphoto!=null){
        imgMemberPhoto.src= atob(reservation.member_id.memberphoto);
    }else{
        imgMemberPhoto.src="/resources/images/memberdefault.png";
    }

    // member no
    textMemberNoElement.value= reservation.member_id.memberno;
    textMemberName.innerText=reservation.member_id.name ;
    let lastMembershipByMemberNo= getHttpServiceRequest("/membership/bymember/"+reservation.member_id.id);
    if(lastMembershipByMemberNo && lastMembershipByMemberNo.id) {
        textReservationDuration.innerText = lastMembershipByMemberNo.membershiptype_id.reservationduration;
        textReservationLimit.innerText = lastMembershipByMemberNo.membershiptype_id.reservationlimit;
        let reservationLimit = lastMembershipByMemberNo.membershiptype_id.reservationlimit;
        textReservationFee.innerText = lastMembershipByMemberNo.membershiptype_id.reservationfee;

        // books on hand from borrow
        // member -> borrow -> borrow has book copy -> how many books
        let reservedBookCount = getHttpServiceRequest("/reservation/reservedcount/" + reservation.member_id.id);
        textReservedBookCount.innerText = reservedBookCount;
        // remaining limit calculate
        let remainingReservationLimit = reservationLimit - reservedBookCount;
        textRemainingReservationLimit.innerText = remainingReservationLimit;
    }

    if(reservation.bookcopy_id.book_id.coverimage!=null){
        imgBookPhoto.src= atob(reservation.bookcopy_id.book_id.coverimage);
    }else{
        imgBookPhoto.src="/resources/images/bookdefault.png";
    }

    // accession no
    textAccessionNoElement.value= reservation.bookcopy_id.accessionno;

    let bookCopyByAccessionNo= getHttpServiceRequest("/bookcopy/byaccessionno/"+reservation.bookcopy_id.accessionno);
    if(bookCopyByAccessionNo && bookCopyByAccessionNo.id){
        // book copy found - available
        textBookTitle.innerText= bookCopyByAccessionNo.book_id.title ;
        textBookCopyStatus.innerText= "-";
        textExpectedHandoverDueDate.innerText="-";

        textIsReserved.innerText= "-";
        textNoofReservations.innerText= "-";

    }
    // reserved date
    dateBookReserveDateElement.value= reservation.reserveddate;
    // borrow date
    dateBookBorrowDateElement.value= reservation.borrowdate;
    // status
    selectReservationStatusElement.value= JSON.stringify(reservation.reservationstatus_id)
    selectReservationStatusElement.disabled=false;

    // pay slip
    //photo - optional
    if(reservation.payslipphoto!=null){
        imgPaySlipPhoto.src= atob(reservation.payslipphoto);
    }else{
        imgPaySlipPhoto.src="/resources/images/payslip.png";
    }
    // note
    textareaNoteElement.value= reservation.note;

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

// define function for  delete
const deleteReservationRecord = (dataOb) => {
    // confrimation
    reservation = getHttpServiceRequest("reservation/byid/"+dataOb.id)
    Swal.fire({
        title: "Confirm Deletion",
        html: `<p>Are you sure to Delete this Reservation Record ?</p>
          <p>Reservation No <strong>${reservation.reservationno || ''}</strong><br>
          Member Name : <strong>${reservation.member_id.name || ''}</strong><br>
           Book name : <strong>${reservation.bookcopy_id.book_id.title || ''}</strong></p>`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ff0000ff",
        cancelButtonColor: "rgb(0, 102, 255)",
        confirmButtonText: "Yes, Delete",
        cancelButtonText: "Cancel",
        reverseButtons: true

    }).then((result) => {
        if (result.isConfirmed) {
            let deleteServiceResponse = getHttpServiceRequest("/reservation/delete", "DELETE", dataOb)
            if (deleteServiceResponse == "OK") {
                Swal.fire({
                    title: "Deleted!",
                    text: "Reservation Record Deleted Successfully.",
                    icon: 'success',
                });
                //refresh table
                refreshReservationTable();
                // refresh form
                refreshReservationForm();
                // shift to tab pane table
                tabpaneForm.classList.remove('show', 'active');
                tabPaneTable.classList.add('show', 'active');
                // shift to  table pill tab
                tabPillForm.classList.remove('show', 'active');
                tabPillTable.classList.add('show', 'active');
            } else {
                Swal.fire({
                    title: 'Deletion Failed',
                    html: `<p>Reservation Record Could not be Deleted.</p>
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
const printReservationRecord = (dataOb) => {
    let reservationModal_view = new bootstrap.Modal(
        document.getElementById("modalReservationView"), {}
    );
    reservationModal_view.show();
    tdReservationNo.innerText= dataOb.reservationno  ;
    tdMemberNo.innerText= dataOb.member_id.memberno  ;
    tdMemberName.innerText= dataOb.member_id.name  ;
    tdAccessionNo.innerText= dataOb.bookcopy_id.accessionno  ;
    tdBookTitle.innerText= dataOb.bookcopy_id.book_id.title  ;
    tdReserveDate.innerText= dataOb.reserveddate  ;
    tdBorrowDate.innerText= dataOb.borrowdate  ;
    tdReservationStatus.innerText= dataOb.reservationstatus_id.name  ;
    tdNote.innerText= dataOb.note  ;
}

// print function
const printReservation = () => {
    let tab = window.open();
    tab.document.write('<html>'
        + '<head><title>Print Reservation Record</title>'
        + '<link rel="stylesheet" href="../resources/bootstrap-5.2.3/css/bootstrap.min.css"/>'
        + '</head>'
        + '<body>'
        + divCardPrintReservation.outerHTML
        + '</body></html>');

    setInterval(() => {
        tab.stop();
        tab.print();
        tab.close();
    }, 700);
}

const clearFile=()=>{
    imgPaySlipPhoto.src="/resources/images/payslip.png";
    reservation.payslipphoto= null;
}

const refreshReservationForm=()=>{
    bookReservationForm.reset();

    imgMemberPhoto.src="/resources/images/memberdefault.png";
    imgBookPhoto.src="/resources/images/bookdefault.png";
    imgPaySlipPhoto.src="/resources/images/payslip.png";

    textMemberName.innerText="" ;
    textReservationDuration.innerText="" ;
    textReservationLimit.innerText="" ;
    textReservedBookCount.innerText="" ;
    textRemainingReservationLimit.innerText="" ;
    textReservationFee.innerText="" ;

    textBookTitle.innerText= "" ;
    textBookCopyStatus.innerText="" ;
    textExpectedHandoverDueDate.innerText="";

    // textIsReserved.innerText= "";
    // textReservedMember.innerText= "" ;
    // textReservedDate.innerText= "";
    textNoofReservations.innerText="";

    textAccessionNoElement.disabled=true;

    if(!userPrivi.privi_insert){
        disableElement();
        buttonSubmit.classList.add("d-none");
        tabpaneForm.classList.remove('show', 'active');
        tabPillForm.classList.remove('show','active')
        tabPaneTable.classList.add('show', 'active');
        tabPillTable.classList.add('show','active')
    }
    // create new object
    reservation= new Object();

    let reservationStatus= ajaxGetrequest("/reservationstatus/alldata")
    fillDataIntoSelect(selectReservationStatusElement, "Select Reservation Status", reservationStatus, "name")

    setInitial([
        textMemberNoElement,
        textAccessionNoElement,
        dateBookReserveDateElement,
        dateBookBorrowDateElement,
        selectReservationStatusElement,
        textareaNoteElement,
    ])

    let today= new Date();
    $("#dateBookReserveDate").datepicker("setDate", today);

    $("#dateBookReserveDate").datepicker("option",{
        dateFormat: "yy-mm-dd",
        minDate: today,
        maxDate: today,
    });
    //dateBookReserveDateElement.min= getDateValue(today);
    //dateBookReserveDateElement.max= getDateValue(today);
    //dateBookReserveDateElement.value= getDateValue(today);

    dateBookReserveDateElement.style.borderBottom="2px solid lightgreen";
    reservation.reserveddate= dateBookReserveDateElement.value;

    selectReservationStatusElement.value=JSON.stringify(reservationStatus[0])
    selectReservationStatusElement.style.borderBottom="2px solid lightgreen"
    selectReservationStatusElement.disabled=true;
    reservation.reservationstatus_id=reservationStatus[0];
}

//check form errors
const checkReservationFormErrors=()=>{
    let errors="";
    if(reservation.member_id== null){
        errors+="Please Enter Valid Member No.<br>"
    }
    if(reservation.bookcopy_id== null){
        errors+="Please Enter Valid Accession No.<br>"
    }
    if(reservation.reserveddate== null){
        errors+="Please Select Reserve Date.<br>"
    }
    if(reservation.borrowdate== null){
        errors+="Please Select Borrow Date.<br>"
    }
    if(reservation.reservationstatus_id== null){
        errors+="Please Select Reservation Status.<br>"
    }
    if (reservation.payslipphoto == null) {
        errors += "Please Add Pay Slip Photo.<br>";
    }

    return errors;
}

// define function for submit button
const buttonSubmitReservation = () => {
    let formErrors = checkReservationFormErrors();
    if (formErrors === "") {
        // form has not any errors
        const textMemberNoValue = textMemberNoElement.value;
        let memberByMemberNo= getHttpServiceRequest("/member/bymemberno/"+textMemberNoValue)

        if(memberByMemberNo && memberByMemberNo.id){
            let activeReservationBymember= getHttpServiceRequest("/reservation/bymember/" +memberByMemberNo.id)

            if(activeReservationBymember){
                Swal.fire({
                    title: "Active Reservation Exists",
                    html: `<p>This member already has an active reservation.</p>
                           <p>Please complete or cancel the existing reservation before creating a new one.</p> `,
                    icon: "warning",
                    confirmButtonText: "OK"
                });
                return;
            }
            let lastMembershipByMemberNo= getHttpServiceRequest("/membership/bymember/"+memberByMemberNo.id);

            if(!lastMembershipByMemberNo){
                return;
            }


            if(lastMembershipByMemberNo && lastMembershipByMemberNo.id){
                let reservationLimit= lastMembershipByMemberNo.membershiptype_id.reservationlimit;

                let reservedBookCount = getHttpServiceRequest("/reservation/reservedcount/" + memberByMemberNo.id);

                if(reservedBookCount >= reservationLimit){
                    Swal.fire({
                        title: "Reservation Limit Reached",
                        text: "This member cannot reserve more than " + reservationLimit + " books.",
                        icon: "warning"
                    });
                    return;
                }
            }
        }

        Swal.fire({
            title: "Confirm Save",
            html: `<p>Are you sure to save this reservation record?</p>`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ff0000ff",
            cancelButtonColor: "rgb(0, 102, 255)",
            confirmButtonText: "Yes, Save",
            cancelButtonText: "Cancel",
            reverseButtons: true

        }).then((result) => {
            if (result.isConfirmed) {
                console.log(reservation);
                // call post service
                let postServiceResponse = getHttpServiceRequest("/reservation/insert", "POST", reservation);

                if (postServiceResponse == "OK") {
                    // save successs
                    Swal.fire({
                        title: "Saved!",
                        text: "Reservation record saved successfully.",
                        icon: 'success',

                    });
                    refreshReservationTable();
                    refreshReservationForm();
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
                        html: `<p>Reservation record could not be saved.</p>
                <p>Details: ${postServiceResponse}</p>`,
                        confirmButtonText: 'OK'
                    });

                }
            } else {
                //get user confirm for form discard
                // can get user confrimation for form refresh
                Swal.fire({
                    title: "Confirm Refresh",
                    text: "Do you need to refresh reservation form ?",
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
const checkReservationFormUpdates=()=>{
    let updates="";
    if(reservation!=null && oldReservation!=null){

        if (reservation.borrowdate != oldReservation.borrowdate) {
            updates += "Borrow Date is changed " + oldReservation.borrowdate + " into " + reservation.borrowdate + ".<br>";
        }
        if (reservation.reservationstatus_id.name != oldReservation.reservationstatus_id.name) {
            updates += "Reservation Status is changed " + oldReservation.reservationstatus_id.name + " into " + reservation.reservationstatus_id.name + ".<br>";
        }
        if (reservation.payslipphoto != oldReservation.payslipphoto) {
            updates += "Pay Slip Photo is changed "+ ".<br>";
        }
        if (reservation.note != oldReservation.note) {
            updates += "Note is changed " + oldReservation.note + " into " + reservation.note + ".<br>";
        }
    }
    return updates;
}

// define function for update record
const buttonUpdateReservation = () => {
    console.log(reservation);
    // need to check  all required feild with valid value
    let formErrors = checkReservationFormErrors();
    if (formErrors == "") {
        let formUpdates = checkReservationFormUpdates();
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
                html: `<p>Are you sure to update this reservation record?</p>
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
                    let updateServiceResponse = getHttpServiceRequest("/reservation/update", "PUT", reservation);
                    if (updateServiceResponse == "OK") {
                        //user confrim update
                        Swal.fire({
                            title: "Updated!",
                            text: "Reservation record updated successfully.",
                            icon: 'success',

                        });
                        //refresh form and table
                        refreshReservationTable();
                        refreshReservationForm();

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
                            html: `<p>Reservation record could not be updated.</p>
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