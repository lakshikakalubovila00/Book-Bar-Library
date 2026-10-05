const tabpaneForm = document.getElementById("handoverAndFineTabPillForm");
const tabPaneTable = document.getElementById("handoverAndFineTabPillTable");
const tabPillForm = document.getElementById("handoverAndFineFormPill");
const tabPillTable = document.getElementById("handoverAndFineTablePill");

let borrowHasbookCopy = null;
let oldborrowHasbookCopy = null;

let borrow = null;
let oldBorrow = null;

let tableBodyBorrowedBooks= document.getElementById("tableBodyBorrowedBooks");
let textMemberNoElement = document.getElementById("textMemberNo");
let tableBody= document.getElementById("tableBodyHandoverAndFine")

// window load function
window.addEventListener("load",()=>{
     // enable tooltip
  $('[data-bs-toggle="tooltip"]').tooltip();
    userPrivi=getHttpServiceRequest("/userprivilegebymodule?modulename=Book-Handover-and-Fine")
    // call table refresh function
    refreshHandoverAndFineTable();
    // call form refresh function
    refreshHandoverAndFineForm();

})

// refresh tab pane table function
const refreshHandoverAndFineTable=()=>{
    // IF table is already DataTable THEN remove it THEN create new DataTable
    if ($.fn.DataTable.isDataTable('#tableHandoverAndFine')) {
        $('#tableHandoverAndFine').DataTable().destroy();
    }
    let handoveres = ajaxGetrequest("/borrowhasbookcopy/handoveredbooks");

    let displayProperty = [
        { propertyName: getBorrowCode, dataType: "function" },
        { propertyName: getMemberNo, dataType: "function" },
        { propertyName: getMemberName, dataType: "function" },
        { propertyName: getHandOveredBookAccessionNo, dataType: "function" },
        { propertyName: getHandOveredBookTitle, dataType: "function" },
        { propertyName: "actualhandovereddate", dataType: "string" },
        { propertyName: getFullFineAmount, dataType: "function" },
        { propertyName: getStatus, dataType: "function" },
    ];

    fillDataIntoTableEight(
        tableBody,
        handoveres,
        displayProperty,
        refillHandoverAndFineForm
    );
    buttonSubmit.classList.remove("d-none");
    //buttonUpdate.classList.add("d-none");
    buttonPrint.classList.add("d-none");
    buttonDelete.classList.add("d-none");

    $("#tableHandoverAndFine").DataTable({
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

// function for get handovered book acccession no
const getHandOveredBookAccessionNo = (ob) => {
    return ob.bookcopy_id.accessionno;
};

// function for get handovered book title
const getHandOveredBookTitle = (ob) => {
    return ob.bookcopy_id.book_id.title;
};

// get borrow has book copy fine cost
const getFullFineAmount=(ob)=>{
    return ob.finecost;
}

// get borrow has book copy status
const getStatus=(ob)=>{
    return ob.borrowhasbookcopystatus_id.name;
}

// refill form function
const refillHandoverAndFineForm=(dataOb)=>{
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

    fillHandoveredBooksTable(dataOb);

    document.querySelectorAll("#tableBodyBorrowedBooks tr").forEach(row => {
                if(row.dataset.bhbcid == borrowHasbookCopy.id){

                    row.querySelector(".bookCheck").checked = true;
                    row.querySelector(".bookCheck").disabled = true;
                    row.querySelector(".borrowCode").innerText= borrowHasbookCopy.borrow_id.borrowcode ;
                    row.querySelector(".accessionNo").innerText= borrowHasbookCopy.bookcopy_id.accessionno ;
                    row.querySelector(".borrowDate").innerText= borrowHasbookCopy.borrow_id.borrowdate;
                    row.querySelector(".handoverDueDate").innerText= borrowHasbookCopy.borrow_id.handoverduedate ;

                    let dateInput = row.querySelector(".handoverDate");
                    dateInput.value = borrowHasbookCopy.actualhandovereddate;

                    row.querySelector(".delayDays").innerText = borrowHasbookCopy.delaydays;

                    let damageType = row.children[8].querySelector("select");
                    damageType.value = JSON.stringify(borrowHasbookCopy.damagetype_id);

                    let damagePercentage = row.children[9].querySelector("input");
                    damagePercentage.value = borrowHasbookCopy.damagepercentage;

                    row.querySelector(".fineAmount").innerText = borrowHasbookCopy.finecost;

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
const deleteHandoverAndFineRecord=(dataOb)=>{
    //  confirmation
    borrowHasbookCopy = getHttpServiceRequest("/borrowhasbookcopy/byid/"+ dataOb.id)
   // borrow = getHttpServiceRequest("/borrow/byid/"+ dataOb.id)
    // hand overed books *
    Swal.fire({
        title: "Confirm Deletion",
        html: `<p>Are you sure to Delete this Hanover & Fine Record ?</p>
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
            let deleteServiceResponse = getHttpServiceRequest("/handoverandfine/deletehandoverbooks", "DELETE", dataOb)
            if (deleteServiceResponse == "OK") {
                Swal.fire({
                    title: "Deleted!",
                    text: "Handover & Fine Record Deleted Successfully.",
                    icon: 'success',

                });
                //refresh table
                refreshHandoverAndFineTable();
                refreshHandoverAndFineForm();

                // shift to tab pane table
                tabpaneForm.classList.remove('show', 'active');
                tabPaneTable.classList.add('show', 'active');

                // shift to  table pill tab
                tabPillForm.classList.remove('show', 'active');
                tabPillTable.classList.add('show', 'active');
            } else {
                Swal.fire({
                    title: 'Deletion Failed',
                    html: `<p>Handover & Fine record could not be deleted.</p>
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
const printHandoverAndFineRecord=(dataOb)=>{
    let handoverAndFineModal_view = new bootstrap.Modal(
        document.getElementById("modalHandoverAndFineView"),
        {}
    );
    handoverAndFineModal_view.show();
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
    tdHandoveredDate.innerText= dataOb.actualhandovereddate  ;
    tdDelayDays.innerText= dataOb.delaydays  ;
    tdDamageType.innerText= dataOb.damagetype_id.name  ;
    tdDamagePercentage.innerText= dataOb.damagepercentage  ;
    tdFineCost.innerText= dataOb.finecost ;
    tdStatus.innerText= dataOb.borrowhasbookcopystatus_id.name  ;

}

// print function
const printHandoverAndFine=()=>{
    let tab = window.open();
    tab.document.write('<html>'
        + '<head><title>Print Handover & Fine Record</title>'
        + '<link rel="stylesheet" href="../resources/bootstrap-5.2.3/css/bootstrap.min.css"/>'
        + '</head>'
        + '<body>'
        + divCardPrintHandoverAndFine.outerHTML
        + '</body></html>');

    setInterval(() => {
        tab.stop();
        tab.print();
        tab.close();
    }, 700);
}

// refresh form function
const refreshHandoverAndFineForm=()=>{
    console.log(userPrivi)
    handoverAndFineForm.reset();
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

//check borrow form errors
const checkhandOverAndFineFormErrors=(tr)=>{
    let errors="";
    let newObj = tr.borrowHasBookCopy;

        if(newObj.actualhandovereddate ==null ){
            errors+="Please Select Handovered Date.<br>";
            tr.querySelector(".handoverDate").style.borderBottom="2px solid pink"
        }
        if(newObj.damagetype_id ==null ){
            errors+="Please Select Damage Type.<br>";
            tr.querySelector(".damageType").style.borderBottom="2px solid pink"
        }else{
            if(newObj.damagetype_id.name=="Partial Damage"){
                if (!newObj.damagepercentage || newObj.damagepercentage==null) {
                    errors += "Please Enter Damage Percentage.<br>";
                    tr.querySelector(".damagePercentage").style.borderBottom = "2px solid pink";
                }
            }
        }

    return errors;
}

// submit button function
const submitHandoverAndFineButton = () => {

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
            text: "Please select at least one book to handover.",
            icon: "warning"
        });
        return;
    }
    let tr = document.querySelectorAll("#tableBodyBorrowedBooks tr");

    let formErrors = "";

    tr.forEach(tr => {

        let checkbox = tr.querySelector(".bookCheck");

        if (checkbox && checkbox.checked) {

            formErrors += checkhandOverAndFineFormErrors(tr);

        }
    });
    if(formErrors !=="") {
        Swal.fire({
            title: "Save Failed",
            html: `<p>Form has following errors:</p>${formErrors}`,
            icon: "error"
        });
        return;
    }
    // form has not any errors
                Swal.fire({
                    title: "Confirm Save",
                    html: `<p>Are you sure to save this Handover & Fine record?</p>`,
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#ff0000ff",
                    cancelButtonColor: "rgb(0, 102, 255)",
                    confirmButtonText: "Yes, Save",
                    cancelButtonText: "Cancel",
                    reverseButtons: true,

                }).then((result) => {
                    if (result.isConfirmed) {

                        let groupedBooks = getSelectedHandoverBooks();

                        let borrowList = [];
                        let borrowIds = Object.keys(groupedBooks);
                        let selectedBorrowIds = [borrowIds];
                        console.log("ids"+borrowIds)

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
                            "/handoverandfine/savehandoverbooks",
                            "PUT",
                            borrowList
                        );
                        if (postServiceResponse == "OK") {
                            // save successs
                            Swal.fire({
                                title: "Saved!",
                                text: "Handover & Fine record saved successfully.",
                                icon: 'success',
                                confirmButtonText: "Proceed to Payment",
                                allowOutsideClick: false,   // block outside click
                                allowEscapeKey: false,

                             }).then((result)=>{
                                if (result.isConfirmed){
                                    let totalFine= parseFloat(tdFullFineAmount.innerText);
                                    if(totalFine>0){
                                        window.location.replace("/payment?borrowIds=" + selectedBorrowIds.join(","));
                                    }else{
                                        // no fine - no payment
                                        Swal.fire({
                                            icon: "No Need to Pay",
                                            title: "No Fine Payment",
                                            text: "All books handovered without fines."
                                        });

                                    }
                                }
                            })
                            refreshHandoverAndFineTable();
                            refreshHandoverAndFineForm();
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
                                html: `<p>Handover & Fine record could not be saved.</p>
                        <p>Details: ${postServiceResponse}</p>`,
                                confirmButtonText: 'OK'
                            });

                        }
                    } else {
                        //get user confirm for form discard
                        // can get user confrimation for form refresh
                        Swal.fire({
                            title: "Confirm Refresh",
                            text: "Do you need to refresh handover & fine form ?",
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

// check borrow form updates
const checkHandoverAndFineFormUpdates=(tr)=>{
    let updates="";

    let newObj = tr.borrowHasBookCopy;
    let oldObj = tr.oldBorrowHasBookCopy;

    if(borrowHasbookCopy.borrow_id.member_id.name != oldborrowHasbookCopy.borrow_id.member_id.name){
        updates+="Member is changed "+
            oldborrowHasbookCopy.borrow_id.member_id.name+" into "+
            borrowHasbookCopy.borrow_id.member_id.name+
            ".<br>"
    }

    if(newObj.actualhandovereddate != oldObj.actualhandovereddate){
        updates+="Handovered Date is changed "+
            oldObj.actualhandovereddate+" into "+
            newObj.actualhandovereddate+
            ".<br>"
    }
    if(newObj.delaydays != oldObj.delaydays){
        updates+="Delay Days is changed "+
            oldObj.delaydays+" into "+
            newObj.delaydays+
            ".<br>"
    }

    if(newObj.damagetype_id?.id != oldObj.damagetype_id?.id){
        updates+="Damage Type is changed "+
            oldObj.damagetype_id.name+" into "+
            newObj.damagetype_id.name+
            ".<br>"
    }

    if(newObj.damagepercentage != oldObj.damagepercentage){
        updates+="Damage Type is changed "+
            oldObj.damagepercentage+" into "+
            newObj.damagepercentage+
            ".<br>"
    }

    if(newObj.finecost != oldObj.finecost){
        updates+="Fine Cost is changed "+
            oldObj.finecost+" into "+
            newObj.finecost+
            ".<br>"
    }


    return updates;
}

const updateHandoverAndFineButton=()=>{
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

    let formErrors = "";

    tr.forEach(tr => {

        let checkbox = tr.querySelector(".bookCheck");

        if(checkbox && checkbox.checked) {
            formErrors = checkhandOverAndFineFormErrors(tr);
            if (formErrors === "") {
                let formUpdates = "";
                formUpdates += checkHandoverAndFineFormUpdates(tr);

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
                        html: `<p>Are you sure to update this Handover & Fine record?</p>
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
                            let updateServiceResponse = getHttpServiceRequest("/handoverandfine/updatehandoverbooks", "PUT", borrowList);

                            if (updateServiceResponse == "OK") {
                                //user confrim update
                                Swal.fire({
                                    title: "Updated!",
                                    text: "Handover & Fine record updated successfully.",
                                    icon: 'success',

                                });
                                //refresh form and table
                                refreshHandoverAndFineTable();
                                refreshHandoverAndFineForm();

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
                                    html: `<p>Handover & Fine record could not be updated.</p>
                                    <p>${updateServiceResponse}</p>`,
                                    confirmButtonText: 'OK'
                                });
                            }
                        }
                    })

                }

            }else {
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
    let borrowedOrRenewedBooks = ajaxGetrequest("/borrow/borrowedbooks/"+memberByMemberNo.id);

    // set borrow object
    if(borrowedOrRenewedBooks.length > 0){
        borrow = borrowedOrRenewedBooks[0].borrow_id;
        oldBorrow = JSON.parse(JSON.stringify(borrow));
    }else{
        borrow = null;
        oldBorrow = null;
    }
    fillBorrowedBooksDataIntoTable(
        tableBodyBorrowedBooks,
        borrowedOrRenewedBooks
    );

}

// function for fill particular borrow has book copy when refill
const fillHandoveredBooksTable=(dataOb)=>{
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
        tr.dataset.borrow_id = dataOb.borrow_id.id;
        tr.borrowHasBookCopy = dataOb;
        tr.oldBorrowHasBookCopy = JSON.parse(JSON.stringify(dataOb));


        //checkbox
        let tdCheck= document.createElement("td");
        let checkbox= document.createElement("input");
        checkbox.type="checkbox";
        checkbox.classList.add("form-check-input",  "input-checkbox", "bookCheck");
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

        // renew Handover Due date
        let tdRenewHandoverDueDate= document.createElement("td");
        tdRenewHandoverDueDate.classList.add("renewHandoverDueDate");
        if(dataOb.renewhandoverduedate==null || dataOb.renewhandoverduedate==undefined){
            tdRenewHandoverDueDate.innerText =  "-";
        }else{
            tdRenewHandoverDueDate.innerText = dataOb.renewhandoverduedate;
        }

        tr.appendChild(tdRenewHandoverDueDate);

        // Handovered date -- input
        let tdHandoveredDate= document.createElement("td");
        let inputHandoveredDate= document.createElement("input");
        inputHandoveredDate.type="date";
        let borrowDate = dataOb.borrow_id ? dataOb.borrow_id.borrowdate : "";
        inputHandoveredDate.min= borrowDate;
        let today= new Date();
        inputHandoveredDate.max= getDateValue(today);
        inputHandoveredDate.value=  getDateValue(today);
        inputHandoveredDate.style.borderBottom="2px solid lightgreen";
        inputHandoveredDate.classList.add("form-control", "input-area" , "handoverDate" , "normal-text");
        inputHandoveredDate.disabled=true;
        inputHandoveredDate.onchange=()=>{
            let rowObj = tr.borrowHasBookCopy;
            rowObj.actualhandovereddate = inputHandoveredDate.value;
            inputHandoveredDate.style.borderBottom="2px solid lightgreen";
            calculateDelayAndFine(tr,dataOb);
        }
        tdHandoveredDate.appendChild(inputHandoveredDate);
        tr.appendChild(tdHandoveredDate);

        // delay days
        let tdDelayDays= document.createElement("td");
        tdDelayDays.classList.add("delayDays")
        tr.appendChild(tdDelayDays);

        // damage type
        let tdDamageType= document.createElement("td");
        let selectDamageType= document.createElement("select");
        selectDamageType.classList.add("form-select",  "input-area" , "damageType", "normal-text");
        let damageTypes = ajaxGetrequest("/damagetype/alldata");

        fillDataIntoSelect(
            selectDamageType,
            "Damage Type",
            damageTypes,
            "name"
        );
        selectDamageType.disabled=true;
        selectDamageType.onchange=()=>{
            let rowObj = tr.borrowHasBookCopy;
            const selectedDamageType = JSON.parse(selectDamageType.value);
            rowObj.damagetype_id = selectedDamageType;
            selectDamageType.style.borderBottom="2px solid lightgreen";
            let inputDamagePrecentage = tr.children[9].querySelector("input");

            if (selectedDamageType.name === "No Damage") {
                inputDamagePrecentage.value = 0;
                inputDamagePrecentage.disabled = true;
                inputDamagePrecentage.style.borderBottom = " 2px solid lightgreen";
            }
            if (selectedDamageType.name === "Partial Damage") {
                inputDamagePrecentage.value = "";
                inputDamagePrecentage.disabled = false;
            }

            if (selectedDamageType.name === "Full Damage") {
                inputDamagePrecentage.value = 100;
                inputDamagePrecentage.disabled = true;
                inputDamagePrecentage.style.borderBottom = " 2px solid lightgreen";
            }
            if (selectedDamageType.name === "Lost") {
                inputDamagePrecentage.value = 100;
                inputDamagePrecentage.disabled = true;
                inputDamagePrecentage.style.borderBottom = " 2px solid lightgreen";
            }
            calculateFine(tr,dataOb);
        }

        tdDamageType.appendChild(selectDamageType);
        tr.appendChild(tdDamageType);

        //damage precentage
        let tdDamagePrecentage= document.createElement("td");
        let divInputGroup= document.createElement("div");
        divInputGroup.classList.add("input-group");
        let inputDamagePrecentage= document.createElement("input");
        inputDamagePrecentage.type="number";
        inputDamagePrecentage.classList.add("form-control", "input-area", "damagePercentage" , "normal-text");
        inputDamagePrecentage.disabled=true;
        inputDamagePrecentage.addEventListener("keyup",()=>{
            const damagePercentageValue= inputDamagePrecentage.value;
            let pattern= "^[1-9][0-9]?$";
            const regExpPattern= new RegExp(pattern);
            if(damagePercentageValue !=""){
                //value is not empty
                if(regExpPattern.test(damagePercentageValue)){
                    // value is valid
                    inputDamagePrecentage.style.borderBottom = " 2px solid lightgreen";
                    let rowObj = tr.borrowHasBookCopy;

                    rowObj.damagepercentage = parseInt(inputDamagePrecentage.value) || 0;
                    calculateFine(tr,dataOb)
                }else{
                    // value is invalid
                    inputDamagePrecentage.style.borderBottom = " 2px solid pink";
                }
            }else{
                // value is empty
                if (inputDamagePrecentage.required) {
                    inputDamagePrecentage.style.borderBottom = "2px solid pink";
                }else {
                    inputDamagePrecentage.style.borderBottom = "white";
                }
            }
        })

        let spanPerecentageSymbol= document.createElement("span");
        spanPerecentageSymbol.classList.add("input-group-text" , "fw-bold");
        spanPerecentageSymbol.innerText="%";
        divInputGroup.appendChild(inputDamagePrecentage);
        divInputGroup.appendChild(spanPerecentageSymbol);
        tdDamagePrecentage.appendChild(divInputGroup);
        tr.appendChild(tdDamagePrecentage);

        //additional charges
        let tdAdditionalCharges= document.createElement("td");
        let inputAdditionalCharges= document.createElement("input");
        inputAdditionalCharges.type="number";
        inputAdditionalCharges.classList.add("form-control", "input-area", "additionalCharges" , "normal-text");
        inputAdditionalCharges.disabled=true;
        inputAdditionalCharges.addEventListener("keyup",()=>{
            const additionalChargesValue= inputAdditionalCharges.value;
            let pattern= "^([0-9][0-9]{0,4})$";
            const regExpPattern= new RegExp(pattern);
            if(additionalChargesValue !=""){
                //value is not empty
                if(regExpPattern.test(additionalChargesValue)){
                    // value is valid
                    inputAdditionalCharges.style.borderBottom = " 2px solid lightgreen";
                    let rowObj = tr.borrowHasBookCopy;

                    rowObj.additionalcharges = parseInt(inputAdditionalCharges.value) || 0;
                    calculateFine(tr,dataOb)
                }else{
                    // value is invalid
                    inputAdditionalCharges.style.borderBottom = " 2px solid pink";
                }
            }else{
                // value is empty
                if (inputAdditionalCharges.required) {
                    inputAdditionalCharges.style.borderBottom = "2px solid pink";
                }else {
                    inputAdditionalCharges.style.borderBottom = "white";
                }
            }
        })
        tdAdditionalCharges.appendChild(inputAdditionalCharges);
        tr.appendChild(tdAdditionalCharges);

        // fine amount
        let tdFineAmount= document.createElement("td");
        tdFineAmount.classList.add("fineAmount")
        tr.appendChild(tdFineAmount);

        //tr append into tbody
        tableBody.appendChild(tr);
    });
};

// function for calculate fine and delay days
const calculateDelayAndFine=(tr, dataOb)=>{
    let rowObj = tr.borrowHasBookCopy;

    let handoverDueDate= new Date(dataOb.borrow_id.handoverduedate);

    let renewHandoverDueDate= new Date(dataOb.renewhandoverduedate);

    let handoveredDate= new Date(tr.querySelector(".handoverDate").value);

    if (!tr.querySelector(".handoverDate").value) {
        tr.querySelector(".delayDays").innerText = "";
        return;
    }
    if(dataOb.renewhandoverduedate== null|| dataOb.renewhandoverduedate== undefined){
        let delayDays = (handoveredDate- handoverDueDate)/ 86400000;

        if(delayDays<0){
            delayDays=0;
        }
        rowObj.delaydays = delayDays;

        tr.querySelector(".delayDays").innerText= delayDays;
        calculateFine(tr, dataOb);
    }else{
        let delayDays = (handoveredDate- renewHandoverDueDate)/ 86400000;

        if(delayDays<0){
            delayDays=0;
        }
        rowObj.delaydays = delayDays;
        tr.querySelector(".delayDays").innerText= delayDays;
        calculateFine(tr, dataOb);
    }


    // let delayDays = (handoveredDate- handoverDueDate)/ 86400000;
    // rowObj.delaydays = delayDays;
    // if(delayDays<0){
    //     delayDays=0;
    // }
    //
    // tr.querySelector(".delayDays").innerText= delayDays;
    // calculateFine(tr, dataOb);
}

// calculate fine for delay days and damages
const calculateFine=(tr, dataOb)=>{
    let rowObj = tr.borrowHasBookCopy;
    let delayDays = parseInt(tr.querySelector(".delayDays").innerText);

    const textMemberNoValue = textMemberNoElement.value;
    let memberByMemberNo= getHttpServiceRequest("/member/bymemberno/"+textMemberNoValue)

        let lastMembership = ajaxGetrequest("/membership/bymember/" + memberByMemberNo.id)
        let delayFinePrice= lastMembership.membershiptype_id.fineprice;
        let delayFine= delayDays* delayFinePrice;

    let inputDamagePrecentage = tr.children[9].querySelector("input");
    let inputAdditionalCharges= tr.children[10].querySelector("input")

    let damagePercent = parseInt(inputDamagePrecentage.value) || 0;
    let additionalCharges = parseInt(inputAdditionalCharges.value) || 0;

    let bookPrice= dataOb.bookcopy_id.book_id.initialprice;
    let damageFine= bookPrice * damagePercent /100;
    let totalFine= delayFine+ damageFine+ additionalCharges;
    tr.querySelector(".fineAmount").innerText = totalFine;
    rowObj.finecost= totalFine;

    calculateFullFine();

}

// full fine for the handoverd books even form different borrow codes
const calculateFullFine = () => {

    let total = 0;
    document.querySelectorAll("#tableBodyBorrowedBooks tr").forEach(row => {
        let checked = row.querySelector(".bookCheck").checked;
        if (checked) {
            let fine = parseFloat(row.querySelector(".fineAmount").innerText) || 0;
            total += fine;
        }
    });

    tdFullFineAmount.innerText = total.toFixed(2);

};

// get full fine amount when checked checkbox
document.addEventListener("change", function(e){

    if(e.target.classList.contains("bookCheck")){
        let row = e.target.closest("tr");

        let inputHandoveredDate =row.querySelector(".handoverDate");
        let selectDamageType = row.querySelector(".damageType");
        let inputAdditionalCharges= row.querySelector(".additionalCharges")

        if(e.target.checked){
            //  when checkbox is checked
            inputHandoveredDate.disabled = false;
            selectDamageType.disabled = false;
            inputAdditionalCharges.disabled=false;
            // set today's date if empty
            if(!inputHandoveredDate.value){
                inputHandoveredDate.value = getDateValue(new Date());
            }

            // save to object
            row.borrowHasBookCopy.actualhandovereddate = inputHandoveredDate.value;

            // calculate immediately
            calculateDelayAndFine(row, row.borrowHasBookCopy);

        } else {
            //  when checkbox is unchecked
            inputHandoveredDate.disabled = true;
            selectDamageType.disabled = true;
            inputAdditionalCharges.disabled=true;
        }

        calculateFullFine();
    }

});

// get selected handover books to push
const getSelectedHandoverBooks = () => {

    //let bookList = [];
    let borrowMap = {};

    document.querySelectorAll("#tableBodyBorrowedBooks tr").forEach(row => {
        let checked = row.querySelector(".bookCheck").checked;
        if(checked){
            let borrowId = row.dataset.borrow_id;
            let obj = row.borrowHasBookCopy;

            obj.actualhandovereddate = row.querySelector(".handoverDate").value;

            obj.delaydays = parseInt(row.querySelector(".delayDays").innerText) || 0;

            obj.damagepercentage = parseInt(row.children[9].querySelector("input").value) || 0;

            obj.additionalcharges = parseInt(row.children[10].querySelector("input").value) || 0;

            obj.finecost = parseFloat(row.querySelector(".fineAmount").innerText) || 0;

            if(!borrowMap[borrowId]){
                borrowMap[borrowId] = [];
            }

            borrowMap[borrowId].push(obj);
        }

    });

    return borrowMap;
};
