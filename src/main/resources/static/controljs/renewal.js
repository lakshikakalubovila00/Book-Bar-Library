const tabpaneForm = document.getElementById("renewalTabPillForm");
const tabPaneTable = document.getElementById("renewalTabPillTable");
const tabPillForm = document.getElementById("renewalFormPill");
const tabPillTable = document.getElementById("renewalTablePill");

let borrowHasbookCopy = null;
let oldborrowHasbookCopy = null;

let borrow = null;
let oldBorrow = null;

let tableBodyBorrowedBooks= document.getElementById("tableBodyBorrowedBooks");
let textMemberNoElement = document.getElementById("textMemberNo");
let tableBody= document.getElementById("tableBodyRenewal")

window.addEventListener("load",()=>{
     // enable tooltip
  $('[data-bs-toggle="tooltip"]').tooltip();
    userPrivi=getHttpServiceRequest("/userprivilegebymodule?modulename=Book-Renewals")
    // call table refresh function
    refreshRenewalTable();
    // call form refresh function
    refreshRenewalForm();
})

// refresh tab pane table function
const refreshRenewalTable=()=>{
    // IF table is already DataTable THEN remove it THEN create new DataTable
    if ($.fn.DataTable.isDataTable('#tableRenewals')) {
        $('#tableRenewals').DataTable().destroy();
    }
    let renewals = ajaxGetrequest("/borrowhasbookcopy/renewedbooks");

    let displayProperty = [
        { propertyName: getBorrowCode, dataType: "function" },
        { propertyName: getMemberNo, dataType: "function" },
        { propertyName: getMemberName, dataType: "function" },
        { propertyName: getRenewedBookAccessionNo, dataType: "function" },
        { propertyName: getHandOveredBookTitle, dataType: "function" },
        { propertyName: getBorrowDate, dataType: "function" },
        { propertyName: "renewdate", dataType: "string" },
        { propertyName: "renewhandoverduedate", dataType: "string" },
        { propertyName: getStatus, dataType: "function" },
    ];

    fillDataIntoTableEight(
        tableBody,
        renewals,
        displayProperty,
        refillRenewalForm
    );
    buttonSubmit.classList.remove("d-none");
    //buttonUpdate.classList.add("d-none");
    buttonPrint.classList.add("d-none");
    buttonDelete.classList.add("d-none");

    $("#tableRenewals").DataTable({
        responsive: true,
        autoWidth: false
    });
}

// function for get borrow code
const getBorrowCode=(ob)=>{
    return ob.borrow_id.borrowcode;
}

// function for get member no
const getMemberNo=(ob)=>{
    return ob.borrow_id.member_id.memberno;
}

// function for get member name
const getMemberName=(ob)=>{
    return ob.borrow_id.member_id.name;
}

// function for get renewed book acccession no
const getRenewedBookAccessionNo = (ob) => {
    return ob.bookcopy_id.accessionno;
};

// function for get handovered book title
const getHandOveredBookTitle = (ob) => {
    return ob.bookcopy_id.book_id.title;
};

// function for get member name
const getBorrowDate=(ob)=>{
    return ob.borrow_id.borrowdate;
}

// get borrow has book copy status
const getStatus=(ob)=>{
    return ob.borrowhasbookcopystatus_id.name;
}

// refill form function
const refillRenewalForm=(dataOb)=>{
    setInitial(
        [
            textMemberNoElement
        ]
    )
    console.log(dataOb);

    // shift to tab pane form
    tabpaneForm.classList.add('show', 'active');
    tabPaneTable.classList.remove('show', 'active');
    // shift to  form pill tab
    tabPillForm.classList.add('show', 'active');
    tabPillTable.classList.remove('show', 'active');

    borrowHasbookCopy= ajaxGetrequest("/borrowhasbookcopy/byid/"+ dataOb.id);
    oldborrowHasbookCopy= ajaxGetrequest("/borrowhasbookcopy/byid/"+ dataOb.id);

    borrow = borrowHasbookCopy.borrow_id;
    oldBorrow = JSON.parse(JSON.stringify(borrow));

    textMemberNoElement.value= borrowHasbookCopy.borrow_id.member_id.memberno ;

    if(borrowHasbookCopy.borrow_id.member_id.memberphoto!=null){
        imgMemberPhoto.src= atob(borrowHasbookCopy.borrow_id.member_id.memberphoto);
    }else{
        imgMemberPhoto.src="/resources/images/memberdefault.png";
    }
    memberName.innerText=  borrowHasbookCopy.borrow_id.member_id.name;
    memberStatus.innerText= borrowHasbookCopy.borrow_id.member_id.memberstatus_id.name;
    let booksOnHand = getHttpServiceRequest("/borrow/booksonhand/" + borrowHasbookCopy.borrow_id.member_id.id);
    textBooksOnHand.innerText= booksOnHand;

    fillRenewedBooksTable(dataOb);

    document.querySelectorAll("#tableBodyBorrowedBooks tr").forEach(row => {
        if(row.dataset.bhbcid == borrowHasbookCopy.id){

            row.querySelector(".bookCheck").checked = true;
            row.querySelector(".borrowCode").innerText= borrowHasbookCopy.borrow_id.borrowcode ;
            row.querySelector(".accessionNo").innerText= borrowHasbookCopy.bookcopy_id.accessionno ;
            row.querySelector(".borrowDate").innerText= borrowHasbookCopy.borrow_id.borrowdate;
            row.querySelector(".handoverDueDate").innerText= borrowHasbookCopy.borrow_id.handoverduedate ;
            row.querySelector(".renewHandoverDueDate").innerText= borrowHasbookCopy.renewhandoverduedate ;
        }

    });

    // if(!userPrivi.privi_update){
    //     buttonUpdate.classList.add("d-none");
    // }else {
    //     buttonUpdate.classList.remove("d-none");
    // }
    if(!userPrivi.privi_delete){
        buttonDelete.classList.add("d-none");
    }else {
        buttonDelete.classList.remove("d-none");
    }

    // set button visibility
    // only showing update. submit space also not showing
    buttonSubmit.classList.add("d-none");
    buttonPrint.classList.remove("d-none")
}

// delete function
const deleteRenewalRecord=(dataOb)=>{
    //  confirmation
    borrowHasbookCopy = getHttpServiceRequest("/borrowhasbookcopy/byid/"+ dataOb.id)
    // borrow = getHttpServiceRequest("/borrow/byid/"+ dataOb.id)
    // hand overed books *
    Swal.fire({
        title: "Confirm Deletion",
        html: `<p>Are you sure to Delete this Renew Record ?</p>
          <p>Borrow Code : <strong>${borrowHasbookCopy.borrow_id.borrowcode || ''}</strong><br></p>
           <p>Member Name : <strong>${borrowHasbookCopy.borrow_id.member_id.name || ''}</strong></p>
           <p>Book : <strong>${borrowHasbookCopy.bookcopy_id.book_id.title || ''}</strong><br></p>
            <p>Status : <strong>${borrowHasbookCopy.borrowhasbookcopystatus_id.name || ''}</strong></p>
        `,

        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ff0000ff",
        cancelButtonColor: "rgb(0, 102, 255)",
        confirmButtonText: "Yes, Delete",
        cancelButtonText: "Cancel",
        reverseButtons: true

    }).then((result) => {
        if (result.isConfirmed) {
            let deleteServiceResponse = getHttpServiceRequest("/renewal/deleterenewbooks", "DELETE", dataOb)
            if (deleteServiceResponse == "OK") {
                Swal.fire({
                    title: "Deleted!",
                    text: "Renew Record Deleted Successfully.",
                    icon: 'success',

                });
                //refresh table
                refreshRenewalTable();
                refreshRenewalForm();

                // shift to tab pane table
                tabpaneForm.classList.remove('show', 'active');
                tabPaneTable.classList.add('show', 'active');

                // shift to  table pill tab
                tabPillForm.classList.remove('show', 'active');
                tabPillTable.classList.add('show', 'active');
            } else {
                Swal.fire({
                    title: 'Deletion Failed',
                    html: `<p>Renew record could not be deleted.</p>
                <p>Details: ${deleteServiceResponse}</p>`,
                    confirmButtonText: 'OK'
                });
            }
        } else {
            //refresh table
        }
    })
}

// print modal function
const printRenewalRecord=(dataOb)=>{
    let renewalModal_view = new bootstrap.Modal(
        document.getElementById("modalRenewalView"),
        {}
    );
    renewalModal_view.show();
    // show for each book
    borrowHasbookCopy= getHttpServiceRequest("/borrowhasbookcopy/byid/"+ dataOb.id);
    tdBorrowCode.innerText= dataOb.borrow_id.borrowcode ;
    tdMemberNo.innerText= dataOb.borrow_id.member_id.memberno;
    tdMember.innerText= dataOb.borrow_id.member_id.name;
    tdBorrowDate.innerText= dataOb.borrow_id.borrowdate;
    tdHandoverDueDate.innerText= dataOb.borrow_id.handoverduedate;
    tdBorrowStatus.innerText= dataOb.borrow_id.borrowstatus_id.name;
    tdnote.innerText= dataOb.borrow_id.note ;
    tdAccessionNo.innerText= dataOb.bookcopy_id.accessionno  ;
    tdBookTitle.innerText= dataOb.bookcopy_id.book_id.title  ;
    tdRenewDate.innerText= dataOb.renewdate ;
    tdRenewHandoverDueDate.innerText= dataOb.renewhandoverduedate ;
    tdStatus.innerText= dataOb.borrowhasbookcopystatus_id.name  ;

}

// print function
const printRenew=()=>{
    let tab = window.open();
    tab.document.write('<html>'
        + '<head><title>Print Renew Record</title>'
        + '<link rel="stylesheet" href="../resources/bootstrap-5.2.3/css/bootstrap.min.css"/>'
        + '</head>'
        + '<body>'
        + divCardPrintRenewal.outerHTML
        + '</body></html>');

    setInterval(() => {
        tab.stop();
        tab.print();
        tab.close();
    }, 700);
}

// refresh form function
const refreshRenewalForm=()=>{
    console.log(userPrivi)
    renewalForm.reset();
    tableBodyBorrowedBooks.innerText="";
    imgMemberPhoto.src="/resources/images/memberdefault.png";
    memberName.innerText= ""
    memberStatus.innerText= ""
    textBooksOnHand.innerText= ""

    if(!userPrivi.privi_insert){
        textMemberNoElement.disabled= true;
        buttonSubmit.classList.add("d-none");
        tabpaneForm.classList.remove('show', 'active');
        tabPillForm.classList.remove('show','active')
        tabPaneTable.classList.add('show', 'active');
        tabPillTable.classList.add('show','active')
    }
    setInitial([
        textMemberNoElement
    ]);
}

// submit button function
const submitRenewalButton = () => {

    if(!borrow || !borrow.id){
        Swal.fire({
            title: "No Borrow Records.",
            text: "Borrow records not loaded..",
            icon: "warning",
        })
        return;
    }
    let selectedBooks = document.querySelectorAll(".bookCheck:checked");

    if(selectedBooks.length === 0){
        Swal.fire({
            title: "No Books Selected",
            text: "Please select at least one book to renew.",
            icon: "warning"
        });
        return;
    }

    // form has not any errors
    Swal.fire({
        title: "Confirm Save",
        html: `<p>Are you sure to save this Renewal record?</p>`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ff0000ff",
        cancelButtonColor: "rgb(0, 102, 255)",
        confirmButtonText: "Yes, Save",
        cancelButtonText: "Cancel",
        reverseButtons: true,

    }).then((result) => {
        if (result.isConfirmed) {

            let groupedBooks = getSelectedRenewBooks();

            let borrowList = [];

            for(let borrowId in groupedBooks) {
                // Fix relation for each BorrowHasBookCopy
                groupedBooks[borrowId].forEach(bhbc => {
                    bhbc.borrow_id = { id: groupedBooks[borrowId][0].borrow_id.id };
                });

                let borrowObj = {
                    id: parseInt(borrowId),
                    borrowHasBookCopiesList: groupedBooks[borrowId]
                };
                borrowList.push(borrowObj);
                console.log("Grouped Books:", groupedBooks);
                console.log("Borrow List:", borrowList);
            }
            console.log("Sending Borrow:", borrowList);
            let postServiceResponse =getHttpServiceRequest(
                "/renewal/saverenewbooks",
                "PUT",
                borrowList
            );
            if (postServiceResponse == "OK") {
                // save successs
                Swal.fire({
                    title: "Saved!",
                    text: "Renewal record saved successfully.",
                    icon: 'success',

                });
                refreshRenewalTable();
                refreshRenewalForm();
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
                    html: `<p>Renewal record could not be saved.</p>
                        <p>Details: ${postServiceResponse}</p>`,
                    confirmButtonText: 'OK'
                });

            }
        } else {
            //get user confirm for form discard
            // can get user confrimation for form refresh
            Swal.fire({
                title: "Confirm Refresh",
                text: "Do you need to refresh renewal form ?",
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
}

// no need update ???????
const updateRenewalButton=()=>{
    let selectedBooks = document.querySelectorAll(".bookCheck:checked");

    if(selectedBooks.length === 0){
        Swal.fire({
            title: "No Books Selected",
            text: "Please select Book to continue updates.",
            icon: "warning"
        });
        return;
    }
    let tr = document.querySelectorAll("#tableBodyBorrowedBooks tr");

    tr.forEach(tr => {

        let checkbox = tr.querySelector(".bookCheck");

        if(checkbox && checkbox.checked) {
                    //has updates
                    Swal.fire({
                        title: "Confirm Update",
                        html: `<p>Are you sure to update this Renewal record?</p>
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
                            let groupedBooks = getSelectedHandoverBooks();

                            let borrowList = [];

                            for (let borrowId in groupedBooks) {
                                // Fix relation for each BorrowHasBookCopy
                                groupedBooks[borrowId].forEach(bhbc => {
                                    bhbc.borrow_id = {id: groupedBooks[borrowId][0].borrow_id.id};
                                });

                                let borrowObj = {
                                    id: parseInt(borrowId),
                                    borrowHasBookCopiesList: groupedBooks[borrowId]
                                };
                                borrowList.push(borrowObj);
                                console.log("Grouped Books:", groupedBooks);
                                console.log("Borrow List:", borrowList);
                            }
                            let updateServiceResponse = getHttpServiceRequest("/renewal/updaterenewbooks", "PUT", borrowList);

                            if (updateServiceResponse == "OK") {
                                //user confrim update
                                Swal.fire({
                                    title: "Updated!",
                                    text: "Renewal record updated successfully.",
                                    icon: 'success',

                                });
                                //refresh form and table
                                refreshRenewalTable();
                                refreshRenewalForm();

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
                                    html: `<p>Renewal record could not be updated.</p>
                                    <p>${updateServiceResponse}</p>`,
                                    confirmButtonText: 'OK'
                                });
                            }
                        }
                    })
        }

    });

}

// member no validate
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
                textMemberNoElement.style.borderBottom = " 2px solid lightgreen";
                memberName.innerText=  memberByMemberNo.name;
                memberStatus.innerText= memberByMemberNo.memberstatus_id.name;
                let booksOnHand = getHttpServiceRequest("/borrow/booksonhand/" + memberByMemberNo.id);
                textBooksOnHand.innerText= booksOnHand;
                if(memberByMemberNo.memberphoto){
                    imgMemberPhoto.src= atob(memberByMemberNo.memberphoto);
                }else{
                    imgMemberPhoto.src="/resources/images/memberdefault.png";
                }

                let lastMembershipByMemberNo= getHttpServiceRequest("/membership/bymember/"+memberByMemberNo.id);

                if(!lastMembershipByMemberNo){
                    tableBodyBorrowedBooks.innerText="";
                    return;
                }

                if(lastMembershipByMemberNo && lastMembershipByMemberNo.id){
                    fillborrowedBooksTable();
                }

            }else{
                // member not found
                if (borrow) {
                    borrow.member_id = null;
                }
                textMemberNoElement.style.borderBottom = " 2px solid pink";
                memberName.innerText=  "-";
                memberStatus.innerText= "-";
                textBooksOnHand.innerText= "-";
                imgMemberPhoto.src="/resources/images/memberdefault.png";
                tableBodyBorrowedBooks.innerText="";
            }

        }else{
            // value is invalid
            textMemberNoElement.style.borderBottom = " 2px solid pink";
            memberName.innerText=  "-";
            memberStatus.innerText= "-";
            textBooksOnHand.innerText= "-";
            imgMemberPhoto.src="/resources/images/memberdefault.png";
            tableBodyBorrowedBooks.innerText="";
        }
    }else{
        // value is empty
        if (textMemberNoElement.required) {
            textMemberNoElement.style.borderBottom = "2px solid pink";
            memberName.innerText=  "-";
            memberStatus.innerText= "-";
            textBooksOnHand.innerText= "-";
            imgMemberPhoto.src="/resources/images/memberdefault.png";
            tableBodyBorrowedBooks.innerText="";
        }else {
            textMemberNoElement.style.borderBottom = "white";
        }
    }
})

// fill borrowed books into table when enter member no
const fillborrowedBooksTable=()=>{
    const textMemberNoValue = textMemberNoElement.value;
    let memberByMemberNo= getHttpServiceRequest("/member/bymemberno/"+textMemberNoValue)
    if (!memberByMemberNo || !memberByMemberNo.id) {
        tableBodyBorrowedBooks.innerHTML = "";
        return;
    }
    let borrowedBooks = ajaxGetrequest("/borrow/borrowedonlybooks/"+memberByMemberNo.id);

    // set borrow object
    if(borrowedBooks.length > 0){
        borrow = borrowedBooks[0].borrow_id;
        oldBorrow = JSON.parse(JSON.stringify(borrow));
    }else{
        borrow = null;
        oldBorrow = null;
    }
    fillBorrowedBooksDataIntoTable(
        tableBodyBorrowedBooks,
        borrowedBooks
    );

}

// function for fill particular borrow has book copy when refill
const fillRenewedBooksTable=(dataOb)=>{
    let list = [dataOb];   // convert object → array
    fillBorrowedBooksDataIntoTable(
        tableBodyBorrowedBooks,
        list
    );

}

// common function for fill borrowed books into table
const fillBorrowedBooksDataIntoTable = (
    tableBody,
    dataList,
    // displayProperty
) => {
    tableBody.innerHTML = "";
    //selectedBorrowCode = null;

    dataList.forEach((dataOb, index) => {

        //tr
        let tr = document.createElement("tr");
        // store BorrowHasBookCopy id in row
        tr.dataset.bhbcid = dataOb.id;
        tr.dataset.borrow_id = dataOb.borrow_id ? dataOb.borrow_id.id : "";
        tr.borrowHasBookCopy = dataOb;
        tr.oldBorrowHasBookCopy = JSON.parse(JSON.stringify(dataOb));


        //checkbox
        let tdCheck= document.createElement("td");
        let checkbox= document.createElement("input");
        checkbox.type="checkbox";
        checkbox.classList.add("form-check-input",  "input-checkbox", "bookCheck");

        checkbox.addEventListener("change",function (){
            if(this.checked){
                let rowObj= tr.borrowHasBookCopy;

                const textMemberNoValue = textMemberNoElement.value;
                let memberByMemberNo= getHttpServiceRequest("/member/bymemberno/"+textMemberNoValue)
                let lastMembershipByMemberNo= getHttpServiceRequest("/membership/bymember/"+memberByMemberNo.id);

                let membershipEndDate= lastMembershipByMemberNo.enddate;
                let renewHandOverDueDate= rowObj.renewhandoverduedate;

                if(renewHandOverDueDate>membershipEndDate){
                    Swal.fire({
                        icon: 'warning',
                        title: "Member's membership expires before renew handover due date.",
                        html: ` <p>Book : <strong>${rowObj.bookcopy_id.book_id.title}</strong></p>
                        <p>Accession No : <strong>${rowObj.bookcopy_id.accessionno}</strong></p>
                        <p>Renew Handoverdue Date : <strong>${renewHandOverDueDate || ''}</strong><br></p>
                        <p>Membership End Date : <strong>${lastMembershipByMemberNo.enddate|| ''}</strong><br></p>
                        <p>Please renew membership first.</p>`,
                        confirmButtonText: 'OK'
                    })
                    this.checked= false;
                }

                let handOverDueDate= dataOb.borrow_id.handoverduedate;
                let today= getDateValue(new Date());
                if(today>handOverDueDate){
                    Swal.fire({
                        icon: 'warning',
                        title: "This Book can't be renewed today.Handover due date has passed.",
                        html: ` <p>Book : <strong>${rowObj.bookcopy_id.book_id.title}</strong></p>
                        <p>Accession No : <strong>${rowObj.bookcopy_id.accessionno}</strong></p>
                        <p>Handover Due Date : <strong>${handOverDueDate || ''}</strong><br></p>
                        <p>Please handover this book.</p>`,
                        confirmButtonText: 'OK'
                    })
                    this.checked= false;
                }

            }
        })

        tdCheck.appendChild(checkbox);
        tr.appendChild(tdCheck);

        //borrow code
        let tdBorrowCode= document.createElement("td");
        tdBorrowCode.classList.add("borrowCode");
        tdBorrowCode.innerText = dataOb.borrow_id ? dataOb.borrow_id.borrowcode : "-";
        tr.appendChild(tdBorrowCode);

        // accession no
        let tdAccessionNo= document.createElement("td");

        let accessionNo= document.createElement("span");
        accessionNo.innerText = dataOb.bookcopy_id ? dataOb.bookcopy_id.accessionno : "-";
        accessionNo.classList.add("accessionNo");

        let br= document.createElement("br")

        let bookname= document.createElement("span")
        bookname.innerText= dataOb.bookcopy_id.book_id.title ? dataOb.bookcopy_id.book_id.title : "-";

        tdAccessionNo.appendChild(accessionNo);
        tdAccessionNo.appendChild(br)
        tdAccessionNo.appendChild(bookname);

        tr.appendChild(tdAccessionNo)

        // borrow date
        let tdBorrowDate= document.createElement("td");
        tdBorrowDate.classList.add("borrowDate");
        tdBorrowDate.innerText = dataOb.borrow_id ? dataOb.borrow_id.borrowdate : "-";
        tr.appendChild(tdBorrowDate);

        // Handover Due date
        let tdHandoverDueDate= document.createElement("td");
        tdHandoverDueDate.classList.add("handoverDueDate");
        tdHandoverDueDate.innerText = dataOb.borrow_id ? dataOb.borrow_id.handoverduedate : "-";
        tr.appendChild(tdHandoverDueDate);

        const textMemberNoValue = textMemberNoElement.value;
        let memberByMemberNo= getHttpServiceRequest("/member/bymemberno/"+textMemberNoValue)
        let lastMembershipByMemberNo= getHttpServiceRequest("/membership/bymember/"+memberByMemberNo.id);

        // renew Handover due date -- input
        let tdRenewHandoverDueDate= document.createElement("td");
        let borrowDuration= lastMembershipByMemberNo.membershiptype_id.borrowduration;

       handoverDueDate= new Date(dataOb.borrow_id.handoverduedate);
       handoverDueDate.setDate(handoverDueDate.getDate()+borrowDuration);

        let addedHolidays= getHttpServiceRequest("/holidays/alldata")
        let holidayDates= addedHolidays.map(holiday=>holiday.date)

        for(let i=0; i<7; i++){
            if(!holidayDates.includes(getDateValue(handoverDueDate))){
                break;
            }
            handoverDueDate.setDate(handoverDueDate.getDate()+ 1);
        }

        tdRenewHandoverDueDate.innerText = getDateValue(handoverDueDate);
        tdRenewHandoverDueDate.classList.add("renewHandoverDueDate");

            let rowObj = tr.borrowHasBookCopy;
            rowObj.renewdate= dataOb.borrow_id.handoverduedate;
            rowObj.renewhandoverduedate = getDateValue(handoverDueDate);
        tr.appendChild(tdRenewHandoverDueDate);


        //tr append into tbody
        tableBody.appendChild(tr);
    });
};


// get selected renew books to push
const getSelectedRenewBooks = () => {

    //let bookList = [];
    let borrowMap = {};

    document.querySelectorAll("#tableBodyBorrowedBooks tr").forEach(row => {
        let checked = row.querySelector(".bookCheck").checked;
        if(checked){
            let borrowId = row.dataset.borrow_id;
            let obj = row.borrowHasBookCopy;

            if(!borrowMap[borrowId]){
                borrowMap[borrowId] = [];
            }

            borrowMap[borrowId].push(obj);
        }

    });

    return borrowMap;
};