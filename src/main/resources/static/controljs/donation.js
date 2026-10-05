const tabpaneForm = document.getElementById("donationTabPillForm");
const tabPaneTable = document.getElementById("donationTabPillTable");
const tabPillForm = document.getElementById("donationFormPill");
const tabPillTable = document.getElementById("donationTablePill");

const tableBody= document.getElementById("tableBodydonation");
const selectDonatorElement = document.getElementById("selectDonator");
const textPurposeElement = document.getElementById("textPurpose");
const selectDonationStatusElement = document.getElementById("selectDonationStatus");
const textNoteElement = document.getElementById("textNote");

const selectBookElement = document.getElementById("selectBook");
const textQuantityElement = document.getElementById("textQuantity");

////BOOK Form////
// form elements

const selectResourceTypeElement = document.querySelector("#selectResourceType");
const selectLanguageElement = document.querySelector("#selectLanguage");
const selectDisplayCategoryElement = document.querySelector("#selectDisplayCategory");
const selectBookStatusElement = document.querySelector("#selectBookStatus");
const selectMagazineFrequency = document.querySelector("#selectMagazineFrequency");
const selectNewsPaperEdition = document.querySelector("#selectNewsPaperEdition");
const selectNewsPaperFrequency = document.querySelector("#selectNewsPaperFrequency");
const selectJournalFrequency = document.querySelector("#selectJournalFrequency");
const resourceType = document.getElementById("selectResourceType");
const titleElement = document.getElementById("textTitle");
const authorelement = document.getElementById("textAuthor");
const publicationDateElement = document.getElementById("datePublicationDate");
const ddcNoElement = document.getElementById("textDdcNo");
const calNoElement = document.getElementById("textCallNo");

const authorList= document.getElementById("authorList");
const publisherList= document.getElementById("publisherList")
const seriesList = document.getElementById("seriesList");

// columns and rows to show or hide

const authorColumnElement = document.getElementById("authorColumn")
const publicationDateColumnElement = document.getElementById("publicationDateColumn")
const editonAndEditionYearRow = document.getElementById("editonAndEditionYearRow");
const seriesAndSeriesNoRow = document.getElementById("seriesAndSeriesNoRow");
const startedyearAndFrequencyRow = document.getElementById("startedyearAndFrequencyRow");
const magazineFrequencyColumn = document.getElementById("magazineFrequencyColumn");
const journalFrequencyColumn = document.getElementById("journalFrequencyColumn");
const volumeandIssueNoRow = document.getElementById("volumeandIssueNoRow");
const newsPaperEditionandDrequencyRow = document.getElementById("newsPaperEditionandDrequencyRow");
const isbnInputAreaElement = document.getElementById("isbnInputArea");
const issnInputAreaElement = document.getElementById("issnInputArea");
const ddcAndCallNoRow = document.getElementById("ddcAndCallNoRow");

// required star element show or hide

const starAuthorRequiredElement = document.getElementById("starAuthorRequired")
const starISBNRequiredElement = document.getElementById("starISBNRequired")
const starISSNRequiredElement = document.getElementById("starISSNRequired")

// window load function
window.addEventListener("load",()=>{
     // enable tooltip
  $('[data-bs-toggle="tooltip"]').tooltip();
    userPrivi=getHttpServiceRequest("/userprivilegebymodule?modulename=Donation")
    //call table refresh function
    refreshDonationTable();
    //call form refresh function
    refreshDonationForm();
    // book form refresh
    refreshBookForm();

})

// function for disable elements for non-privileged users
const disableElement=()=>{
    selectDonatorElement.disabled= true;
    textPurposeElement.disabled= true;
    selectDonationStatusElement.disabled= true;
    textNoteElement.disabled= true;
    selectBookElement.disabled= true;
    textQuantityElement.disabled= true;
}

// function for refresh table
const refreshDonationTable=()=>{
    // IF table is already DataTable THEN remove it THEN create new DataTable
    if ($.fn.DataTable.isDataTable('#tableDonation')) {
        $('#tableDonation').DataTable().destroy();
    }

    donations= new Array();
    donations= ajaxGetrequest("/donation/alldata");
    // property array
    let displayProperty = [
        { propertyName: "donationcode", dataType: "string" },
        { propertyName: getDonator, dataType: "function" },
        { propertyName: getBooks, dataType: "function" },
        { propertyName: getStatus, dataType: "function" }
    ];
    fillDataIntoTableEight(
        tableBody,
        donations,
        displayProperty,
        refillDonationForm
    )
    buttonSubmitDonation.classList.remove("d-none");
    //buttonUpdateDonation.classList.add("d-none");
    buttonPrintDonation.classList.add("d-none");
    buttonDeleteDonation.classList.add("d-none");
    buttonSubmitInnerForm.classList.remove("d-none");
    buttonUpdateInnerForm.classList.add("d-none");

    $("#tableDonation").DataTable({
        responsive: true,
        autoWidth: false
    });
}

// function for get donator name
const getDonator=(ob)=>{
    return ob.donator_id.name;
}

// get book list
const getBooks=(ob)=>{
    if(!ob.donationHasBookList || ob.donationHasBookList.length===0){
        return "-";
    }
    let bookTitles= ob.donationHasBookList.map(pobook=>pobook.book_id.title);
    return bookTitles.join(", ");
}

// get donation status
const getStatus=(ob)=>{
    if (ob.donationstatus_id.name == "Received") {
        return '<i class="fa-solid fa-house-circle-check fa-lg" style="color: rgb(0, 194, 10);"></i>';
    }
    if (ob.donationstatus_id.name == "Deleted") {
        return '<i class="fa-solid fa-trash fa-lg" style="color: rgb(255, 0, 0);"></i>';
    }
}

// function for refill donation form
const refillDonationForm=(dataOb)=>{
    setInitial([
        selectDonatorElement,
        textPurposeElement,
        selectDonationStatusElement,
        textNoteElement
    ])

    console.log(dataOb);
    // shift to tab pane form
    tabpaneForm.classList.add('show', 'active');
    tabPaneTable.classList.remove('show', 'active');
    // shift to  form pill tab
    tabPillForm.classList.add('show', 'active');
    tabPillTable.classList.remove('show', 'active');

    donation = ajaxGetrequest("/donation/byid/"+ dataOb.id);
    oldDonation = ajaxGetrequest("/donation/byid/"+ dataOb.id);

    selectDonatorElement.value= JSON.stringify(donation.donator_id);
    selectDonationStatusElement.value= JSON.stringify(donation.donationstatus_id);
    selectDonationStatusElement.disabled=false;

    //purpose- optional
    if (donation.purpose != undefined || donation.purpose != null) {
        textPurposeElement.value = donation.purpose;
    } else {
        textPurposeElement.value = "";
    }

    //note- optional
    if (donation.note != undefined || donation.note != null) {
        textNoteElement.value = donation.note;
    } else {
        textNoteElement.value = "";
    }
    refreshInnerFormAndTable();

    // if(!userPrivi.privi_update){
    //     buttonUpdateDonation.classList.add("d-none");
    // }else {
    //     buttonUpdateDonation.classList.remove("d-none");
    // }
    if(!userPrivi.privi_delete){
        buttonDeleteDonation.classList.add("d-none");
    }else {
        buttonDeleteDonation.classList.remove("d-none");
    }

    // set button visibility
    // only showing update. submit space also not showing
    buttonSubmitDonation.classList.add("d-none");
    buttonPrintDonation.classList.remove("d-none")

}

// delete function
const deleteDonationRecord=(dataOb)=>{
    //  confirmation
    donation = getHttpServiceRequest("/donation/byid/"+ dataOb.id)
    Swal.fire({
        title: "Confirm Deletion",
        html: `<p>Are you sure to Delete this Donation Record ?</p>
          <p>Donation Code : <strong>${donation.donationcode || ''}</strong><br></p>
           <p>Donator : <strong>${donation.donator_id.name || ''}</strong><br></p>
           <p>Donation Status : <strong>${donation.donationstatus_id.name || ''}</strong></p>`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ff0000ff",
        cancelButtonColor: "rgb(0, 102, 255)",
        confirmButtonText: "Yes, Delete",
        cancelButtonText: "Cancel",
        reverseButtons: true,


    }).then((result) => {
        if (result.isConfirmed) {
            let deleteServiceResponse = getHttpServiceRequest("/donation/delete", "DELETE", dataOb)
            if (deleteServiceResponse == "OK") {
                Swal.fire({
                    title: "Deleted!",
                    text: "Donation Record Deleted Successfully.",
                    icon: 'success',

                });
                //refresh table
                refreshDonationTable();
                refreshDonationForm();

                // shift to tab pane table
                tabpaneForm.classList.remove('show', 'active');
                tabPaneTable.classList.add('show', 'active');

                // shift to  table pill tab
                tabPillForm.classList.remove('show', 'active');
                tabPillTable.classList.add('show', 'active');
            } else {
                Swal.fire({
                    title: 'Deletion Failed',
                    html: `<p>Donation record could not be deleted.</p>
                <p>Details: ${deleteServiceResponse}</p>`,
                    confirmButtonText: 'OK'
                });
            }
        } else {
            //refresh table
        }
    })
}

// print function
const printDonationRecord=(dataOb)=>{
    let donationModal_view = new bootstrap.Modal(
        document.getElementById("modalDonationView"),
        {}
    );
    donationModal_view.show();
    purchaseorder= getHttpServiceRequest("/donation/byid/"+ dataOb.id);
    tdDonationCode.innerText= dataOb.donationcode  ;
    tdDonator.innerText= dataOb.donator_id.name  ;
    tdPurpose.innerText= dataOb.purpose  ;
    tdDonationStatus.innerText= dataOb.donationstatus_id.name  ;
    tdnote.innerText= dataOb.note  ;

    // tdpurchaseBooks

    if(!dataOb.donationHasBookList || dataOb.donationHasBookList.length===0){
        return "-";
    }
    let bookTitles= dataOb.donationHasBookList.map(pobook=>pobook.book_id.title);
    tdonatedBooks.innerText=bookTitles.join(", ");
}

const printDonation=()=>{
    let tab = window.open();
    tab.document.write('<html>'
        + '<head><title>Print Donation Record</title>'
        + '<link rel="stylesheet" href="../resources/bootstrap-5.2.3/css/bootstrap.min.css"/>'
        + '</head>'
        + '<body>'
        + divCardPrintDonation.outerHTML
        + '</body></html>');

    setInterval(() => {
        tab.stop();
        tab.print();
        tab.close();
    }, 700);
}

// refresh donation form function
const refreshDonationForm=()=>{
    // clean static element- only value- empty static element
    donationForm.reset();
    if(!userPrivi.privi_insert){
        disableElement();
       // buttonSubmitDonation.classList.add("d-none");
        buttonSubmitInnerForm.classList.add("d-none");
        tabpaneForm.classList.remove('show', 'active');
        tabPillForm.classList.remove('show','active')
        tabPaneTable.classList.add('show', 'active');
        tabPillTable.classList.add('show','active')
    }

    donation= new Object();
    donation.donationHasBookList= new Array();

    let donators= ajaxGetrequest("/donator/alldata");
    fillDataIntoSelect(selectDonatorElement,"Please Select Donator",donators,"name");

    let donationstatuses= ajaxGetrequest("/donationstatus/alldata");
    fillDataIntoSelect(selectDonationStatusElement,"Please Select Donation Status",donationstatuses,"name");

    refreshInnerFormAndTable();

    setInitial([
        selectDonatorElement,
        textPurposeElement,
        selectDonationStatusElement,
        textNoteElement
    ])
    // auto select status - fill default value for donation status- received
    selectDonationStatusElement.value= JSON.stringify(donationstatuses[0]);
    // binding to book object
    donation.donationstatus_id=donationstatuses[0];
    selectDonationStatusElement.disabled=true;
    //set valid color
    selectDonationStatusElement.style.borderBottom="2px solid lightgreen";
}

//check donation form errors
const checkDonationFormErrors=()=>{
    let errors="";
    if(donation.donator_id == null){
        errors+="Please Select Donator.<br>";
        selectDonatorElement.value="2px solid pink"
    }
    if(donation.donationstatus_id == null){
        errors+="Please Select Donation Status.<br>";
        selectDonationStatusElement.value="2px solid pink"
    }
    if(donation.donationHasBookList.length == 0){
        errors+="Please Select Book.<br>";
    }
    return errors;
}

// donation submit function
const donationSubmitButton=()=>{
    console.log(donation);
    let formErrors = checkDonationFormErrors();
    if (formErrors === "") {
        // form has not any errors
        Swal.fire({
            title: "Confirm Save",
            html: `<p>Are you sure to save this Donation record?</p>`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ff0000ff",
            cancelButtonColor: "rgb(0, 102, 255)",
            confirmButtonText: "Yes, Save",
            cancelButtonText: "Cancel",
            reverseButtons: true,

        }).then((result) => {
            if (result.isConfirmed) {

                // call post service
                let postServiceResponse = getHttpServiceRequest("/donation/insert", "POST", donation);

                if (postServiceResponse == "OK") {
                    // save successs
                    Swal.fire({
                        title: "Saved!",
                        text: "Donation record saved successfully.",
                        icon: 'success',

                    });
                    refreshDonationTable();
                    refreshDonationForm();
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
                        html: `<p>Donation record could not be saved.</p>
                <p>Details: ${postServiceResponse}</p>`,
                        confirmButtonText: 'OK'
                    });

                }
            } else {
                //get user confirm for form discard
                // can get user confrimation for form refresh
                Swal.fire({
                    title: "Confirm Refresh",
                    text: "Do you need to refresh donation form ?",
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

// check donation form updates
const checkDonationFormUpdates=()=>{
    let updates="";
    if(donation!= null && oldDonation!= null){
        if(donation.donator_id.name != oldDonation.donator_id.name){
            updates+="Donator is changed "+
                oldDonation.donator_id.name+" into "+
                donation.donator_id.name+
                ".<br>"
        }
        if(donation.valueofdonation != oldDonation.valueofdonation){
            updates+="Total Amount is changed "+
                oldDonation.valueofdonation+" into "+
                donation.valueofdonation+
                ".<br>"
        }
        if(donation.purpose != oldDonation.purpose){
            updates+="Purpose is changed "+
                oldDonation.purpose+" into "+
                donation.purpose+
                ".<br>"
        }
        if(donation.donationstatus_id.name != oldDonation.donationstatus_id.name){
            updates+="Donation Status is changed "+
                oldDonation.donationstatus_id.name+" into "+
                donation.donationstatus_id.name+
                ".<br>"
        }

        if(donation.note != oldDonation.note){
            updates+="Note is changed "+
                oldDonation.note+" into "+
                donation.note+
                ".<br>"
        }
        if (JSON.stringify(donation.donationHasBookList) !== JSON.stringify(oldDonation.donationHasBookList)) {
            updates += "Books are changed.<br>";
        }
    }return updates;
}

// update donation form function
const donationUpdateButton=()=>{
// need to check  all required feild with valid value
    let formErrors = checkDonationFormErrors();
    if (formErrors == "") {
        let formUpdates = checkDonationFormUpdates();
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
                html: `<p>Are you sure to update this donation record?</p>
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
                    let updateServiceResponse = getHttpServiceRequest("/donation/update", "PUT", donation);


                    if (updateServiceResponse == "OK") {
                        //user confrim update
                        Swal.fire({
                            title: "Updated!",
                            text: "Donation record updated successfully.",
                            icon: 'success',

                        });
                        //refresh form and table
                        refreshDonationTable();
                        refreshDonationForm();

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
                            html: `<p>Donation record could not be updated.</p>
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
    donationBook= new Object();

    // let books=ajaxGetrequest("/book/list")
    // fillDataIntoSelect(
    //     selectBookElement,
    //     "Please Select Book",
    //     books,
    //     "title"
    // )
    filterBooks();

    textQuantityElement.value= "";
    // textPurchasePriceElement.disabled=true;

    setInitial([
        selectBookElement,
        textQuantityElement,
    ])


    // refrsh table area= fill table
    let innerColumns = [
        { propertyName: getInnerBook, dataType: "function" },
        { propertyName: "quantity", dataType: "string" },
    ];

    fillDataIntoInnerTable(
        tableBodyDonationItems,
        donation.donationHasBookList,
        innerColumns,
        editDonationItemForm,
        deleteDonationItem
    )

    buttonUpdateInnerForm.classList.add("d-none");
    buttonSubmitInnerForm.classList.remove("d-none");
}

// get book title for inner table
const getInnerBook=(dataOb)=>{
    return dataOb.book_id.title;
}

// edit book form table
const editDonationItemForm=(dataOb)=>{
    buttonUpdateInnerForm.classList.remove("d-none");
    buttonSubmitInnerForm.classList.add("d-none");

    donationBook= JSON.parse(JSON.stringify(dataOb));
    oldDonationBook= JSON.parse(JSON.stringify(dataOb));


    let books=[];
    books.push(donationBook.book_id);
    fillDataIntoSelect(selectBookElement,"Please Select Book",books,"title")
    selectBookElement.value= JSON.stringify(donationBook.book_id) ;
    selectBookElement.disabled="disabled";

    textQuantityElement.value= dataOb.quantity;
}

// delete book from table
const deleteDonationItem=(dataOb)=>{

    Swal.fire({
        title: "Confirm Remove",
        html: `<p>Are you sure to remove Inner Book?</p>`,
        icon: "warning",
        confirmButtonColor: "#ff0000ff",
        confirmButtonText: "Yes, Remove",

    }).then((result) => {
        if (result.isConfirmed) {
            let extIndex= donation.donationHasBookList.map(pobook=>pobook.book_id.id).indexOf(dataOb.book_id.id)
            if(extIndex>-1){
                donation.donationHasBookList.splice(extIndex,1);
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
const checkDonationItemErrors=()=>{
    let errors="";
    if(donationBook.book_id==null){
        errors += "Please Select Book.<br>";
        selectBookElement.style.borderBottom="2px solid pink";
    }
    if(donationBook.quantity==null){
        errors += "Please Enter Quantity.<br>";
        textQuantityElement.style.borderBottom="2px solid pink";
    }
    return errors;
}

// submit inner form function
const donationItemSubmit=()=>{
    console.log(donationBook);
    let errors = checkDonationItemErrors();
    if (errors === "") {
        // form has not any errors
        Swal.fire({
            title: "Confirm Save",
            html: `<p>Are you sure to add Inner Book?</p>`,
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
                donation.donationHasBookList.push(donationBook);

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

// check inner form updates
const checkDonationItemUpdates=()=>{
    //purchase price ?
    // only quantity
    let updates="";
    if(donationBook!= null && oldDonationBook!=null){
        if(donationBook.price!=oldDonationBook.price){
            updates+="Price is changed " +
                oldDonationBook.price+" into "+
                donationBook.price+
                ".<br>"
        }
        if(donationBook.quantity!=oldDonationBook.quantity){
            updates+="Quantity is changed " +
                oldDonationBook.quantity+" into "+
                donationBook.quantity+
                ".<br>"
        }
        if(donationBook.lineprice!=oldDonationBook.lineprice){
            updates+="Line Price is changed " +
                oldDonationBook.lineprice+" into "+
                donationBook.lineprice+
                ".<br>"
        }
    }
    return updates;
}

// update inner form function
const donationItemUpdate=()=>{
    console.log(donationBook);
    let errors = checkDonationItemErrors();
    if (errors === "") {
        let updates= checkDonationItemUpdates();
        if(updates===""){
            //no updates
            Swal.fire({
                title: 'Update Failed',
                text: "Form has not any changes to update.",
                confirmButtonText: 'OK'
            });
        }else{
            // form has not any errors
            Swal.fire({
                title: "Confirm Update",
                html: `<p>Are you sure to update this Book?</p>`,
                icon: "warning",
                confirmButtonColor: "#ff0000ff",
                cancelButtonColor: "rgb(0, 102, 255)",
                confirmButtonText: "Yes, Update",
                cancelButtonText: "Cancel",
                reverseButtons: true,

            }).then((result) => {
                if (result.isConfirmed) {
                    let extIndex= donation.donationHasBookList.map(pobook=>pobook.book_id.id).indexOf(donationBook.book_id.id);
                    if(extIndex>-1){
                        donation.donationHasBookList[extIndex].price= donationBook.price;
                        donation.donationHasBookList[extIndex].quantity= donationBook.quantity;
                        donation.donationHasBookList[extIndex].lineprice= donationBook.lineprice;
                    }
                    Swal.fire({
                        title: "Updated!",
                        text: "Book Updated successfully.",
                        icon: 'success',

                    });
                    refreshInnerFormAndTable();
                }
            })
        }
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

// define function for filter item for supplier
const filterBooks=()=>{
    let allbooks= ajaxGetrequest("/book/list");

    const allBooks= allbooks; // {id:1, code: 000001},{}
    const bookWithoutSelected= donation.donationHasBookList; // {item_id:{id:1, code: 000001}, price:}

    const bookWithoutSelectedIds= new Set(bookWithoutSelected.map(book =>book.book_id.id));
    const filteredArray= allBooks.filter(book1=> !bookWithoutSelectedIds.has(book1.id))

    if(donation.donationHasBookList.length>0){
        fillDataIntoSelect(selectBookElement,"Please Select Book",filteredArray,"title")
    }else{
        fillDataIntoSelect(selectBookElement,"Please Select Book",allBooks,"title")
    }

    // fillDataIntoSelect(selectBookElement,"Please Select Book",booksBySupplier,"title")
    selectBookElement.disabled=false;
}

///////Add New Book////////

resourceType.addEventListener("change", () => {
    const selectedData = JSON.parse(selectResourceType.value);
    if (selectedData.name === "Book") {

        // author requied for book
        authorelement.required = true;
        starAuthorRequiredElement.style.display = "block";

        // isbn required for book
        isbnInputAreaElement.required = true;
        isbnInputAreaElement.style.display = "block";
        starISBNRequiredElement.style.display = "block";

        // issn hide
        issnInputAreaElement.required = false;
        issnInputAreaElement.style.display = "none";
        starISSNRequiredElement.style.display = "none";

        // started year and frequency row hide for book
        startedyearAndFrequencyRow.style.display = "none";

        // volume and issue no row hide for book
        volumeandIssueNoRow.style.display = "none";

        // show edition and edition year row for book
        editonAndEditionYearRow.style.display = "flex";

        // show series and series no row for book
        seriesAndSeriesNoRow.style.display = "flex";

        // show author column and hide publication date
        authorColumnElement.style.display = "block";
        publicationDateColumnElement.style.display = "none";

        // hide newspaper edition and frequency row
        newsPaperEditionandDrequencyRow.style.display = "none";

        // Show ddc And CallNo Row
        ddcNoElement.required = true;
        calNoElement.required = true;
        ddcAndCallNoRow.style.display = "flex";

    }
    if (selectedData.name === "Reference Material") {

        // same as book -- only change is author not required

        // isbn required for Reference Material
        isbnInputAreaElement.required = true;
        isbnInputAreaElement.style.display = "block";
        starISBNRequiredElement.style.display = "block";

        // issn hide
        issnInputAreaElement.required = false;
        issnInputAreaElement.style.display = "none";
        starISSNRequiredElement.style.display = "none";

        // started year and frequency row hide for book
        startedyearAndFrequencyRow.style.display = "none";

        // volume and issue no row hide for book
        volumeandIssueNoRow.style.display = "none";

        // show edition and edition year row for book
        editonAndEditionYearRow.style.display = "flex";

        // show series and series no row for book
        seriesAndSeriesNoRow.style.display = "flex";

        // show author column and hide publication date
        authorColumnElement.style.display = "block";
        publicationDateColumnElement.style.display = "none";

        // hide newspaper edition and frequency row
        newsPaperEditionandDrequencyRow.style.display = "none";

        // Show ddc And CallNo Row
        ddcNoElement.required = true;
        calNoElement.required = true;
        ddcAndCallNoRow.style.display = "flex";

    }
    if (selectedData.name === "Newspaper") {

        // isbn not required and hide
        isbnInputAreaElement.required = false;
        isbnInputAreaElement.style.display = "none";
        starISBNRequiredElement.style.display = "none";

        // issn show and required
        issnInputAreaElement.required = true;
        issnInputAreaElement.style.display = "block";
        starISSNRequiredElement.style.display = "block";

        //edition and edition year row hide
        editonAndEditionYearRow.style.display = "none";
        //series and series no row hide
        seriesAndSeriesNoRow.style.display = "none";

        //ddc and call no is not required
        ddcNoElement.required = false;
        calNoElement.required = false;
        ddcAndCallNoRow.style.display = "none";

        // started year and frequency row hide
        startedyearAndFrequencyRow.style.display = "none";

        // volume and issue no row hide
        volumeandIssueNoRow.style.display = "none";

        // show newspaper edition and frequency row .. and both required for newspaper
        newsPaperEditionandDrequencyRow.style.display = "flex";
        selectNewsPaperFrequency.required = true;
        selectNewsPaperEdition.required = true;

        // author not required and hide... show publication date required
        authorelement.required = false;
        authorColumnElement.style.display = "none";
        publicationDateElement.required = true;
        publicationDateColumnElement.style.display = "block";

        // hide ddc And CallNo Row


    }
    if (selectedData.name === "Magazine") {

        //author is not required and hide.. show publication date and required
        authorelement.required = false;
        authorColumnElement.style.display = "none";
        publicationDateElement.required = true;
        publicationDateColumnElement.style.display = "block";

        // isbn not required and hide
        isbnInputAreaElement.required = false;
        isbnInputAreaElement.style.display = "none";
        starISBNRequiredElement.style.display = "none";

        // issn sho and required
        issnInputAreaElement.required = true;
        issnInputAreaElement.style.display = "block";
        starISSNRequiredElement.style.display = "block";


        //edition and edition year row hide
        editonAndEditionYearRow.style.display = "none";
        //series and series no row hide
        seriesAndSeriesNoRow.style.display = "none";

        // started year and frequency row show
        startedyearAndFrequencyRow.style.display = "flex";

        // journal frequency column hide
        journalFrequencyColumn.style.display = "none";

        // magazine frequency column show and required
        magazineFrequencyColumn.style.display = "block";
        selectMagazineFrequency.required = true;

        // show volume and issue no row
        volumeandIssueNoRow.style.display = "flex";

        // hide newspaper edition and frequency row
        newsPaperEditionandDrequencyRow.style.display = "none";

        // Show ddc And CallNo Row
        ddcNoElement.required = true;
        calNoElement.required = true;
        ddcAndCallNoRow.style.display = "flex";

    }
    if (selectedData.name === "Journal") {
        //author is not required and hide.. show publication date and required
        authorelement.required = false;
        authorColumnElement.style.display = "none";
        publicationDateElement.required = true;
        publicationDateColumnElement.style.display = "block";

        // isbn not required and hide
        isbnInputAreaElement.required = false;
        isbnInputAreaElement.style.display = "none";
        starISBNRequiredElement.style.display = "none";

        // issn sho and required
        issnInputAreaElement.required = true;
        issnInputAreaElement.style.display = "block";
        starISSNRequiredElement.style.display = "block";

        //edition and edition year row hide
        editonAndEditionYearRow.style.display = "none";
        //series and series no row hide
        seriesAndSeriesNoRow.style.display = "none";

        // started year and frequency row show
        startedyearAndFrequencyRow.style.display = "flex";

        // journal frequency column show
        journalFrequencyColumn.style.display = "block";

        // magazine frequency column hide
        magazineFrequencyColumn.style.display = "none";

        // show volume and issue no row
        volumeandIssueNoRow.style.display = "flex";

        // hide newspaper edition and frequency row
        newsPaperEditionandDrequencyRow.style.display = "none";

        // Show ddc And CallNo Row
        ddcNoElement.required = true;
        calNoElement.required = true;
        ddcAndCallNoRow.style.display = "flex";
    }
})

const generateCallNo = () => {
    const selectedData = JSON.parse(selectResourceType.value);
    if (selectedData.name === "Book" || selectedData.name === "Magazine" || selectedData.name === "Journal") {
        let titleName = titleElement.value.substring(0, 3).toUpperCase();
        let authorName = authorelement.value.trim().split(" ").pop();
        const authorCode = authorName.substring(0, 3).toUpperCase();
        let ddcnoElement = ddcNoElement.value;
        book.callno = ddcnoElement + " " + authorCode + " " + titleName;
        calNoElement.value = book.callno;
        calNoElement.style.borderBottom = "2px solid lightgreen";
    }
    if (selectedData.name === "Reference Material") {
        let titleName = titleElement.value.substring(0, 3).toUpperCase();
        let authorName = authorelement.value.trim().split(" ").pop();
        const authorCode = authorName.substring(0, 3).toUpperCase();
        let ddcnoElement = ddcNoElement.value;
        book.callno = "REF " + ddcnoElement + " " + authorCode + " " + titleName;
        calNoElement.value = book.callno;
        calNoElement.style.borderBottom = "2px solid lightgreen";
    }
    if (selectedData.name === "Newspaper") {
        book.callno = null;
    }

}

const clearFile=()=>{
    imgCoverPhoto.src="/resources/images/bookdefault.png";
    book.coverimage= null;
}

// define function for refresh book form
refreshBookForm = () => {
    // reset form
    bookForm.reset();

    if (!userPrivi.privi_insert) {
        disableElement();
        buttonSubmit.classList.add("d-none");
        tabpaneForm.classList.remove('show', 'active');
        tabPillForm.classList.remove('show', 'active')
        tabPaneTable.classList.add('show', 'active');
        tabPillTable.classList.add('show', 'active')
    }
    // create empty object
    book = new Object();

    let resourceTypes = ajaxGetrequest("/resourcetype/alldata");
    let languages = ajaxGetrequest("/language/alldata");
    let displayCategories = ajaxGetrequest("displaycategory/alldata");
    let bookStatuses = ajaxGetrequest("bookstatus/alldata");
    let magazineFrequency = ajaxGetrequest("/magazinefrequency/alldata");
    let newspaperEdition = ajaxGetrequest("/newspaperedition/alldata");
    let newspaperFrequency = ajaxGetrequest("/newspaerfrequency/alldata");
    let journalFrequency = ajaxGetrequest("/journalfrequency/alldata");
    let authorNames= ajaxGetrequest("/book/authors");
    let publisherNames= ajaxGetrequest("/book/publishers");
    let series= ajaxGetrequest("/book/series")

    fillDataIntoSelect(selectResourceTypeElement, "Select Resource Type", resourceTypes, "name")
    fillDataIntoSelect(selectLanguageElement, "Select Language", languages, "name")
    fillDataIntoSelect(selectDisplayCategoryElement, "Select Display Category", displayCategories, "name")
    fillDataIntoSelect(selectBookStatusElement, "Select Book Status", bookStatuses, "name")
    fillDataIntoSelect(selectMagazineFrequency, "Select Magazine Frequency", magazineFrequency, "name")
    fillDataIntoSelect(selectNewsPaperEdition, "Select Newspaper Edition", newspaperEdition, "name");
    fillDataIntoSelect(selectNewsPaperFrequency, "Select Newspaper Frequency", newspaperFrequency, "name");
    fillDataIntoSelect(selectJournalFrequency, "Select Journal Frequency", journalFrequency, "name");
    fillDataIntoDataList(authorList , authorNames)
    fillDataIntoDataList(publisherList , publisherNames)
    fillDataIntoDataList(seriesList , series)

    // auto select status - fill default value for book status- Available
    //selectBookStatusElement.value= JSON.stringify(bookStatuses[0]);

    //set valid color
    //selectBookStatusElement.style.borderBottom="2px solid lightgreen";

    // binding to item object
    //book.bookstatus_id=bookStatuses[0];

    starAuthorRequiredElement.style.display = "none";
    issnInputAreaElement.style.display = "none";
    starISBNRequiredElement.style.display = "none";
    calNoElement.disabled = true;
    startedyearAndFrequencyRow.style.display = "none";
    volumeandIssueNoRow.style.display = "none";
    publicationDateColumnElement.style.display = "none";
    newsPaperEditionandDrequencyRow.style.display = "none";

    authorColumnElement.style.display = "block";
    editonAndEditionYearRow.style.display = "flex";
    isbnInputAreaElement.style.display = "block";
    seriesAndSeriesNoRow.style.display = "flex";

    setInitial([
        selectResourceType,
        textTitle,
        selectLanguage,
        textAuthor,
        datePublicationDate,
        textEdition,
        textEditionYear,
        textStartedYear,
        selectMagazineFrequency,
        selectJournalFrequency,
        selectNewsPaperEdition,
        selectNewsPaperFrequency,
        textVolume,
        textIssueNo,
        textPublisher,
        textIsbn,
        textIssn,
        textSeries,
        numberSeriesNo,
        textDdcNo,
        textCallNo,
        textPages,
        textDescription,
        selectDisplayCategory,
        //cover image
        selectBookStatus,
        textNote,
        numberInitialprice
    ])

    // auto select status - fill default value for book status- not Available
    selectBookStatusElement.value= JSON.stringify(bookStatuses[1]);
    //set valid color
    selectBookStatusElement.style.borderBottom="2px solid lightgreen";
    // binding to book object
    book.bookstatus_id=bookStatuses[1];
    selectBookStatusElement.disabled=true;
}

// function to check errors
const checkBookFormErrors = () => {
    let errors = "";
    if (book.resourcetype_id == null) {
        selectResourceType.style.borderBottom = "2px solid pink";
        errors += "Please Select Resource Type.<br>";
    }
    if (book.title == null) {
        textTitle.style.borderBottom = "2px solid pink";
        errors += "Please Enter Title.<br>";
    }
    if (book.language_id == null) {
        selectLanguage.style.borderBottom = "2px solid pink";
        errors += "Please Select Language.<br>";
    }
    if(book.displaycategory_id==null){
        selectDisplayCategory.style.borderBottom="2px solid pink";
        errors += "Please Select Display Category.<br>";
    }
    if (book.initialprice == null) {
        numberInitialprice.style.borderBottom = "2px solid pink";
        errors += "Please Enter Price.<br>";
    }
    if (book.publisher == null) {
        textPublisher.style.borderBottom = "2px solid pink";
        errors += "Please Enter Publisher.<br>";
    }
    if (book.pages == null) {
        textPages.style.borderBottom = "2px solid pink";
        errors += "Please Enter Pages.<br>";
    }

    if (book.bookstatus_id == null) {
        selectBookStatus.style.borderBottom = "2px solid pink";
        errors += "Please Select Book Status.<br>";
    }
    // author , ddc no , isbn is required for books and reference materials
    if (book.resourcetype_id.name === "Book" || book.resourcetype_id.name === "Reference Material") {
        if (book.author == null) {
            textAuthor.style.borderBottom = "2px solid pink";
            errors += "Please Enter Author Name.<br>";
        }
        if (book.ddcno == null) {
            textDdcNo.style.borderBottom = "2px solid pink";
            errors += "Please Enter DDC No.<br>";
        }
        if (book.isbn == null) {
            textIsbn.style.borderBottom = "2px solid pink";
            errors += "Please Enter ISBN.<br>";
        }

    }
    // magazine frequency , ddc no, publication date , issn is required to magazine
    if (book.resourcetype_id.name === "Magazine") {
        if (book.magazinefrequency_id == null) {
            selectMagazineFrequency.style.borderBottom = "2px solid pink";
            errors += "Please Enter Magazine Frequency.<br>";
        }
        if (book.ddcno == null) {
            textDdcNo.style.borderBottom = "2px solid pink";
            errors += "Please Enter DDC No.<br>";
        }
        if (book.publicationdate == null) {
            datePublicationDate.style.borderBottom = "2px solid pink";
            errors += "Please Enter Publication Date.<br>";
        }
        if (book.issn == null) {
            textIssn.style.borderBottom = "2px solid pink";
            errors += "Please Enter ISSN.<br>";
        }

    }
    // ddc no, publication date , issn is required to journal
    if (book.resourcetype_id.name === "Journal") {

        if (book.ddcno == null) {
            textDdcNo.style.borderBottom = "2px solid pink";
            errors += "Please Enter DDC No.<br>";
        }
        if (book.publicationdate == null) {
            datePublicationDate.style.borderBottom = "2px solid pink";
            errors += "Please Enter Publication Date.<br>";
        }
        if (book.issn == null) {
            textIssn.style.borderBottom = "2px solid pink";
            errors += "Please Enter ISSN.<br>";
        }

    }
    // publication date , newspaper edition, newspaper frequency , issn is required for newspaper
    if (book.resourcetype_id.name === "Newspaper") {
        if (book.publicationdate == null) {
            datePublicationDate.style.borderBottom = "2px solid pink";
            errors += "Please Enter Publication Date.<br>";
        }
        if (book.newspaperedition_id == null) {
            selectNewsPaperEdition.style.borderBottom = "2px solid pink";
            errors += "Please Select Newspaper Edition.<br>";
        }
        if (book.newspaperfrequency_id == null) {
            selectNewsPaperFrequency.style.borderBottom = "2px solid pink";
            errors += "Please Select NewsPaper Frequency.<br>";
        }
        if (book.issn == null) {
            textIssn.style.borderBottom = "2px solid pink";
            errors += "Please Enter ISSN.<br>";
        }

    }

    return errors;
}

// submit button function
const buttonBookSubmit = () => {
    console.log(book);

    // check form has valid value
    let formErrors = checkBookFormErrors();
    if (formErrors === "") {
        // form has not any errors
        Swal.fire({
            title: "Confirm Save",
            html: `<p>Are you sure to save this book record?</p>`,
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
                let postServiceResponse = getHttpServiceRequest("/book/insert", "POST", book);

                if (postServiceResponse == "OK") {
                    // save successs
                    Swal.fire({
                        title: "Saved!",
                        text: "Book record saved successfully.",
                        icon: 'success',

                    });
                    refreshBookForm();
                    // close modal
                    $("#modalAddNewBook").modal("hide");

                    let newBook= getHttpServiceRequest("/book/getlast");

                            let allbooks= getHttpServiceRequest("/book/alldata");
                            fillDataIntoSelect(selectBookElement,"Please Select Book", allbooks,"title");
                            selectBookElement.value= JSON.stringify(allbooks[allbooks.length-1]);
                            donationBook.book_id= allbooks[allbooks.length-1];
                            selectBookElement.style.borderBottom="2px solid lightgreen";
                            selectBookElement.disabled=true;
                            let addedBook= JSON.parse(selectBookElement.value);

                } else {
                    // save not completed
                    Swal.fire({
                        title: 'Save Failed',
                        html: `<p>Book record could not be saved.</p>
                <p>Details: ${postServiceResponse}</p>`,
                        confirmButtonText: 'OK'
                    });
                }
            } else {
                //get user confirm for form discard
                // can get user confrimation for form refresh
                Swal.fire({
                    title: "Confirm Refresh",
                    text: "Do you need to refresh book form ?",
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