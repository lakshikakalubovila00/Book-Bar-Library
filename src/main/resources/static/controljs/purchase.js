const tabpaneForm = document.getElementById("purchaseTabPillForm");
const tabPaneTable = document.getElementById("purchaseTabPillTable");
const tabPillForm = document.getElementById("purchaseFormPill");
const tabPillTable = document.getElementById("purchaseTablePill");

const tableBody= document.getElementById("tableBodyPurchase");
const selectSupplierElement= document.getElementById("selectSupplier");
const selectPurchaseOrderStatusElement= document.getElementById("selectPurchaseOrderStatus");
const tableBodyPurchaseItems= document.getElementById("tableBodyPurchaseItems");
const textTotalAmountElement= document.getElementById("textTotalAmount");
const textNotePurchaseElement= document.getElementById("textNotePurchase");

const  selectBookElement= document.getElementById("selectBook");
const textPurchasePriceElement= document.getElementById("textPurchasePrice");
const  textQuantityElement= document.getElementById("textQuantity");
const  textLinePriceElement= document.getElementById("textLinePrice");

const dateRequiredDateElement = document.getElementById("dateRequiredDate");

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


const suggestionList = document.getElementById("bookList");
const textSearchedName = document.getElementById("textSearchedName");

// window load function
window.addEventListener("load",()=>{
     // enable tooltip
  $('[data-bs-toggle="tooltip"]').tooltip();
    userPrivi=getHttpServiceRequest("/userprivilegebymodule?modulename=Purchase")

    //call table refresh function
    refreshPurchaseTable();
    //call form refresh function
    refreshPurchaseForm();

    refreshBookForm();

    refreshFindSupplierByBook()
})
const refreshFindSupplierByBook=()=>{
    let bookTitles= ajaxGetrequest("/book/titles");
    fillDataIntoDataList(suggestionList , bookTitles)
}

btnSearch.addEventListener("click", () => {
    fillSupplierInfo();
});
textSearchedName.addEventListener("keypress", (event) => {
    if(event.key === "Enter"){
        fillSupplierInfo();
    }
});
textSearchedName.addEventListener("input", () => {

    if(textSearchedName.value === ""){
        textBook.innerText = "";
        textSuppliers.innerText = "";
    }

});
const fillSupplierInfo=()=>{
    const searchText = textSearchedName.value;
    // filtering
    if(searchText !== ""){
        let suppliers= getHttpServiceRequest("/suppliers/bybook/"+ searchText)

        textBook.innerText=textSearchedName.value;

        if(suppliers.length > 0){

            let supplierList = suppliers.map(supplier => supplier.name).join(", ");

            textSuppliers.innerText = supplierList;

        }else{
            textSuppliers.innerText = "No supplier founded.";
        }
    }else{
        textBook.innerText= "";
        textSuppliers.innerText= "";
    }

}

const disableElement=()=>{
    selectSupplierElement.disabled= true;
    dateRequiredDateElement.disabled= true;
    // textTotalAmountElement.disabled= true;
    selectPurchaseOrderStatusElement.disabled= true;
    textNotePurchaseElement.disabled= true;
    selectBookElement.disabled= true;
    textPurchasePriceElement.disabled= true;
    textQuantityElement.disabled= true;
    // textLinePriceElement.disabled= true;

}

// refresh purchase table
const refreshPurchaseTable=()=>{

    // IF table is already DataTable THEN remove it THEN create new DataTable
    if ($.fn.DataTable.isDataTable('#tablePurchase')) {
        $('#tablePurchase').DataTable().destroy();
    }

    purchaseorders= new Array();
    purchaseorders= ajaxGetrequest("/purchase/alldata")
    // property array
    let displayProperty = [
        { propertyName: "purchaseordercode", dataType: "string" },
        { propertyName: getSupplier, dataType: "function" },
        { propertyName: "requireddate", dataType: "string" },
        { propertyName: getBooks, dataType: "function" },
        { propertyName: "totalamount", dataType: "string" },
        { propertyName: getStatus, dataType: "function" }
    ];
    fillDataIntoTableEight(
        tableBody,
        purchaseorders,
        displayProperty,
        refillPurchaseForm
    )
    buttonSubmitPurchase.classList.remove("d-none");
    buttonUpdatePurchase.classList.add("d-none");
    buttonPrintPurchase.classList.add("d-none");
    buttonDeletePurchase.classList.add("d-none");
    buttonSubmitInnerForm.classList.remove("d-none");
    buttonUpdateInnerForm.classList.add("d-none");


    $("#tablePurchase").DataTable({
        responsive: true,
        autoWidth: false
    });
}

// get supplier name
const getSupplier=(ob)=>{
    return ob.supplier_id.name;
}

// get book list
const getBooks=(ob)=>{
   if(!ob.purchaseHasBookList || ob.purchaseHasBookList.length===0){
       return "-";
   }
   let bookTitles= ob.purchaseHasBookList.map(pobook=>pobook.book_id.title);
   return bookTitles.join(", ");
}

// get purchase order status
const getStatus=(ob)=>{
    if (ob.purchasestatus_id.name == "Requested") {
        return '<i class="fa-solid fa-spinner fa-lg" style="color: rgb(255, 110, 0);"></i>';
    }
    if (ob.purchasestatus_id.name == "Received") {
        return '<i class="fa-solid fa-house-circle-check fa-lg" style="color: rgb(0, 194, 10);"></i>';
    }
    if (ob.purchasestatus_id.name == "Completed") {
        return '<i class="fa-solid fa-check fa-lg" style="color: rgb(99, 230, 190);"></i>'
    }
    if (ob.purchasestatus_id.name == "Cancelled") {
        return '<i class="fa-solid fa-ban fa-lg" style="color: rgb(194, 38, 0);"></i>';
    }
    if (ob.purchasestatus_id.name == "Deleted") {
        return '<i class="fa-solid fa-trash fa-lg" style="color: rgb(255, 0, 0);"></i>';
    }
}

// refill purchase form
const refillPurchaseForm=(dataOb)=>{
    setInitial([
        selectSupplierElement,
        dateRequiredDateElement,
        textTotalAmountElement,
        selectPurchaseOrderStatusElement,
        textNotePurchaseElement
    ])

    console.log(dataOb);

    // shift to tab pane form
    tabpaneForm.classList.add('show', 'active');
    tabPaneTable.classList.remove('show', 'active');
    // shift to  form pill tab
    tabPillForm.classList.add('show', 'active');
    tabPillTable.classList.remove('show', 'active');

    purchaseorder = ajaxGetrequest("/purchase/byid/"+ dataOb.id);
    oldPurchaseorder = ajaxGetrequest("/purchase/byid/"+ dataOb.id);

    selectSupplierElement.value= JSON.stringify(purchaseorder.supplier_id);
    selectPurchaseOrderStatusElement.value= JSON.stringify(purchaseorder.purchasestatus_id);
    selectPurchaseOrderStatusElement.disabled=false;
    dateRequiredDateElement.value= purchaseorder.requireddate;

    //note- optional
    if (purchaseorder.note != undefined || purchaseorder.note != null) {
        textNotePurchaseElement.value = purchaseorder.note;
    } else {
        textNotePurchaseElement.value = "";
    }
    refreshInnerFormAndTable();

    if(!userPrivi.privi_update){
        buttonUpdatePurchase.classList.add("d-none");
    }else {
        buttonUpdatePurchase.classList.remove("d-none");
    }
    if(!userPrivi.privi_delete){
        buttonDeletePurchase.classList.add("d-none");
    }else {
        buttonDeletePurchase.classList.remove("d-none");
    }

    // set button visibility
    // only showing update. submit space also not showing
    buttonSubmitPurchase.classList.add("d-none");
    // buttonSubmitInnerForm.classList.add("d-none");
    buttonPrintPurchase.classList.remove("d-none")

    // hide update button
    // buttonClearInnerForm

}

// delete function
const deletePurchaseRecord=(dataOb)=>{
    //  confirmation
    purchaseorder = getHttpServiceRequest("/purchase/byid/"+ dataOb.id)
    Swal.fire({
        title: "Confirm Deletion",
        html: `<p>Are you sure to Delete this Purchase order Record ?</p>
          <p>Purchase Order Code : <strong>${purchaseorder.purchaseordercode || ''}</strong><br></p>
           <p>Supplier : <strong>${purchaseorder.supplier_id.name || ''}</strong><br></p>
           <p>Purchase Order Status : <strong>${purchaseorder.purchasestatus_id.name || ''}</strong></p>`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ff0000ff",
        cancelButtonColor: "rgb(0, 102, 255)",
        confirmButtonText: "Yes, Delete",
        cancelButtonText: "Cancel",
        reverseButtons: true

    }).then((result) => {
        if (result.isConfirmed) {
            let deleteServiceResponse = getHttpServiceRequest("/purchase/delete", "DELETE", dataOb)
            if (deleteServiceResponse == "OK") {
                Swal.fire({
                    title: "Deleted!",
                    text: "Purchase Order Record Deleted Successfully.",
                    icon: 'success',

                });
                //refresh table
                refreshPurchaseTable();
                refreshPurchaseForm();

                // shift to tab pane table
                tabpaneForm.classList.remove('show', 'active');
                tabPaneTable.classList.add('show', 'active');

                // shift to  table pill tab
                tabPillForm.classList.remove('show', 'active');
                tabPillTable.classList.add('show', 'active');
            } else {
                Swal.fire({
                    title: 'Deletion Failed',
                    html: `<p>Purchase Order record could not be deleted.</p>
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
const printPurchaseRecord=(dataOb)=>{
    let purchaseOrderModal_view = new bootstrap.Modal(
        document.getElementById("modalPurchaseOrderView"),
        {}
    );
    purchaseOrderModal_view.show();
    purchaseorder= getHttpServiceRequest("/purchase/byid/"+ dataOb.id);
    tdPurchaseOrderCode.innerText= dataOb.purchaseordercode ;
    tdSupplier.innerText= dataOb.supplier_id.name ;
    tdRequiredDate.innerText= dataOb.requireddate ;
    tdTotalAmount.innerText= dataOb.totalamount ;
    tdPurchaseOrderStatus.innerText= dataOb.purchasestatus_id.name ;
    tdnote.innerText= dataOb.note ;

    // tdpurchaseBooks

    if(!dataOb.purchaseHasBookList || dataOb.purchaseHasBookList.length===0){
        return "-";
    }
    let bookTitles= dataOb.purchaseHasBookList.map(pobook=>pobook.book_id.title);
    tdpurchaseBooks.innerText=bookTitles.join(", ");
}

const printPurchaseOrder=()=>{
    let tab = window.open();
    tab.document.write('<html>'
        + '<head><title>Print Purchase Order Record</title>'
        + '<link rel="stylesheet" href="../resources/bootstrap-5.2.3/css/bootstrap.min.css"/>'
        + '</head>'
        + '<body>'
        + divCardPrintPurchaseOrder.outerHTML
        + '</body></html>');

    setInterval(() => {
        tab.stop();
        tab.print();
        tab.close();
    }, 700);
}

// refresh purchase form
const refreshPurchaseForm=()=>{

    // clean static element- only value- empty static element
    purchaseForm.reset();

    if(!userPrivi.privi_insert){
        disableElement();
        buttonSubmitPurchase.classList.add("d-none");
        buttonSubmitInnerForm.classList.add("d-none");
        tabpaneForm.classList.remove('show', 'active');
        tabPillForm.classList.remove('show','active')
        tabPaneTable.classList.add('show', 'active');
        tabPillTable.classList.add('show','active')
    }

    purchaseorder= new Object();
    purchaseorder.purchaseHasBookList= new Array();

    // set min and max value for required date
    //YYYY-MM-DD
    let minDate= new Date();
    let maxDate= new Date();
    maxDate.setDate(maxDate.getDate()+30);
    dateRequiredDateElement.min=getDateValue(minDate);
    dateRequiredDateElement.max=getDateValue(maxDate) ;

    // valid suppliers | nor deleted | not blacklisted ?
    let suppliers=ajaxGetrequest("/supplier/alldata")
    fillDataIntoSelect(
        selectSupplierElement,
        "Select Supplier",
        suppliers,
        "name"
    )

    let purchaseorderstatuses= ajaxGetrequest("/purchasestatus/alldata")
    fillDataIntoSelect(
    selectPurchaseOrderStatusElement,
        "Select Purchase Order Status",
        purchaseorderstatuses,
        "name"
    )

    refreshInnerFormAndTable();

    setInitial([
        selectSupplierElement,
        dateRequiredDateElement,
        textTotalAmountElement,
        selectPurchaseOrderStatusElement,
        textNotePurchaseElement,
    ])

    // auto select status - fill default value for po status- Requested
    selectPurchaseOrderStatusElement.value= JSON.stringify(purchaseorderstatuses[0]);
    // binding to book object
    purchaseorder.purchasestatus_id=purchaseorderstatuses[0];
    selectPurchaseOrderStatusElement.disabled=true;
    //set valid color
    selectPurchaseOrderStatusElement.style.borderBottom="2px solid lightgreen";
}

//check purchase form errors
const checkPurchaseFormErrors=()=>{
    let errors="";
    if(purchaseorder.supplier_id == null){
        errors+="Please Select Supplier.<br>";
        selectSupplierElement.style.borderBottom="2px solid pink"
    }
    if(purchaseorder.requireddate == null){
        errors+="Please Select Required Date.<br>";
        dateRequiredDateElement.style.borderBottom="2px solid pink"
    }
    if(purchaseorder.purchasestatus_id == null){
        errors+="Please Select Purchase Order Status.<br>";
        selectPurchaseOrderStatusElement.style.borderBottom="2px solid pink"
    }
    if(purchaseorder.purchaseHasBookList.length == 0){
        errors+="Please Select Book.<br>";
    }
    return errors;
}

// purchase submit function
const purchaseSubmitButton=()=>{
    console.log(purchaseorder);
    let formErrors = checkPurchaseFormErrors();
    if (formErrors === "") {
        // form has not any errors
        Swal.fire({
            title: "Confirm Save",
            html: `<p>Are you sure to save this Purchase Order record?</p>`,
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
                let postServiceResponse = getHttpServiceRequest("/purchase/insert", "POST", purchaseorder);

                if (postServiceResponse == "OK") {
                    // save successs
                    Swal.fire({
                        title: "Saved!",
                        text: "Purchase Order record saved successfully.",
                        icon: 'success',

                    });
                    refreshPurchaseTable();
                    refreshPurchaseForm();
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
                        html: `<p>Purchase Order record could not be saved.</p>
                <p>Details: ${postServiceResponse}</p>`,
                        confirmButtonText: 'OK'
                    });

                }
            } else {
                //get user confirm for form discard
                // can get user confrimation for form refresh
                Swal.fire({
                    title: "Confirm Refresh",
                    text: "Do you need to refresh purchase order form ?",
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

// check purchase form updates
const checkPurchaseFormUpdates=()=>{
    let updates="";
    if(purchaseorder!= null && oldPurchaseorder!= null){
        if(purchaseorder.supplier_id.name != oldPurchaseorder.supplier_id.name){
            updates+="Supplier is changed "+
                oldPurchaseorder.supplier_id.name+" into "+
                purchaseorder.supplier_id.name+
                ".<br>"
        }
        if(purchaseorder.requireddate != oldPurchaseorder.requireddate){
            updates+="Required Date is changed "+
                oldPurchaseorder.requireddate+" into "+
                purchaseorder.requireddate+
                ".<br>"
        }
        if(purchaseorder.totalamount != oldPurchaseorder.totalamount){
            updates+="Total Amount is changed "+
                oldPurchaseorder.totalamount+" into "+
                purchaseorder.totalamount+
                ".<br>"
        }
        if(purchaseorder.purchasestatus_id.name != oldPurchaseorder.purchasestatus_id.name){
            updates+="Purchase Status is changed "+
                oldPurchaseorder.purchasestatus_id.name+" into "+
                purchaseorder.purchasestatus_id.name+
                ".<br>"
        }

        if(purchaseorder.note != oldPurchaseorder.note){
            updates+="Note is changed "+
                oldPurchaseorder.note+" into "+
                purchaseorder.note+
                ".<br>"
        }
        if (JSON.stringify(purchaseorder.purchaseHasBookList) !== JSON.stringify(oldPurchaseorder.purchaseHasBookList)) {
            updates += "Books are changed.<br>";
        }
    }return updates;
}

// update purchase form function
const purchaseUpdateButton=()=>{
// need to check  all required feild with valid value
    let formErrors = checkPurchaseFormErrors();
    if (formErrors == "") {
        let formUpdates = checkPurchaseFormUpdates();
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
                html: `<p>Are you sure to update this purchase order record?</p>
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
                    let updateServiceResponse = getHttpServiceRequest("/purchase/update", "PUT", purchaseorder);


                    if (updateServiceResponse == "OK") {
                        //user confrim update
                        Swal.fire({
                            title: "Updated!",
                            text: "Purchase Order record updated successfully.",
                            icon: 'success',

                        });
                        //refresh form and table
                        refreshPurchaseTable();
                        refreshPurchaseForm();

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
                            html: `<p>Purchase order record could not be updated.</p>
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

selectBookElement.addEventListener("change", function () {
    if (this.value) {
        purchaseorderBook.book_id = JSON.parse(this.value);
        generatePurchasePrice();
        this.style.borderBottom = "2px solid lightgreen";
    } else {
        purchaseorderBook.book_id = null;
        this.style.borderBottom = "2px solid pink";
    }
});

// refresh inner form and table
const refreshInnerFormAndTable=()=>{

    // refresh form area
    purchaseorderBook= new Object();

    if(purchaseorder.supplier_id == null){
        let books= [];
        fillDataIntoSelect(selectBookElement,"Please Select Book",books,"title")
        selectBookElement.disabled=true;
    }else{
        filterBookBySupplier();
    }
    selectBookElement.value = "";

    textPurchasePriceElement.value= "";
    textQuantityElement.value= "";
    textLinePriceElement.value= "";

    textLinePriceElement.disabled=true;


    setInitial([
        selectBookElement,
        textPurchasePriceElement,
        textQuantityElement,
        textLinePriceElement
    ])


    // refrsh table area= fill table
    let innerColumns = [
        { propertyName: getInnerBook, dataType: "function" },
        { propertyName: "purchaseprice", dataType: "string" },
        { propertyName: "quantity", dataType: "string" },
        { propertyName: "lineprice", dataType: "string" }
    ];

    fillDataIntoInnerTable(
        tableBodyPurchaseItems,
        purchaseorder.purchaseHasBookList,
        innerColumns,
        editPurchaseItemForm,
        deletePurchaseItem
    )

    let totalAmout=0;
    for (const pobook of purchaseorder.purchaseHasBookList){
    totalAmout= totalAmout+ parseFloat(pobook.lineprice);
    }
     textTotalAmountElement.value=totalAmout.toFixed(2);
    purchaseorder.totalamount= totalAmout;
    textTotalAmountElement.style.borderBottom="2px solid lightgreen"

    buttonUpdateInnerForm.classList.add("d-none");
    buttonSubmitInnerForm.classList.remove("d-none");

}

// get book title for inner table
const getInnerBook=(dataOb)=>{
    return dataOb.book_id.title;
}
// edit book form table
const editPurchaseItemForm=(dataOb)=>{
    buttonUpdateInnerForm.classList.remove("d-none");
    buttonSubmitInnerForm.classList.add("d-none");

    purchaseorderBook= JSON.parse(JSON.stringify(dataOb));
    oldPurchaseorderBook= JSON.parse(JSON.stringify(dataOb));

    //filterBookBySupplier();
    let books=[];
    books.push(purchaseorderBook.book_id);
    fillDataIntoSelect(selectBookElement,"Please Select Book",books,"title")
   selectBookElement.value= JSON.stringify(purchaseorderBook.book_id) ;

    // Select correct option by comparing ID
    // for (let option of selectBookElement.options) {
    //
    //     if (option.value !== "") {
    //
    //         let optionObject = JSON.parse(option.value);
    //
    //         if (optionObject.id === purchaseorderBook.book_id.id) {
    //             option.selected = true;
    //             break;
    //         }
    //     }
    // }
    selectBookElement.disabled="disabled";

    textPurchasePriceElement.value= dataOb.purchaseprice  ;
    textQuantityElement.value= dataOb.quantity  ;
    textLinePriceElement.value= dataOb.lineprice  ;


}

// delete book from table
const deletePurchaseItem=(dataOb)=>{

Swal.fire({
    title: "Confirm Remove",
    html: `<p>Are you sure to remove Inner Book?</p>`,
    icon: "warning",
    confirmButtonColor: "#ff0000ff",
    confirmButtonText: "Yes, Remove",

}).then((result) => {
    if (result.isConfirmed) {
        let extIndex= purchaseorder.purchaseHasBookList.map(pobook=>pobook.book_id.id).indexOf(dataOb.book_id.id)
        if(extIndex>-1){
            purchaseorder.purchaseHasBookList.splice(extIndex,1);
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
const checkPurchaseOrderItemErrors=()=>{
    let errors="";
    if(purchaseorderBook.book_id==null){
        errors += "Please Select Book.<br>";
        selectBookElement.style.borderBottom="2px solid pink";
    }
    // auto book price
    // if(purchaseorderBook.purchaseprice==null){
    //     errors += "Please Enter Purchase Price.<br>";
    //     textPurchasePriceElement.style.borderBottom="2px solid pink";
    // }
    if(purchaseorderBook.quantity==null){
        errors += "Please Enter Quantity.<br>";
        textQuantityElement.style.borderBottom="2px solid pink";
    }
    return errors;
}

// submit inner form function
const purchaseOrderItemSubmit=()=>{
    console.log(purchaseorderBook);
    let errors = checkPurchaseOrderItemErrors();
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
                purchaseorder.purchaseHasBookList.push(purchaseorderBook);

                refreshInnerFormAndTable();
                filterBookBySupplier();
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
const checkPurchaseOrderItemUpdates=()=>{
    //purchase price ?
    // only quantity
    let updates="";
    if(purchaseorderBook!= null && oldPurchaseorderBook!=null){
        if(purchaseorderBook.purchaseprice!=oldPurchaseorderBook.purchaseprice){
            updates+="Purchase Price is changed " +
                oldPurchaseorderBook.purchaseprice+" into "+
                purchaseorderBook.purchaseprice+
                ".<br>"
        }
        if(purchaseorderBook.quantity!=oldPurchaseorderBook.quantity){
            updates+="Quantity is changed " +
                oldPurchaseorderBook.quantity+" into "+
                purchaseorderBook.quantity+
                ".<br>"
        }
    }
    return updates;
}

// update inner form function
const purchaseOrderItemUpdate=()=>{
    console.log(purchaseorderBook);
    let errors = checkPurchaseOrderItemErrors();
    if (errors === "") {
        let updates= checkPurchaseOrderItemUpdates();
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
                    let extIndex= purchaseorder.purchaseHasBookList.map(pobook=>pobook.book_id.id).indexOf(purchaseorderBook.book_id.id);
                    if(extIndex>-1){
                       purchaseorder.purchaseHasBookList[extIndex].quantity= purchaseorderBook.quantity;
                       purchaseorder.purchaseHasBookList[extIndex].lineprice= purchaseorderBook.lineprice;
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
const filterBookBySupplier=()=>{
    let supplier = JSON.parse(selectSupplierElement.value);
    let booksBySupplier= ajaxGetrequest("/book/bysupplier/"+supplier.id);

    const supplierAllBooks= booksBySupplier; // {id:1, code: 000001},{}
    const supplierBookWithoutSelected= purchaseorder.purchaseHasBookList; // {item_id:{id:1, code: 000001}, purchaseprice:}

   const supplierBookWithoutSelectedIds= new Set(supplierBookWithoutSelected.map(book =>book.book_id.id));
    const filteredArray= supplierAllBooks.filter(book1=> !supplierBookWithoutSelectedIds.has(book1.id))

    if(filteredArray.length === 0){
        fillDataIntoSelect(selectBookElement,"No more books available",[], "title");
        selectBookElement.disabled = true;
    }else{
        fillDataIntoSelect(selectBookElement,"Please Select Book",filteredArray,"title");
        selectBookElement.disabled = false;
    }

    // fillDataIntoSelect(selectBookElement,"Please Select Book",booksBySupplier,"title")
   // selectBookElement.disabled=false;
}

// define function for generate purchase price
const generatePurchasePrice=()=>{
    let book= JSON.parse(selectBookElement.value);

    if(purchaseorder.purchaseHasBookList.length>0){
        let extIndex= purchaseorder.purchaseHasBookList.map(pobook=>pobook.book_id.id).indexOf(book.id);
        if(extIndex>-1){
            Swal.fire({
                html: `<p>Selected Book Already Exists. Do you need to continue ?</p>`,
                icon: "warning",
                confirmButtonColor: "#ff0000ff",
                cancelButtonColor: "rgb(0, 102, 255)",
                cancelButtonText: "No",
                confirmButtonText: "Yes",
                reverseButtons: true,

            }).then((result)=>{
                if(result.isConfirmed){
                    //  increase quantity
                    let existingBook = purchaseorder.purchaseHasBookList[extIndex];

                    existingBook.quantity =
                        parseFloat(existingBook.quantity || 0) +
                        parseFloat(purchaseorderBook.quantity || 0);

                    existingBook.lineprice =
                        (parseFloat(existingBook.purchaseprice) *
                            parseFloat(existingBook.quantity)).toFixed(2);

                    refreshInnerFormAndTable();

                    Swal.fire({
                        title: "Updated!",
                        text: "Quantity increased for existing book.",
                        icon: "success"
                    });
                }
            });
            return;

        }
        // else{
        //     filterBookBySupplier();
        // }

    }
    let bookObject= ajaxGetrequest("/book/byid/"+book.id)

    if(bookObject){
        textPurchasePriceElement.value= parseFloat(bookObject.updatedprice).toFixed(2)
        purchaseorderBook.purchaseprice= textPurchasePriceElement.value;
        textPurchasePriceElement.style.borderBottom="2px solid lightgreen";
        textPurchasePriceElement.disabled=true;
    }

    // if(bookObject.bookstatus_id.name=="Available"){
    //     let lastBookCopy= ajaxGetrequest("/lastpurchasedbookcopy/bybook/"+book.id);
    //     if(lastBookCopy){
    //         // only from purchased book copies (not from donations )
    //         textPurchasePriceElement.value= parseFloat(lastBookCopy.price).toFixed(2);
    //     }else{
    //         // no purchased book copies (only have donation book copies)
    //         textPurchasePriceElement.value= parseFloat(bookObject.initialprice).toFixed(2)
    //     }
    //     purchaseorderBook.purchaseprice= textPurchasePriceElement.value;
    //     textPurchasePriceElement.style.borderBottom="2px solid lightgreen";
    //     textPurchasePriceElement.disabled=false;
    // }
    // if(bookObject.bookstatus_id.name=="Not-Available"){
    //     textPurchasePriceElement.value= parseFloat(bookObject.initialprice).toFixed(2)
    //     purchaseorderBook.purchaseprice= textPurchasePriceElement.value;
    //     textPurchasePriceElement.style.borderBottom="2px solid lightgreen";
    //     textPurchasePriceElement.disabled=false;
    // }
}

// define function for generate line price
const generateLinePrice=()=>{
    let purchasePrice = parseFloat(textPurchasePriceElement.value);
    if(purchaseorderBook.quantity != null){
       let quantity=  parseFloat(textQuantityElement.value);
        textLinePriceElement.value= (purchasePrice* quantity).toFixed(2);
        purchaseorderBook.lineprice= textLinePriceElement.value;
        textLinePriceElement.style.borderBottom="2px solid lightgreen ";

    }else{
        textLinePriceElement.value= "";
        purchaseorderBook.lineprice= null;
        setInitial([
            textLinePriceElement
        ])
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
                    let supplier = JSON.parse(selectSupplierElement.value);
                    if(supplier && supplier.id){
                        // Add new book to supplier object
                        supplier.books = supplier.books ? supplier.books : [];
                        supplier.books.push(newBook);
                        //SAVE supplier again to update supplier_has_book table
                        let updateResponse = getHttpServiceRequest("/supplier/update", "PUT", supplier);
                        if (updateResponse === "OK") {

                            //reload books by supplier

                            let booksBySupplier= getHttpServiceRequest("/book/bysupplier/"+supplier.id);
                            fillDataIntoSelect(selectBookElement,"Please Select Book", booksBySupplier,"title");
                            selectBookElement.value= JSON.stringify(booksBySupplier[booksBySupplier.length-1]);
                            purchaseorderBook.book_id= booksBySupplier[booksBySupplier.length-1];
                            selectBookElement.style.borderBottom="2px solid lightgreen";
                            selectBookElement.disabled=true;

                            let addedBook= JSON.parse(selectBookElement.value);

                            textPurchasePriceElement.value= parseFloat(addedBook.updatedprice).toFixed(2)
                            purchaseorderBook.purchaseprice= textPurchasePriceElement.value;
                            textPurchasePriceElement.style.borderBottom="2px solid lightgreen";
                            textPurchasePriceElement.disabled=true;

                        } else {
                            Swal.fire("Error", updateResponse, "error");
                        }

                    }

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
        // default / predefined library / custom
        Swal.fire({
            title: 'Save Failed',
            html: `<p>Form has Following Errors.</p>
                <p>${formErrors}</p>`,
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
}



