const tabpaneForm = document.getElementById("borrowBookTabPillForm");
const tabPaneTable = document.getElementById("borrowBookTabPillTable");
const tabPillForm = document.getElementById("borrowBookFormPill");
const tabPillTable = document.getElementById("borrowBookTablePill");

const tableBody= document.getElementById("tableBodyBorrowBook");
const tableBodyBorrowBookList= document.getElementById("tableBodyBorrowBookList");
const  textMemberNoElement= document.getElementById("textMemberNo");
const textNoteElement= document.getElementById("textNote");
const  textAccessionNoElement= document.getElementById("textAccessionNo");
const tableBodyBorrowedBooks= document.getElementById("tableBodyBorrowedBooks");
const tableBodyBorrowedBookList = document.getElementById("tableBodyBorrowedBookList")

window.addEventListener("load",()=>{
     // enable tooltip
  $('[data-bs-toggle="tooltip"]').tooltip();
    userPrivi=getHttpServiceRequest("/userprivilegebymodule?modulename=Book-Borrowing")
  // call table refresh function
    refreshBorrowTable();
    // call form refresh function
    refreshBorrowForm();

})

// function for disable elements
const disableElement=()=>{
    textMemberNoElement.disabled= true;
    textNoteElement.disabled= true;
    textAccessionNoElement.disabled= true;
}

// function for refresh table
const refreshBorrowTable=()=>{
    // IF table is already DataTable THEN remove it THEN create new DataTable
    if ($.fn.DataTable.isDataTable('#tableBorrow')) {
        $('#tableBorrow').DataTable().destroy();
    }
    let borrows = ajaxGetrequest("/borrow/alldata");

    let displayProperty = [
        { propertyName: getMemberNo, dataType: "function" },
        { propertyName: getMemberName, dataType: "function" },
        { propertyName: "borrowcode", dataType: "string" },
        { propertyName: getBorrowBookList, dataType: "function" }
    ];

    fillDataIntoTableEight(
        tableBody,
        borrows,
        displayProperty,
        refillBorrowForm
    );
    buttonSubmitBorrow.classList.remove("d-none");
    buttonUpdateBorrow.classList.add("d-none");
    buttonPrintBorrow.classList.add("d-none");
    buttonDeleteBorrow.classList.add("d-none");

    $("#tableBorrow").DataTable({
        responsive: true,
        autoWidth: false
    });
}

// function for get member no
const getMemberNo=(ob)=>{
    return ob.member_id.memberno;
}

// function for get member name
const getMemberName=(ob)=>{
    return ob.member_id.name;
}

// function for get borrowed book list
const getBorrowBookList = (ob) => {
    if(!ob.borrowHasBookCopiesList || ob.borrowHasBookCopiesList.length===0){
        return "-";
    }
    let bookTitles= ob.borrowHasBookCopiesList.map(bookcopy=>bookcopy.bookcopy_id.book_id.title);
    return bookTitles.join(", ");
};

// function for refill form
const refillBorrowForm=(dataOb)=>{
    setInitial(
        [
            textMemberNoElement,
            textNoteElement
        ]
    )
    console.log(dataOb);

    // shift to tab pane form
    tabpaneForm.classList.add('show', 'active');
    tabPaneTable.classList.remove('show', 'active');
    // shift to  form pill tab
    tabPillForm.classList.add('show', 'active');
    tabPillTable.classList.remove('show', 'active');

    borrow= ajaxGetrequest("/borrow/byid/"+ dataOb.id);
    oldBorrow= ajaxGetrequest("/borrow/byid/"+ dataOb.id);

    textMemberNoElement.value= borrow.member_id.memberno ;
    textMemberNoElement.disabled=true;

    //note - optional
    if (borrow.note != undefined || oldBorrow.note != null) {
        textNoteElement.value = borrow.note;
    } else {
        textNoteElement.value = "";
    }
    if(borrow.member_id.memberphoto!=null){
        imgMemberPhoto.src= atob(borrow.member_id.memberphoto);
    }else{
        imgMemberPhoto.src="/resources/images/memberdefault.png";
    }

    textMemberName.innerText=borrow.member_id.name ;

    let lastMembershipByMemberNo= getHttpServiceRequest("/membership/bymember/"+borrow.member_id.id);
    if(lastMembershipByMemberNo && lastMembershipByMemberNo.id) {
        textBorrowLimit.innerText = lastMembershipByMemberNo.membershiptype_id.borrowlimit;
        let borrowLimit = lastMembershipByMemberNo.membershiptype_id.borrowlimit;

        // set handover due date
        let today = new Date();
        let borrowDuration = lastMembershipByMemberNo.membershiptype_id.borrowduration;
        today.setDate(today.getDate() + borrowDuration);
        borrowBook.handoverduedate = getDateValue(today);
        borrow.handoverduedate = getDateValue(today);

        // books on hand from borrow
        // member -> borrow -> borrow has book copy -> how many books
        let booksOnHand = getHttpServiceRequest("/borrow/booksonhand/" + borrow.member_id.id);
        textBooksOnHand.innerText = booksOnHand;
        // remaining limit calculate
        let remainingLimit = borrowLimit - booksOnHand;
        textRemainingBorrowLimit.innerText = remainingLimit;

        refreshBorrowDetailsTable();
    }

    refreshInnerFormAndTable();

    if(!userPrivi.privi_update){
        buttonUpdateBorrow.classList.add("d-none");
    }else {
        buttonUpdateBorrow.classList.remove("d-none");
    }
    if(!userPrivi.privi_delete){
        buttonDeleteBorrow.classList.add("d-none");
    }else {
        buttonDeleteBorrow.classList.remove("d-none");
    }

    // set button visibility
    // only showing update. submit space also not showing
    buttonSubmitBorrow.classList.add("d-none");
    buttonPrintBorrow.classList.remove("d-none")

}

// delete function
const deleteBorrowRecord=(dataOb)=>{
    //  confirmation
    borrow = getHttpServiceRequest("/borrow/byid/"+ dataOb.id)
    Swal.fire({
        title: "Confirm Deletion",
        html: `<p>Are you sure to Delete this Borrow Record ?</p>
          <p>Borrow Code : <strong>${borrow.borrowcode || ''}</strong><br></p>
           <p>Member No : <strong>${borrow.member_id.memberno || ''}</strong><br></p>
           <p>Member Name : <strong>${borrow.member_id.name || ''}</strong></p>`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ff0000ff",
        cancelButtonColor: "rgb(0, 102, 255)",
        confirmButtonText: "Yes, Delete",
        cancelButtonText: "Cancel",
        reverseButtons: true

    }).then((result) => {
        if (result.isConfirmed) {
            let deleteServiceResponse = getHttpServiceRequest("/borrow/delete", "DELETE", dataOb)
            if (deleteServiceResponse == "OK") {
                Swal.fire({
                    title: "Deleted!",
                    text: "Borrow Record Deleted Successfully.",
                    icon: 'success',

                });
                //refresh table
                refreshBorrowTable();
                refreshBorrowForm();

                // shift to tab pane table
                tabpaneForm.classList.remove('show', 'active');
                tabPaneTable.classList.add('show', 'active');

                // shift to  table pill tab
                tabPillForm.classList.remove('show', 'active');
                tabPillTable.classList.add('show', 'active');
            } else {
                Swal.fire({
                    title: 'Deletion Failed',
                    html: `<p>Borrow record could not be deleted.</p>
                <p>Details: ${deleteServiceResponse}</p>`,
                    confirmButtonText: 'OK'
                });
            }
        } else {
            //refresh table
        }
    })
}

const printBorrowBookListTable=(dataOb)=>{
    let borrowedBooks = ajaxGetrequest("/borrow/borrowedbooksbyborrowcode/"+dataOb.borrowcode);

    let displayProperty = [
        { propertyName: getAccessionNo, dataType: "function" },
        { propertyName: getBookTitle, dataType: "function" },
        { propertyName: "renewdate", dataType: "string" },
        { propertyName: "renewhandoverduedate", dataType: "string" },
        { propertyName: "actualhandovereddate", dataType: "string" },
        { propertyName: "delaydays", dataType: "string" },
        { propertyName:  getDamageType, dataType: "function" },
        { propertyName: "damagepercentage", dataType: "string" },
        { propertyName: "finecost", dataType: "string" },
        { propertyName:  getBorrowBookCopyStatus, dataType: "function" },

    ];

    fillDataIntoTableInfo(
        tableBodyBorrowedBookList,
        borrowedBooks,
        displayProperty
    );

}

const getAccessionNo=(ob)=>{
    return ob.bookcopy_id.accessionno;
}

const getBookTitle=(ob)=>{
    return ob.bookcopy_id.book_id.title;
}

const getBorrowBookCopyStatus=(ob)=>{
    return ob.borrowhasbookcopystatus_id.name;
}

const getDamageType = (ob) => {
    if(ob.damagetype_id){
        return ob.damagetype_id.name;
    }
    return "";
}

// print function
const printBorrowRecord=(dataOb)=>{
    let borrowModal_view = new bootstrap.Modal(
        document.getElementById("modalBorrowView"),
        {}
    );
    borrowModal_view.show();
    borrow= getHttpServiceRequest("/borrow/byid/"+ dataOb.id);
    tdBorrowCode.innerText= dataOb.borrowcode ;
    tdMemberNo.innerText= dataOb.member_id.memberno;
    tdMember.innerText= dataOb.member_id.name;
    tdBorrowDate.innerText= dataOb.borrowdate;
    tdHandoverDueDate.innerText= dataOb.handoverduedate;
    tdBorrowStatus.innerText= dataOb.borrowstatus_id.name;
    tdnote.innerText= dataOb.note ;

    printBorrowBookListTable(dataOb);

    // if(!dataOb.borrowHasBookCopiesList || dataOb.borrowHasBookCopiesList.length===0){
    //     return "-";
    // }
    // let bookTitles= dataOb.borrowHasBookCopiesList.map(bookcopy=>bookcopy.bookcopy_id.book_id.title);
    // tdBorrowedBooks.innerText=bookTitles.join(", ");
}

const printBorrow=()=>{
    let tab = window.open();
    tab.document.write('<html>'
        + '<head><title>Print Borrow Record</title>'
        + '<link rel="stylesheet" href="../resources/bootstrap-5.2.3/css/bootstrap.min.css"/>'
        + '</head>'
        + '<body>'
        + divCardPrintBorrow.outerHTML
        + '</body></html>');

    setInterval(() => {
        tab.stop();
        tab.print();
        tab.close();
    }, 700);
}

const refreshBorrowDetailsTable=()=>{
    const textMemberNoValue = textMemberNoElement.value;
    let memberByMemberNo= getHttpServiceRequest("/member/bymemberno/"+textMemberNoValue)
    let borrowedBooks = ajaxGetrequest("/borrow/borrowedbooks/"+memberByMemberNo.id);

    let displayProperty = [
        { propertyName: getBorrowCodeInfo, dataType: "function" },
        { propertyName: getBookInfo, dataType: "function" },
        { propertyName: getBorrowdateInfo, dataType: "function" },
        { propertyName: getHandoverDueDateInfo, dataType: "function" },
        { propertyName: getBookCopyBorrowStatusInfo, dataType: "function" }
    ];

    fillDataIntoTableInfo(
        tableBodyBorrowedBooks,
        borrowedBooks,
        displayProperty
    );
}

const getBorrowCodeInfo=(ob)=>{
    return ob.borrow_id.borrowcode;
}

const getBookInfo=(ob)=>{
    return ob.bookcopy_id.accessionno +" - " + ob.bookcopy_id.book_id.title;
}
const getBookCopyBorrowStatusInfo=(ob)=>{
    return ob.borrowhasbookcopystatus_id.name;
}

const getBorrowdateInfo=(ob)=>{
    return ob.borrow_id.borrowdate;
}

const getHandoverDueDateInfo=(ob)=>{
    return ob.borrow_id.handoverduedate;
}

const resetMembershipInfo = () => {
    textBorrowLimit.innerText = " - ";
    textBooksOnHand.innerText = " - ";
    textRemainingBorrowLimit.innerText = " - ";
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
                borrow.member_id= memberByMemberNo;
                textMemberNoElement.style.borderBottom = " 2px solid lightgreen";
                console.log(borrow);

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
                    tableBodyBorrowedBooks.innerText="";
                    textAccessionNoElement.disabled=true;
                    return;
                }

                if(lastMembershipByMemberNo && lastMembershipByMemberNo.id){

                    let membershipEndDate= lastMembershipByMemberNo.enddate;
                    let borrowDate= getDateValue(new Date());
                    if(borrowDate>=membershipEndDate){
                        Swal.fire({
                            icon: 'warning',
                            title: "Membership Expired",
                            html: ` <p>Member Name : <strong>${memberByMemberNo.name || ''}</strong><br></p>
                                    <p>Member No : <strong>${memberByMemberNo.memberno || ''}</strong><br></p>
                                    <p>Membership Start Date : <strong>${lastMembershipByMemberNo.startdate || ''}</strong><br></p>
                                     <p>Membership End Date : <strong>${lastMembershipByMemberNo.enddate|| ''}</strong><br></p>
                                     <p>Please renew membership before borrowing books.</p>`,
                            confirmButtonText: 'OK'
                        })
                        textAccessionNoElement.disabled=true;
                        return;
                    }

                    // set handover due date
                    let today= new Date();
                    let borrowDuration= lastMembershipByMemberNo.membershiptype_id.borrowduration;
                    today.setDate(today.getDate()+ borrowDuration);

                    let addedHolidays= getHttpServiceRequest("/holidays/alldata")
                    let holidayDates= addedHolidays.map(holiday=>holiday.date)

                    for(let i=0; i<7; i++){
                        if(!holidayDates.includes(getDateValue(today))){
                           break;
                        }
                        today.setDate(today.getDate()+ 1);
                    }

                    borrow.handoverduedate = getDateValue(today);

                    if(borrow.handoverduedate>membershipEndDate){
                        Swal.fire({
                            icon: 'warning',
                            title: "The calculated handover due date exceeds the member's membership end date.",
                            html: ` <p>Member Name : <strong>${memberByMemberNo.name || ''}</strong><br></p>
                                    <p>Member No : <strong>${memberByMemberNo.memberno || ''}</strong><br></p>
                                    <p>Membership Start Date : <strong>${lastMembershipByMemberNo.startdate || ''}</strong><br></p>
                                     <p>Membership End Date : <strong>${lastMembershipByMemberNo.enddate|| ''}</strong><br></p>
                                     <p>Handoverdue Date : <strong>${borrow.handoverduedate || ''}</strong><br></p>
                                     <p>Please renew membership before borrowing books.</p>`,
                            confirmButtonText: 'OK'
                        })
                        textAccessionNoElement.disabled=true;
                        return;
                    }
                    console.log(borrow.handoverduedate)

                    textBorrowLimit.innerText= lastMembershipByMemberNo.membershiptype_id.borrowlimit;
                    let borrowLimit = lastMembershipByMemberNo.membershiptype_id.borrowlimit;

                    // books on hand from borrow
                    // member -> borrow -> borrow has book copy -> how many books
                    let booksOnHand = getHttpServiceRequest("/borrow/booksonhand/" + memberByMemberNo.id);
                    textBooksOnHand.innerText= booksOnHand;
                    // remaining limit calculate
                    let remainingLimit = borrowLimit - booksOnHand;
                    textRemainingBorrowLimit.innerText = remainingLimit;

                    textAccessionNoElement.disabled=false;

                    refreshBorrowDetailsTable();

                    // check reservations
                    let reservation = getHttpServiceRequest("/reservation/bymember/" + memberByMemberNo.id);

                    if (reservation) {

                        if(reservation.reservationstatus_id.name=="Approved"){

                            let bookCopyByAccessionNo= getHttpServiceRequest("/bookcopy/byaccessionno/"+reservation.bookcopy_id.accessionno);
                            if (bookCopyByAccessionNo){
                                // book is available in library to borrow
                                if(bookCopyByAccessionNo.bookcopystatus_id.name==="Available"){
                                    let todayObject= new Date();
                                    let today= getDateValue(todayObject);
                                    let reservationBorrowDate= new Date(reservation.borrowdate)
                                    let reservationborrowdate= getDateValue(reservationBorrowDate);

                                    // came on day
                                    if(today == reservationborrowdate){
                                        Swal.fire({
                                            icon: 'success',
                                            title: "Reservation Ready for Borrowing",
                                            html: ` <p>Accession No : <strong>${reservation.bookcopy_id.accessionno || ''}</strong><br></p>
                                                    <p>Book Title : <strong>${reservation.bookcopy_id.book_id.title || ''}</strong><br></p>
                                                    <p>Borrow Date : <strong>${reservation.borrowdate || ''}</strong><br></p>
                                                    <p>This Reservation is approved and ready to borrow today</p>`,
                                            confirmButtonText: 'OK'
                                        })
                                        textAccessionNoElement.value = reservation.bookcopy_id.accessionno;
                                        borrowBook.bookcopy_id= reservation.bookcopy_id;

                                        textAccessionNoElement.style.borderBottom= "2px solid lightgreen"

                                        textBookTitle.innerText= reservation.bookcopy_id.book_id.title;
                                        textAuthor.innerText=reservation.bookcopy_id.book_id.author;
                                        textBookCopyStatus.innerText= reservation.bookcopy_id.bookcopystatus_id.name;
                                        textIsReserved.innerText= "Yes";
                                        textReservedMember.innerText= reservation.member_id.name;
                                        textReservedDate.innerText= reservation.reserveddate ;
                                    }
                                    //came after borrow date - Expired
                                    if(reservationborrowdate < today){
                                        // Swal.fire({
                                        //     title: 'Expired Reservation By this Member',
                                        //     text: "Approved reservation borrow date was " + reservationborrowdate,
                                        //     confirmButtonText: 'OK'
                                        // });
                                        Swal.fire({
                                            icon: 'warning',
                                            title: "Expired Approved Reservation",
                                            html: ` <p>Accession No : <strong>${reservation.bookcopy_id.accessionno || ''}</strong><br></p>
                                                    <p>Book Title : <strong>${reservation.bookcopy_id.book_id.title || ''}</strong><br></p>
                                                    <p>Borrow Date : <strong>${reservation.borrowdate || ''}</strong><br></p>
                                                    <p>The scheduled borrow date has already passed.</p>
                                                    <p>Please contact librarian for further action (update the borrow date of the reservation).</p>`,
                                            confirmButtonText: 'OK'
                                        })
                                    }
                                    //came before borrow date - Came Early
                                    if(reservationborrowdate > today){
                                        Swal.fire({
                                            icon: 'warning',
                                            title: "Member Arrived Before Borrow Date",
                                            html: ` <p>Accession No : <strong>${reservation.bookcopy_id.accessionno || ''}</strong><br></p>
                                                    <p>Book Title : <strong>${reservation.bookcopy_id.book_id.title || ''}</strong><br></p>
                                                    <p>Borrow Date : <strong>${reservation.borrowdate || ''}</strong><br></p>
                                                    <p>This member has arrived before the scheduled borrow date.</p>
                                                    <p>Please contact librarian for further action (update the borrow date of the reservation).</p>`,
                                            confirmButtonText: 'OK'
                                        })
                                    }
                                }
                                //book is still not available for borrow
                                if(bookCopyByAccessionNo.bookcopystatus_id.name==="Borrowed"){
                                    // borrowed

                                    // expected handover due date
                                    let borrowHasBookCopy= getHttpServiceRequest("/borrowhasbookcopy/bybookcopyid/"+bookCopyByAccessionNo.id);
                                    let expectedHandoverDueDate;
                                    if(borrowHasBookCopy.renewhandoverduedate== null || borrowHasBookCopy.renewhandoverduedate==undefined){
                                        // not renewed
                                        expectedHandoverDueDate=borrowHasBookCopy.borrow_id.handoverduedate;
                                    }else{
                                        // renewed
                                        expectedHandoverDueDate=borrowHasBookCopy.renewhandoverduedate;
                                    }

                                    Swal.fire({
                                        icon: 'warning',
                                        title: 'Reserved Book Currently Unavailable',
                                        html: `<p>The reserved book copy is currently borrowed by another member.</p> <br>
                                               <p><b>Expected Hanaover Due Date:</b> ${expectedHandoverDueDate}</p>`,
                                        confirmButtonText: 'OK'
                                    });
                                }
                            }

                        }
                        if(reservation.reservationstatus_id.name=="Pending"){
                            // still on pending
                            Swal.fire({
                                icon: 'warning',
                                title: "Reservation Still Pending",
                                html: ` <p>Accession No : <strong>${reservation.bookcopy_id.accessionno || ''}</strong><br></p>
                                        <p>Book Title : <strong>${reservation.bookcopy_id.book_id.title || ''}</strong><br></p>
                                        <p>Borrow Date : <strong>${reservation.borrowdate || ''}</strong><br></p>
                                        <p>This Reservation is not yet approved for borrow</p>`,
                                confirmButtonText: 'OK'
                            })
                        }
                    }
                }

            }else{
                // member not found
                borrow.member_id= null;
                textMemberNoElement.style.borderBottom = " 2px solid pink";
                tableBodyBorrowedBooks.innerText="";

                textMemberName.innerText="-" ;
                textBorrowLimit.innerText="-";
                textBooksOnHand.innerText = " - ";
                textRemainingBorrowLimit.innerText = " - ";

                textAccessionNoElement.value = "";
                textAccessionNoElement.disabled=true;

                setInitial([
                    textAccessionNoElement
                ])
                textBookTitle.innerText= "";
                textAuthor.innerText="";
                textBookCopyStatus.innerText= "";
                textIsReserved.innerText= "";
                textReservedMember.innerText= "";
                textReservedDate.innerText= "" ;
            }

        }else{
            // value is invalid
            textMemberNoElement.style.borderBottom = " 2px solid pink";
            tableBodyBorrowedBooks.innerText="";
            textMemberName.innerText="-" ;
            textBorrowLimit.innerText="-";
            textBooksOnHand.innerText = " - ";
            textRemainingBorrowLimit.innerText = " - ";

            textAccessionNoElement.value = "";
            textAccessionNoElement.disabled=true;

            setInitial([
                textAccessionNoElement
            ])
            textBookTitle.innerText= "";
            textAuthor.innerText="";
            textBookCopyStatus.innerText= "";
            textIsReserved.innerText= "";
            textReservedMember.innerText= "";
            textReservedDate.innerText= "" ;
        }
    }else{
        // value is empty
        if (textMemberNoElement.required) {
            textMemberNoElement.style.borderBottom = "2px solid pink";
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
            let bookCopyByAccessionNo= getHttpServiceRequest("/bookcopy/byaccessionno/"+textAccessionNoValue);
            if(bookCopyByAccessionNo && bookCopyByAccessionNo.id){
                if(bookCopyByAccessionNo.isreserved==true){

                        // reserved - can't borrow
                        textIsReserved.innerText= "Yes";

                        textBookTitle.innerText= bookCopyByAccessionNo.book_id.title ;
                        textAuthor.innerText= bookCopyByAccessionNo.book_id.author || "-";
                        textBookCopyStatus.innerText= bookCopyByAccessionNo.bookcopystatus_id.name ;

                        textAccessionNoElement.style.borderBottom = " 2px solid pink";
                        borrowBook.bookcopy_id= null;
                }
                else{
                    // not reserved - can borrow
                    textIsReserved.innerText= "No";

                    let availableBookCopyByAccessionNo= getHttpServiceRequest("/availabelebookcopyforborrow/byaccessionno/"+textAccessionNoValue);

                    if(availableBookCopyByAccessionNo && availableBookCopyByAccessionNo.id){
                        // book copy found - available - No damage / partially damaged
                        borrowBook.bookcopy_id= availableBookCopyByAccessionNo;
                        textAccessionNoElement.style.borderBottom = " 2px solid lightgreen";
                        console.log(borrowBook);

                        textBookTitle.innerText= availableBookCopyByAccessionNo.book_id.title ;
                        textAuthor.innerText= availableBookCopyByAccessionNo.book_id.author || "-";
                        textBookCopyStatus.innerText= availableBookCopyByAccessionNo.bookcopystatus_id.name ;

                    }else{
                        // book copy is not available
                        let notAvailanlebookCopyByAccessionNo= getHttpServiceRequest("/notavailabelebookcopyforborrow/byaccessionno/"+textAccessionNoValue);
                        if(notAvailanlebookCopyByAccessionNo && notAvailanlebookCopyByAccessionNo.id){
                            textAccessionNoElement.style.borderBottom = " 2px solid pink";

                            textBookTitle.innerText= notAvailanlebookCopyByAccessionNo.book_id.title ;
                            textAuthor.innerText= notAvailanlebookCopyByAccessionNo.book_id.author || "-";
                            textBookCopyStatus.innerText= notAvailanlebookCopyByAccessionNo.bookcopystatus_id.name ;
                            borrowBook.bookcopy_id= null;
                        }
                    }
                }
            }

        }else {
            // value is invalid
            textAccessionNoElement.style.borderBottom = " 2px solid pink";
            borrowBook.bookcopy_id= null;
            textBookTitle.innerText= "-" ;
            textAuthor.innerText= "-";
            textBookCopyStatus.innerText="-" ;

            textIsReserved.innerText= "-";
        }
    }else{
        // value is empty
        if (textAccessionNoElement.required) {
            borrowBook.bookcopy_id= null;
            textAccessionNoElement.style.borderBottom = "2px solid pink";

            textBookTitle.innerText= "-" ;
            textAuthor.innerText= "-";
            textBookCopyStatus.innerText="-" ;

            textIsReserved.innerText= "-";
        }
    }
})

const refreshBorrowForm=()=>{
    // clean static element- only value- empty static element
    bookBorrowForm.reset();

    imgMemberPhoto.src="/resources/images/memberdefault.png";
    tableBodyBorrowedBooks.innerText="";
    textMemberName.innerText="";
    textBorrowLimit.innerText="";
    textBooksOnHand.innerText="";
    textRemainingBorrowLimit.innerText="";

    textAccessionNoElement.disabled=true;

    if(!userPrivi.privi_insert){
        disableElement();
        buttonSubmitBorrow.classList.add("d-none");
        buttonSubmitInnerForm.classList.add("d-none");
        tabpaneForm.classList.remove('show', 'active');
        tabPillForm.classList.remove('show','active')
        tabPaneTable.classList.add('show', 'active');
        tabPillTable.classList.add('show','active')
    }

    borrow= new Object();
    borrow.borrowHasBookCopiesList= new Array();

    refreshInnerFormAndTable();

    setInitial([
        textMemberNoElement,
        textNoteElement
    ]);
}

const completeReservationIfBorrowed = (memberId, borrowList) => {

    let reservation = getHttpServiceRequest("/reservation/bymember/" + memberId);

    if (!reservation) return;

    if (reservation.reservationstatus_id.name === "Approved") {

        let today = getDateValue(new Date());
        let reservationDate = getDateValue(new Date(reservation.borrowdate));

        // check same day
        if (today === reservationDate) {

            // check if reserved book is in borrowed list
            let reservedBookId = reservation.bookcopy_id.id;

            let isBorrowed = borrowList.some(
                item => item.bookcopy_id.id === reservedBookId
            );

            if (isBorrowed) {

                // change status to Issued
                reservation.reservationstatus_id.id = 3;
                reservation.bookcopy_id.isreserved=false;

                //  1. update reservation
                let resUpdate = getHttpServiceRequest(
                    "/reservation/update",
                    "PUT",
                    reservation
                );

                //  2. update book copy
                let bookCopy = reservation.bookcopy_id;
                bookCopy.isreserved = false;

                let bookUpdate = getHttpServiceRequest(
                    "/bookcopy/update",
                    "PUT",
                    bookCopy
                );

                if (resUpdate === "OK" && bookUpdate === "OK") {
                    console.log("Reservation completed & book released");
                } else {
                    console.log("Update failed", resUpdate, bookUpdate);
                }
            }
        }
    }
};

//check borrow form errors
const checkBorrowFormErrors=()=>{
    let errors="";
    if(borrow.member_id == null){
        errors+="Please Enter Member No.<br>";
        textMemberNoElement.style.borderBottom="2px solid pink"
    }
    if(borrow.borrowHasBookCopiesList.length == 0){
        errors+="Please Add Book.<br>";
        textAccessionNoElement.style.borderBottom="2px solid pink"
    }
    return errors;
}

const submitBorrowButton = () => {
    console.log(borrow);
    let formErrors= checkBorrowFormErrors();
    if (formErrors === "") {
        // form has not any errors
        Swal.fire({
            title: "Confirm Save",
            html: `<p>Are you sure to save this Borrow record?</p>`,
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
                let postServiceResponse = getHttpServiceRequest("/borrow/insert", "POST", borrow);

                if (postServiceResponse == "OK") {

                    completeReservationIfBorrowed(
                        borrow.member_id.id,
                        borrow.borrowHasBookCopiesList
                    );
                    // save successs
                    Swal.fire({
                        title: "Saved!",
                        text: "Borrow record saved successfully.",
                        icon: 'success',

                    });
                    refreshBorrowTable();
                    refreshBorrowForm();
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
                        html: `<p>Borrow record could not be saved.</p>
                        <p>Details: ${postServiceResponse}</p>`,
                        confirmButtonText: 'OK'
                    });

                }
            } else {
                //get user confirm for form discard
                // can get user confrimation for form refresh
                Swal.fire({
                    title: "Confirm Refresh",
                    text: "Do you need to refresh borrow form ?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#ff0000ff",
                    cancelButtonColor: "rgb(0, 102, 255)",
                    confirmButtonText: "OK",
                    reverseButtons:true,

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

// check borrow form updates
const checkBorrowFormUpdates=()=>{
    let updates="";
    if(borrow!= null && oldBorrow!= null){
        if(borrow.member_id.name != oldBorrow.member_id.name){
            updates+="Member is changed "+
                oldBorrow.member_id.name+" into "+
                borrow.member_id.name+
                ".<br>"
        }

        if(borrow.note != oldBorrow.note){
            updates+="Note is changed "+
                oldBorrow.note+" into "+
                borrow.note+
                ".<br>"
        }
        if (JSON.stringify(borrow.borrowHasBookCopiesList) !== JSON.stringify(oldBorrow.borrowHasBookCopiesList)) {
            updates += "Borrowing Book List is changed.<br>";
        }
    }return updates;
}

// update borrow form function
const updateBorrowButton=()=>{
// need to check  all required feild with valid value
    let todayObject= new Date();
    let today= getDateValue(todayObject);
    let borrowdateObject= new Date(borrow.borrowdate)
    let borrowdate= getDateValue(borrowdateObject);
    if(today != borrowdate){
        Swal.fire({
            title: 'Failed',
            text: "This Borrow Record can't update today.",
            confirmButtonText: 'OK'
        });
        return;
    }
    let formErrors = checkBorrowFormErrors();
    if (formErrors == "") {
        let formUpdates = checkBorrowFormUpdates();
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
                html: `<p>Are you sure to update this borrow record?</p>
            <p>${formUpdates}</p>`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#ff0000ff",
                cancelButtonColor: "rgb(0, 102, 255)",
                confirmButtonText: "Yes, Update",
                cancelButtonText: "Cancel",
                reverseButtons: true,

            }).then((result) => {
                if (result.isConfirmed) {
                    let updateServiceResponse = getHttpServiceRequest("/borrow/update", "PUT", borrow);

                    if (updateServiceResponse == "OK") {
                        //user confrim update
                        Swal.fire({
                            title: "Updated!",
                            text: "Borrow record updated successfully.",
                            icon: 'success',

                        });
                        //refresh form and table
                        refreshBorrowTable();
                        refreshBorrowForm();

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
                            html: `<p>Borrow record could not be updated.</p>
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

// refresh inner form and table
const refreshInnerFormAndTable=()=>{
    // refresh form area
    borrowBook= new Object();

    textAccessionNoElement.value= "";

    setInitial([
        textAccessionNoElement
    ])
    textBookTitle.innerText= "" ;
    textAuthor.innerText= "";
    textBookCopyStatus.innerText="" ;

    textIsReserved.innerText= "";

    // refresh table area= fill table
    let innerColumns = [
        { propertyName: getInnerBookAccessionNo, dataType: "function" },
        { propertyName: getInnerBookTitle, dataType: "function" }
    ];

    fillDataIntoInnerTableWithoutUpdate(
        tableBodyBorrowBookList,
        borrow.borrowHasBookCopiesList,
        innerColumns,
        deleteBorrowBookCopy
    )
}

const getInnerBookAccessionNo=(ob)=>{
    return ob.bookcopy_id.accessionno;
}

const getInnerBookTitle=(ob)=>{
    return ob.bookcopy_id.book_id.title;
}

// const getHandoverDueDate=(ob)=>{
//     return ob.borrow_id.handoverduedate;
// }


// delete book from table
const deleteBorrowBookCopy=(dataOb)=>{

    Swal.fire({
        title: "Confirm Remove",
        html: `<p>Are you sure to remove Borrow Book?</p>`,
        icon: "warning",
        confirmButtonColor: "#ff0000ff",
        confirmButtonText: "Yes, Remove",

    }).then((result) => {
        if (result.isConfirmed) {
            let extIndex= borrow.borrowHasBookCopiesList.map(bookcopy=>bookcopy.bookcopy_id.id).indexOf(dataOb.bookcopy_id.id)
            if(extIndex>-1){
                borrow.borrowHasBookCopiesList.splice(extIndex,1);
                refreshInnerFormAndTable();
                Swal.fire({
                    title: "Removed!",
                    text: "Book Removed successfully.",
                    icon: 'success',

                });
            }
        }
    })
}

// check inner form errors
const checkBorrowBookCopyErrors=()=>{
    let errors="";
    if(borrowBook.bookcopy_id==null){
        errors += "Please Enter Accession No of Book.<br>";
        textAccessionNoElement.style.borderBottom="2px solid pink";
    }
    return errors;
}

// submit inner form function
const borrowBookCopySubmit=()=>{
    console.log(borrowBook);
    let errors = checkBorrowBookCopyErrors();
    if (errors === ""){
        const textMemberNoValue = textMemberNoElement.value;
        let memberByMemberNo= getHttpServiceRequest("/member/bymemberno/"+textMemberNoValue)
        let borrowedBooks = ajaxGetrequest("/borrow/borrowedbooks/"+memberByMemberNo.id);

        let alreadyBorrowed= false;
        borrowedBooks.forEach(borrowedBook=>{
            if(borrowedBook.bookcopy_id.book_id.bookno===borrowBook.bookcopy_id.book_id.bookno){
                alreadyBorrowed= true;
            }
        })
        if(alreadyBorrowed){
            Swal.fire({
                icon: "error",
                title: "Book Already Borrowed",
                text: "This member has already borrowed a copy of this book."
            });
            return;
        }

        let alradyEnteredBookCopy= false;
        borrow.borrowHasBookCopiesList.forEach(enteredBook=>{
            if(enteredBook.bookcopy_id.accessionno=== borrowBook.bookcopy_id.accessionno){
                alradyEnteredBookCopy=true;
                textAccessionNoElement.style.borderBottom="2px solid pink"
            }
        })
        if(alradyEnteredBookCopy){
            Swal.fire({
                icon: "error",
                title: "This Book Already Entered to Borrow List",
            });
            return;
        }

        let alradyEnteredBook= false;
        borrow.borrowHasBookCopiesList.forEach(enteredBook=>{
            if(enteredBook.bookcopy_id.book_id.bookno===borrowBook.bookcopy_id.book_id.bookno){
                alradyEnteredBook=true;
                textAccessionNoElement.style.borderBottom="2px solid pink"
            }
        })
        if(alradyEnteredBook){
            Swal.fire({
                icon: "error",
                title: "Copy of this Book Already Entered to Borrow List",
            });
            return;
        }

        let borrowLimit = parseInt(textBorrowLimit.innerText);
        let booksOnHand = parseInt(textBooksOnHand.innerText);

        // books already in this borrow record
        let booksInThisRecord = borrow.borrowHasBookCopiesList.length;

        // after adding new book
        let totalAfterAdd = booksOnHand + booksInThisRecord + 1;

        if(totalAfterAdd > borrowLimit){
            Swal.fire({
                title: "Borrow Limit Reached",
                text: "This member cannot borrow more than " + borrowLimit + " books.",
                icon: "warning"
            });
            return;
        }
        // form has not any errors
        Swal.fire({
            title: "Confirm Save",
            html: `<p>Are you sure to add this Book to Borrowing List?</p>`,
            icon: "warning",
            confirmButtonColor: "#ff0000ff",
            confirmButtonText: "Yes, Add",

        }).then((result) => {
            if (result.isConfirmed) {

                Swal.fire({
                    title: "Added!",
                    text: "Book Added successfully.",
                    icon: 'success',
                });

                borrow.borrowHasBookCopiesList.push(borrowBook);

                refreshInnerFormAndTable();
            }
        })
    } else {
        // form has errors
        Swal.fire({
            title: 'Save Failed',
            html: `<p>Form has Following Errors.</p>
                <p>${errors}</p>`,
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }

}




