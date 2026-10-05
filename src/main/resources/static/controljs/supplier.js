const tabpaneForm = document.getElementById("supplierTabPillForm");
const tabPaneTable = document.getElementById("supplierTabPillTable");
const tabPillForm = document.getElementById("supplierFormPill");
const tabPillTable = document.getElementById("supplierTablePill");
const selectCategoryElement = document.getElementById("selectCategory")
const selectSupplierStatusElement= document.getElementById("selectSupplierStatus")
let tableBody = document.querySelector("#tableBodySupplier")

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

// window load event
window.addEventListener("load", () => {
    // enable tooltip
    $('[data-bs-toggle="tooltip"]').tooltip();

    userPrivi = getHttpServiceRequest("/userprivilegebymodule?modulename=Supplier")

    // call supplier table refresh function
    refreshSupplierTable();
    // call supplier form refresh function
    refreshSupplierForm();
    // call bank details form refresh function
    refreshBankDetailsForm();
    // call book form refresh function
    refreshBookForm();

})

// function for disable elements in supplier form
const disableElement = () => {
    document.getElementById("textName").disabled = true;
    document.getElementById("textContactNo").disabled = true;
    document.getElementById("textBusinesRegistrationNo").disabled=true;
    document.getElementById("textContactPerson").disabled = true;
    document.getElementById("textContactPersonNo").disabled = true;
    document.getElementById("textAddress").disabled = true;
    document.getElementById("textEmail").disabled = true;
    document.getElementById("textWebsite").disabled = true;
    document.getElementById("selectSupplierStatus").disabled = true;
    document.getElementById("textSupplierNote").disabled = true;
    document.getElementById("btnAddNewBook").disabled = true;
    document.getElementById("selectCategory").disabled = true;
    document.getElementById("btnAddSingleBook").disabled = true;
    document.getElementById("btnAddAllBooks").disabled = true;
    document.getElementById("btnRemoveSingleBook").disabled = true;
    document.getElementById("btnRemoveAllBooks").disabled = true;
}

// function for disable elements in bank details form
const disableBankDetailsElement = () => {
    document.getElementById("textAccountHolderName").disabled = true;
    document.getElementById("textBankName").disabled = true;
    document.getElementById("textBranchName").disabled = true;
    document.getElementById("textAccountNo").disabled = true;
}

// define function for refresh supplier table
refreshSupplierTable = () => {

    // IF table is already DataTable THEN remove it THEN create new DataTable
    if ($.fn.DataTable.isDataTable('#tableSupplier')) {
        $('#tableSupplier').DataTable().destroy();
    }

    let suppliers = ajaxGetrequest("/supplier/alldata");

    let displayProperty = [
        {propertyName: "name", dataType: "string"},
        {propertyName: "contactno", dataType: "string"},
        {propertyName: "businessregistrationno", dataType: "string"},
        {propertyName: "contactpersonname", dataType: "string"},
        {propertyName: "contactpersoncontactno", dataType: "string"},
        {propertyName: "address", dataType: "string"},
        {propertyName: "email", dataType: "string"},
        {propertyName: getSupplierStatus, dataType: "function"},
    ];
    fillDataIntoTableEight(
        tableBody,
        suppliers,
        displayProperty,
        refillSupplierForm
    )
    buttonSupplierSubmit.classList.remove("d-none");
    buttonSupplierUpdate.classList.add("d-none");
    buttonSupplierPrint.classList.add("d-none");
    buttonSupplierDelete.classList.add("d-none");

    $("#tableSupplier").DataTable({
        responsive: true,
        autoWidth: false
    });
}

// define function for get supplier status
getSupplierStatus = (ob) => {
    if (ob.supplierstatus_id.name == "Active") {
        return '<i class="fa-solid fa-circle-check fa-lg me-1 " style="color:rgb(0, 189, 72);"></i>';
    }
    if (ob.supplierstatus_id.name == "Inactive") {
        return '<i class="fa-solid fa-circle-xmark fa-lg me-1 " style="color: #ff0000;"></i>';
    }
    if (ob.supplierstatus_id.name == "Blacklisted") {
        return '<i class="fa-solid fa-ban fa-lg me-1" style="color: #75001d;"></i>';
    }
    if (ob.supplierstatus_id.name == "Deleted") {
        return '<i class="fa-solid fa-trash fa-lg me-1" style="color: rgb(255, 0, 0);"></i>';
    }
}

// define function for refill supplier form and bank details form
const refillSupplierForm = (dataOb) => {

    setInitial([
        textName,
        textContactNo,
        textBusinesRegistrationNo,
        textContactPerson,
        textContactPersonNo,
        textAddress,
        textEmail,
        textWebsite,
        selectSupplierStatus,
        textSupplierNote,
        selectCategory,
        selectAllBooks,
        selectSelectedBooks,
        textAccountHolderName,
        textBankName,
        textBranchName,
        textAccountNo,

    ])

// shift to tab pane form
    tabpaneForm.classList.add('show', 'active');
    tabPaneTable.classList.remove('show', 'active');
    // shift to  form pill tab
    tabPillForm.classList.add('show', 'active');
    tabPillTable.classList.remove('show', 'active');

    supplier = dataOb;

    supplier = getHttpServiceRequest("/supplier/byid/" + dataOb.id);
    oldSupplier = getHttpServiceRequest("/supplier/byid/" + dataOb.id);

    textName.value = supplier.name;

    let mobileNoWithoutZero = supplier.contactno.substring(1);
    textContactNo.value = mobileNoWithoutZero;
    textBusinesRegistrationNo.value=supplier.businessregistrationno;


    if (supplier.contactpersonname != undefined || supplier.contactpersonname != null) {
        textContactPerson.value = supplier.contactpersonname;
    } else {
        textContactPerson.value = "";
    }

    if (supplier.contactpersoncontactno != undefined || supplier.contactpersoncontactno != null) {
        let mobileNoWithoutZero = supplier.contactpersoncontactno.substring(1);
        textContactPersonNo.value = mobileNoWithoutZero;
    } else {
        textContactPersonNo.value = "";
    }

    textAddress.value = supplier.address;

    textEmail.value = supplier.email;


    if (supplier.website != undefined || supplier.website != null) {
        textWebsite.value = supplier.website;
    } else {
        textWebsite.value = "";
    }

    selectSupplierStatus.value = JSON.stringify(supplier.supplierstatus_id);
    selectSupplierStatus.disabled=false;

    if (supplier.note != undefined || supplier.note != null) {
        textSupplierNote.value = supplier.note;
    } else {
        textSupplierNote.value = "";
    }


    if (supplier.accountholdername != undefined || supplier.accountholdername != null) {
        textAccountHolderName.value = supplier.accountholdername;
    } else {
        textAccountHolderName.value = "";
    }


    if (supplier.bankname != undefined || supplier.bankname != null) {
        textBankName.value = supplier.bankname;
    } else {
        textBankName.value = "";
    }


    if (supplier.branchname != undefined || supplier.branchname != null) {
        textBranchName.value = supplier.branchname;
    } else {
        textBranchName.value = "";
    }

    if (supplier.accountno != undefined || supplier.accountno != null) {
        textAccountNo.value = supplier.accountno;
    } else {
        textAccountNo.value = "";
    }

    allbooks = [];
    allbooks = getHttpServiceRequest("/book/listbysupplierwithoutsupplybook/" + supplier.id);

    allbooks.sort((a, b) => a.title.localeCompare(b.title));

    fillDataIntoSelect(selectAllBooks, '', allbooks, 'title')
    fillDataIntoSelect(selectSelectedBooks, '', supplier.books, 'title')

    if (!userPrivi.privi_update) {
        buttonSupplierUpdate.classList.add("d-none");
        buttonBankDetailsUpdate.classList.add("d-none");

    } else {
        buttonSupplierUpdate.classList.remove("d-none");
        buttonBankDetailsUpdate.classList.remove("d-none");
    }
    if (!userPrivi.privi_delete) {
        buttonSupplierDelete.classList.add("d-none");
    } else {
        buttonSupplierDelete.classList.remove("d-none");
    }

    // set button visibility
    // only showing update. submit space also not showing
    buttonSupplierSubmit.classList.add("d-none");
    buttonSupplierPrint.classList.remove("d-none");

//  hide submit button in  bank details
    buttonBankDetailsSubmit.classList.add("d-none");

}

// define function for supplier delete
const deleteSupplierRecord = (dataOb) => {
    //  confirmation
    supplier = getHttpServiceRequest("/supplier/byid/" + dataOb.id)
    Swal.fire({
        title: "Confirm Deletion",
        html: `<p>Are you sure to Delete this Supplier Record ?</p>
          <p>Supplier Name : <strong>${supplier.name || ''}</strong><br></p>
           <p>Supplier Conatct No : <strong>${supplier.contactno || ''}</strong><br></p>
           <p>Supplier Address : <strong>${supplier.address || ''}</strong></p>`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ff0000ff",
        cancelButtonColor: "rgb(0, 102, 255)",
        confirmButtonText: "Yes, Delete",
        cancelButtonText: "Cancel",
        reverseButtons: true

    }).then((result) => {
        if (result.isConfirmed) {
            let deleteServiceResponse = getHttpServiceRequest("/supplier/delete", "DELETE", dataOb)
            if (deleteServiceResponse == "OK") {
                Swal.fire({
                    title: "Deleted!",
                    text: "Supplier Record Deleted Successfully.",
                    icon: 'success',

                });

                //refresh table
                refreshSupplierTable();
                refreshSupplierForm();
                // shift to tab pane table
                tabpaneForm.classList.remove('show', 'active');
                tabPaneTable.classList.add('show', 'active');

                // shift to  table pill tab
                tabPillForm.classList.remove('show', 'active');
                tabPillTable.classList.add('show', 'active');
            } else {
                Swal.fire({
                    title: 'Deletion Failed',
                    html: `<p>Supplier record could not be deleted.</p>
                <p>Details: ${deleteServiceResponse}</p>`,
                    confirmButtonText: 'OK'
                });
            }
        } else {
            //refresh table
        }
    })
}

// define function for supplier print model opens
const printSupplierRecord = (dataOb) => {
    let supplierModal_view = new bootstrap.Modal(
        document.getElementById("modalSupplierView"),
        {}
    );
    supplierModal_view.show();
    supplier = ajaxGetrequest("/supplier/byid/" + dataOb.id);

    tdSupplierName.innerText = dataOb.name;
    tdSupplierContactNo.innerText = dataOb.contactno;
    tdBusinessRegistrationNo.innerText=dataOb.businessregistrationno;
    tdSupplierContactPersonName.innerText = dataOb.contactpersonname;
    tdSupplierContactPersonContactNo.innerText = dataOb.contactpersoncontactno;
    tdSupplierAddress.innerText = dataOb.address;
    tdSupplierEmail.innerText = dataOb.email;
    tdSupplierWebsite.innerText = dataOb.website;
    tdSupplierStatus.innerText = dataOb.supplierstatus_id.name;
    tdSupplierNote.innerText = dataOb.note;
    tdSupplierAccountHolderName.innerText = dataOb.accountholdername;
    tdSupplierBankName.innerText = dataOb.bankname;
    tdSupplierBranchName.innerText = dataOb.branchname;
    tdSupplierAccountNo.innerText = dataOb.accountno;
    tdsuppliedBooks.innerHTML="";
        let td = document.createElement("td");
        td.classList.add(colspan = 2);
        td.innerText = supplier.books
            .map(book => book.title)
            .join(", ");
        tdsuppliedBooks.appendChild(td);
}

// function for print supplier
const printSupplier = () => {
    let tab = window.open();
    tab.document.write('<html>'
        + '<head><title>Print Supplier Record</title>'
        + '<link rel="stylesheet" href="../resources/bootstrap-5.2.3/css/bootstrap.min.css"/>'
        + '</head>'
        + '<body>'
        + divCardPrintSupplier.outerHTML
        + '</body></html>');

    setInterval(() => {
        tab.stop();
        tab.print();
        tab.close();
    }, 700);
}

// define function for refresh supplier form
refreshSupplierForm = () => {

    supplierForm.reset();

    if (!userPrivi.privi_insert) {
        disableElement();
        buttonSupplierSubmit.classList.add("d-none");
        tabpaneForm.classList.remove('show', 'active');
        tabPillForm.classList.remove('show', 'active')
        tabPaneTable.classList.add('show', 'active');
        tabPillTable.classList.add('show', 'active')
    }

    supplier = new Object();
    supplier.books = new Array();

    allbooks = getHttpServiceRequest("/book/list");
    allbooks.sort((a, b) => a.title.localeCompare(b.title));

    supplierStatuses = getHttpServiceRequest("/supplierstatus/alldata");

    categories = getHttpServiceRequest("/displaycategory/alldata");

    fillDataIntoSelect(selectAllBooks, '', allbooks, 'title')
    fillDataIntoSelect(selectSelectedBooks, '', supplier.books, 'title')
    fillDataIntoSelect(selectSupplierStatusElement, "Select Supplier Status", supplierStatuses, 'name')
    fillDataIntoSelect(selectCategoryElement, "Select Book By Category", categories, "name");

    setInitial([
        textName,
        textContactNo,
        textBusinesRegistrationNo,
        textContactPerson,
        textContactPersonNo,
        textAddress,
        textEmail,
        textWebsite,
        selectSupplierStatus,
        textSupplierNote,
        selectCategory,
        selectAllBooks,
        selectSelectedBooks,
        textAccountHolderName,
        textBankName,
        textBranchName,
        textAccountNo,

    ])

    // auto select status - fill default value for supplier status- active
    selectSupplierStatusElement.value= JSON.stringify(supplierStatuses[0]);
    // binding to book object
    supplier.supplierstatus_id=supplierStatuses[0];
    selectSupplierStatusElement.disabled=true;
    //set valid color
    selectSupplierStatusElement.style.borderBottom="2px solid lightgreen";
}

//define function for refresh bank details form
refreshBankDetailsForm = () => {

    bankdetailsForm.reset();

    if (!userPrivi.privi_insert) {
        disableBankDetailsElement();
        buttonBankDetailsSubmit.classList.add("d-none");
    }

    setInitial([
        textAccountHolderName,
        textBankName,
        textBranchName,
        textAccountNo,

    ])
    buttonBankDetailsUpdate.classList.add("d-none");
}

// function for add single book
const addSingleBook = () => {
    if (selectAllBooks != "") {
        let selectedBook = JSON.parse(selectAllBooks.value);
        // add into selected side
        supplier.books.push(selectedBook);
        fillDataIntoSelect(selectSelectedBooks, '', supplier.books, 'title')

        // remove from all side
        let extIndex = allbooks.map(book => book.id).indexOf(selectedBook.id);
        if (extIndex > -1) {
            allbooks.splice(extIndex, 1);
            allbooks.sort((a, b) => a.title.localeCompare(b.title));
            fillDataIntoSelect(selectAllBooks, '', allbooks, 'title')
        }

    } else {
        alert("Please select book");
    }
}

// function for add all books
const addAllBooks = () => {
    allbooks.forEach(book => {
        // add into selected side
        supplier.books.push(book);
    })
    fillDataIntoSelect(selectSelectedBooks, '', supplier.books, 'title')

    allbooks = [];
    fillDataIntoSelect(selectAllBooks, '', allbooks, 'title')

}

// function for remove single book
const removeSingleBook = () => {
    if (selectSelectedBooks != "") {
        let selectedBook = JSON.parse(selectSelectedBooks.value);
        // add into all side
        allbooks.push(selectedBook);
        allbooks.sort((a, b) => a.title.localeCompare(b.title));
        fillDataIntoSelect(selectAllBooks, '', allbooks, 'title')

        // remove from selected side
        let extIndex = supplier.books.map(book => book.id).indexOf(selectedBook.id);
        if (extIndex > -1) {
            supplier.books.splice(extIndex, 1);
            fillDataIntoSelect(selectSelectedBooks, '', supplier.books, 'title')
        }

    } else {
        alert("Please select book");
    }
}

// function for remove all books
const removeAllBooks = () => {

    supplier.books.forEach(book => {
        // add into all side
        allbooks.push(book);
    })
    allbooks.sort((a, b) => a.title.localeCompare(b.title));
    fillDataIntoSelect(selectAllBooks, '', allbooks, 'title')

    supplier.books = [];
    fillDataIntoSelect(selectSelectedBooks, '', supplier.books, 'title')
}

// function for check errors in bank details form
const checkBankDetailsFormErrors = () => {
    let errors = "";

    if (supplier.accountholdername == null) {
        textAccountHolderName.style.borderBottom = "2px solid pink";
        errors += "Please Enter Account Holder Name.<br>";
    }

    if (supplier.bankname == null) {
        textBankName.style.borderBottom = "2px solid pink";
        errors += "Please Enter Bank Name.<br>";
    }

    if (supplier.branchname == null) {
        textBranchName.style.borderBottom = "2px solid pink";
        errors += "Please Enter Branch Name.<br>";
    }

    if (supplier.accountno == null) {
        textAccountNo.style.borderBottom = "2px solid pink";
        errors += "Please Enter Account No.<br>";
    }
    return errors;

}

// function for save bank details form
const bankDetailsSubmitButton = () => {
    // assign modal values to supplier
    supplier.accountholdername = textAccountHolderName.value || null;
    supplier.bankname = textBankName.value || null;
    supplier.branchname = textBranchName.value || null;
    supplier.accountno = textAccountNo.value || null;

    // validate
    let errors = checkBankDetailsFormErrors();
    if (errors === "") {
        // form has not any errors
        Swal.fire({
            title: "Confirm Save",
            html: `<p>Are you sure to save this supplier's bank details ?</p>`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ff0000ff",
            cancelButtonColor: "rgb(0, 102, 255)",
            confirmButtonText: "Yes, Save",
            cancelButtonText: "Cancel",
            reverseButtons: true

        }).then((result) => {
            if (result.isConfirmed) {
                //save success
                Swal.fire({
                    title: "Saved!",
                    text: "Bank Details saved successfully.",
                    icon: 'success',
                });
                refreshBankDetailsForm();

                // close modal
                $("#modalBankDetailsForm").modal("hide");
            } else {
                //get user confirm for form discard
                // can get user confrimation for form refresh
                Swal.fire({
                    title: "Confirm Refresh",
                    text: "Do you need to refresh bank details form ?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#ff0000ff",
                    cancelButtonColor: "rgb(0, 102, 255)",
                    confirmButtonText: "OK",
                    reverseButtons: true

                }).then((result) => {
                    if (result.isConfirmed) {
                        refreshBankDetailsForm();
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
                <p>${errors}</p>`,
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }

}

// function for check errors in supplier form
const checkSupplierFormErrors = () => {
    let errors = "";
    if (supplier.name == null) {
        textName.style.borderBottom = "2px solid pink";
        errors += "Please Enter Name.<br>";
    }
    if (supplier.contactno == null) {
        textContactNo.style.borderBottom = "2px solid pink";
        errors += "Please Enter Contact No.<br>";
    }
    if (supplier.businessregistrationno == null) {
        textBusinesRegistrationNo.style.borderBottom = "2px solid pink";
        errors += "Please Enter Business Registration No.<br>";
    }
    if (supplier.address == null) {
        textAddress.style.borderBottom = "2px solid pink";
        errors += "Please Enter Address.<br>";
    }
    if (supplier.email == null) {
        textEmail.style.borderBottom = "2px solid pink";
        errors += "Please Enter Email.<br>";
    }
    if (supplier.supplierstatus_id == null) {
        selectSupplierStatus.style.borderBottom = "2px solid pink";
        errors += "Please Select Supplier Status.<br>";
    }
    return errors;

}

// function for save supplier button
const supplierSubmitButton = () => {

    // check form has valid value
    let formErrors = checkSupplierFormErrors();
    if (formErrors === "") {
        // form has not any errors
        Swal.fire({
            title: "Confirm Save",
            html: `<p>Are you sure to save this supplier record?</p>`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ff0000ff",
            cancelButtonColor: "rgb(0, 102, 255)",
            confirmButtonText: "Yes, Save",
            cancelButtonText: "Cancel",
            reverseButtons: true

        }).then((result) => {
            if (result.isConfirmed) {
                let fullSupplierContactNo = "0" + textContactNo.value;
                supplier.contactno = fullSupplierContactNo;

                if (textContactPersonNo.value) {
                    supplier.contactpersoncontactno = "0" + textContactPersonNo.value;
                } else {
                    supplier.contactpersoncontactno = null;
                }

                console.log(supplier);

                // call post service
                let postServiceResponse = getHttpServiceRequest("/supplier/insert", "POST", supplier);

                if (postServiceResponse == "OK") {
                    // save successs
                    Swal.fire({
                        title: "Saved!",
                        text: "Supplier record saved successfully.",
                        icon: 'success',

                    });
                    refreshSupplierTable();
                    refreshSupplierForm()
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
                        html: `<p>Supplier record could not be saved.</p>
                <p>Details: ${postServiceResponse}</p>`,
                        confirmButtonText: 'OK'
                    });
                }
            } else {
                //get user confirm for form discard
                // can get user confrimation for form refresh
                Swal.fire({
                    title: "Confirm Refresh",
                    text: "Do you need to refresh supplier form ?",
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

// function for update bank details button
const bankDetailsUpdateButton = () => {

    // assign modal values to supplier
    supplier.accountholdername = textAccountHolderName.value;
    supplier.bankname = textBankName.value;
    supplier.branchname = textBranchName.value;
    supplier.accountno = textAccountNo.value;

    // validate
    let errors = checkBankDetailsFormErrors();
    if (errors === "") {
        // form has not any errors
        Swal.fire({
            title: "Confirm Update",
            html: `<p>Are you sure to update this supplier's bank details ?</p>`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ff0000ff",
            cancelButtonColor: "rgb(0, 102, 255)",
            confirmButtonText: "Yes, Update",
            cancelButtonText: "Cancel",
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                //save success
                Swal.fire({
                    title: "Updated!",
                    text: "Bank Details Updated temporarily. Please Click Update Button in Supplier Form to Update.",
                    icon: 'success',
                });
                refreshBankDetailsForm();

                // close modal
                $("#modalBankDetailsForm").modal("hide");
            }
        })
    } else {
        // form has errors
        // default / prdefined library / custom
        Swal.fire({
            title: 'Save Failed',
            html: `<p>Form has Following Errors.</p>
                <p>${errors}</p>`,
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
}

// function for check supplier form updates
const checkSupplierFormUpdates = () => {
    let updates = "";
    if (supplier != null && oldSupplier != null) {
        if (supplier.name != oldSupplier.name) {
            updates += "Name is changed " +
                oldSupplier.name + " into " +
                supplier.name +
                ".<br>";
        }
        if (supplier.contactno != oldSupplier.contactno) {
            updates += "Contact No is changed " +
                oldSupplier.contactno + " into " +
                supplier.contactno +
                ".<br>";
        }
        if (supplier.businessregistrationno != oldSupplier.businessregistrationno) {
            updates += "Business Registration No is changed " +
                oldSupplier.businessregistrationno + " into " +
                supplier.businessregistrationno +
                ".<br>";
        }
        if (supplier.contactpersonname != oldSupplier.contactpersonname) {
            updates += "Contact Person Name is changed " +
                oldSupplier.contactpersonname + " into " +
                supplier.contactpersonname +
                ".<br>";
        }

        if (supplier.contactpersoncontactno != oldSupplier.contactpersoncontactno) {
            updates += "Contact Person Contact No is changed " +
                oldSupplier.contactpersoncontactno + " into " +
                supplier.contactpersoncontactno +
                ".<br>";
        }
        if (supplier.address != oldSupplier.address) {
            updates += "Address is changed " +
                oldSupplier.address + " into " +
                supplier.address +
                ".<br>";
        }
        if (supplier.email != oldSupplier.email) {
            updates += "Email is changed " +
                oldSupplier.email + " into " +
                supplier.email +
                ".<br>";
        }
        if (supplier.website != oldSupplier.website) {
            updates += "Website is changed " +
                oldSupplier.website + " into " +
                supplier.website +
                ".<br>";
        }
        if (supplier.accountholdername != oldSupplier.accountholdername) {
            updates += "Account Holder is changed " +
                oldSupplier.accountholdername + " into " +
                supplier.accountholdername +
                ".<br>";
        }
        if (supplier.bankname != oldSupplier.bankname) {
            updates += "Bank Name is changed " +
                oldSupplier.bankname + " into " +
                supplier.bankname +
                ".<br>";
        }
        if (supplier.branchname != oldSupplier.branchname) {
            updates += "Branch Name is changed " +
                oldSupplier.branchname + " into " +
                supplier.branchname +
                ".<br>";
        }
        if (supplier.accountno != oldSupplier.accountno) {
            updates += "Account No is changed " +
                oldSupplier.accountno + " into " +
                supplier.accountno +
                ".<br>";
        }
        if (supplier.supplierstatus_id.name != oldSupplier.supplierstatus_id.name) {
            updates += "Supplier Status is changed " +
                oldSupplier.supplierstatus_id.name + " into " +
                supplier.supplierstatus_id.name +
                ".<br>";
        }
        if (supplier.note != oldSupplier.note) {
            updates += "Note is changed " +
                oldSupplier.note + " into " +
                supplier.note +
                ".<br>";
        }

        if (JSON.stringify(supplier.books) !== JSON.stringify(oldSupplier.books)) {
            updates += "Supplier Books are changed.<br>";
        }
    }
    return updates;
}

// function for update supplier button
const supplierUpdateButton = () => {
    let fullSupplierContactNo = "0" + textContactNo.value;
    supplier.contactno = fullSupplierContactNo;

    if (textContactPersonNo.value) {
        supplier.contactpersoncontactno = "0" + textContactPersonNo.value;
    } else {
        supplier.contactpersoncontactno = null;
    }

    // need to check  all required feild with valid value
    let formErrors = checkSupplierFormErrors();
    if (formErrors == "") {
        let formUpdates = checkSupplierFormUpdates();
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
                html: `<p>Are you sure to update this supplier record?</p>
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
                    let updateServiceResponse = getHttpServiceRequest("/supplier/update", "PUT", supplier);
                    if (updateServiceResponse == "OK") {
                        //user confrim update
                        Swal.fire({
                            title: "Updated!",
                            text: "Supplier record updated successfully.",
                            icon: 'success',

                        });
                        //refresh form and table
                        refreshSupplierTable();
                        refreshSupplierForm();
                        // shift to tab pill table
                        tabpaneForm.classList.remove('show', 'active');
                        tabPaneTable.classList.add('show', 'active');
                        // shift to  table pill tab
                        tabPillForm.classList.remove('show', 'active');
                        tabPillTable.classList.add('show', 'active');

                    } else {
                        // user cancel updates
                        Swal.fire({
                            title: 'Update Failed',
                            html: `<p>Supplier record could not be updated.</p>
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

const clearFile=()=>{
    imgCoverPhoto.src="/resources/images/bookdefault.png";
    book.coverimage= null;
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

                    if (supplier && supplier.id) {
                        allbooks = ajaxGetrequest("/book/listbysupplierwithoutsupplybook/" + supplier.id);
                    } else {
                        // load all books
                        allbooks = ajaxGetrequest("/book/list");
                    }
                    allbooks.sort((a, b) => a.title.localeCompare(b.title));
                    fillDataIntoSelect(selectAllBooks, '', allbooks, 'title');


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

// define function for filter books by category
// need to show books without the selected books for supplier
// remaining books shows in all books side
const filterBooksByCategory = () => {
    // check is a value selected
    if (!selectCategoryElement.value) {
        return;
    }
    // get all book according to categories
    let booksByCategory = ajaxGetrequest("/book/listbycategory/" + JSON.parse(selectCategoryElement.value).id);
    //remove already selected books
    // getting selected book ids
    const selecteBookIds = supplier.books.map(book => book.id);
    // filter selected books out
    allbooks = booksByCategory.filter(book => !selecteBookIds.includes(book.id));
    allbooks.sort((a, b) => a.title.localeCompare(b.title));
    fillDataIntoSelect(selectAllBooks, '', allbooks, 'title')
}
