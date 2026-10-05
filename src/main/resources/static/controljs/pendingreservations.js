
let tableBody= document.getElementById("tableBodyBookReservation");

const dateBookReserveDateElement= document.getElementById("dateBookReserveDate")
const dateBookBorrowDateElement= document.getElementById("dateBookBorrowDate")
const selectReservationStatusElement= document.getElementById("selectReservationStatus")
const textareaNoteElement= document.getElementById("textareaNote")

window.addEventListener("load",()=>{
    // enable tooltip
    $('[data-bs-toggle="tooltip"]').tooltip();
    userPrivi=getHttpServiceRequest("/userprivilegebymodule?modulename=Pending-Reservations");
    // call refresh table function
    refreshReservationTable();
    // call refresh form function
    refreshReservationForm();
})

const refreshReservationTable=()=>{
    // IF table is already DataTable THEN remove it THEN create new DataTable
    if ($.fn.DataTable.isDataTable('#tableReservation')) {
        $('#tableReservation').DataTable().destroy();
    }

    let reservations = ajaxGetrequest("/pendingreservations/alldata");

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
    fillDataIntoTable(
        tableBody,
        reservations,
        displayProperty,
        refillReservationForm,
        deleteReservationRecord,
        printReservationRecord
    );

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

const refillReservationForm=(dataOb)=>{
    setInitial([
        dateBookReserveDateElement,
        dateBookBorrowDateElement,
        selectReservationStatusElement,
        textareaNoteElement,
    ])

    reservation= getHttpServiceRequest("/reservation/byid/"+ dataOb.id)
    oldReservation= getHttpServiceRequest("/reservation/byid/"+ dataOb.id)

    // show reservation modal
    $("#modalReservationForm").modal("show");

    if(reservation.member_id.memberphoto!=null){
        imgMemberPhoto.src= atob(reservation.member_id.memberphoto);
    }else{
        imgMemberPhoto.src="/resources/images/memberdefault.png";
    }

    // member no
    textMemberNo.innerText= reservation.member_id.memberno;
    textMemberName.innerText=reservation.member_id.name ;
    let lastMembershipByMemberNo= getHttpServiceRequest("/membership/bymember/"+reservation.member_id.id);
    if(lastMembershipByMemberNo && lastMembershipByMemberNo.id) {
        textReservationFee.innerText = lastMembershipByMemberNo.membershiptype_id.reservationfee;
    }

    if(reservation.bookcopy_id.book_id.coverimage!=null){
        imgBookPhoto.src= atob(reservation.bookcopy_id.book_id.coverimage);
    }else{
        imgBookPhoto.src="/resources/images/bookdefault.png";
    }

    // accession no
    textAccessionNo.innerText= reservation.bookcopy_id.accessionno;

    let bookCopyByAccessionNo= getHttpServiceRequest("/bookcopy/byaccessionno/"+reservation.bookcopy_id.accessionno);
    if(bookCopyByAccessionNo && bookCopyByAccessionNo.id){
        // book copy found - available
        textBookTitle.innerText= bookCopyByAccessionNo.book_id.title ;
        textBookCopyStatus.innerText= "-";
        textExpectedHandoverDueDate.innerText="-";
    }
    // reserved date
    dateBookReserveDateElement.value= reservation.reserveddate;
    dateBookReserveDateElement.disabled=true;
    // borrow date
    dateBookBorrowDateElement.value= reservation.borrowdate;
    dateBookBorrowDateElement.disabled=true;
    // status
    selectReservationStatusElement.value= JSON.stringify(reservation.reservationstatus_id)
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

                $("#modalReservationForm").modal("hide");

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


const refreshReservationForm=()=>{
    bookReservationForm.reset();

    imgMemberPhoto.src="/resources/images/memberdefault.png";
    textMemberNo.innerText="-" ;
    textMemberName.innerText="-" ;
    textReservationFee.innerText="-" ;

    textAccessionNo.innerText="-" ;
    textBookTitle.innerText= "-" ;
    textBookCopyStatus.innerText="-" ;
    textExpectedHandoverDueDate.innerText="-";

    // create new object
    reservation= new Object();

    let reservationStatus= ajaxGetrequest("/reservationstatus/alldata")
    fillDataIntoSelect(selectReservationStatusElement, "Select Reservation Status", reservationStatus, "name")

    buttonUpdate.disabled=false;
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
    return errors;
}


// define check updates function
const checkReservationFormUpdates=()=>{
    let updates="";
    if(reservation!=null && oldReservation!=null){
        if (reservation.reservationstatus_id.name != oldReservation.reservationstatus_id.name) {
            updates += "Reservation Status is changed " + oldReservation.reservationstatus_id.name + " into " + reservation.reservationstatus_id.name + ".<br>";
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
            if (
                oldReservation.reservationstatus_id.name === "Pending" &&
                reservation.reservationstatus_id.name === "Approved"
            ){
                const textAccessionNoValue= textAccessionNo.innerText;
                let bookCopyByAccessionNo= getHttpServiceRequest("/bookcopyforreservation/byaccessionno/"+textAccessionNoValue);
                let approvedReservation= getHttpServiceRequest("/approvedreservation/bybookcopyid/" +bookCopyByAccessionNo.id)

                if(approvedReservation){
                    Swal.fire({
                        title: "Approved Reservation Exists",
                        html: `<p>This book copy already has an approved reservation.</p>
                           <p>Please update to approved after current reserved member complete the reservation.</p> `,
                        icon: "warning",
                        confirmButtonText: "OK"
                    });
                    buttonUpdate.disabled=true;
                    return;
                }
            }

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

                        $("#modalReservationForm").modal("hide");

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


