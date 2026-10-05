const tabpaneForm = document.getElementById("receiveNoteTabPillForm");
const tabPaneTable = document.getElementById("receiveNoteTabPillTable");
const tabPillForm = document.getElementById("receiveNoteFormPill");
const tabPillTable = document.getElementById("receiveNoteTablePill");

const tableBody= document.getElementById("tableBodyReceiveNote")
const selectSupplierElement= document.getElementById("selectSupplier")
const selectPurchaseOrderCodeElement= document.getElementById("selectPurchaseOrderCode")
const textSupplierBillNoElement= document.getElementById("textSupplierBillNo")
const dateReceivedDateElement= document.getElementById("dateReceivedDate")
const selectStatusElement= document.getElementById("selectStatus")
const selectBookElement= document.getElementById("selectBook")
const textOrderedQuantityElement= document.getElementById("textOrderedQuantity")
const textReceivedQuantityElement= document.getElementById("textReceivedQuantity")
const textUnitPriceElement= document.getElementById("textUnitPrice")
const textLineAmountElement= document.getElementById("textLineAmount")
const selectConditionElement= document.getElementById("selectCondition")
const textRemarksElement= document.getElementById("textRemarks")
const textNoteElement= document.getElementById("textNote")
const textTotalBooksElement= document.getElementById("textTotalBooks")
const textTotalAmountElement= document.getElementById("textTotalAmount")
const textDiscountElement= document.getElementById("textDiscount")
const textTaxAmountElement= document.getElementById("textTaxAmount")
const textNetAmountElement= document.getElementById("textNetAmount")
const tableBodyReceivedBooks= document.getElementById("tableBodyReceivedBooks")

window.addEventListener("load",()=>{
     // enable tooltip
  $('[data-bs-toggle="tooltip"]').tooltip();
    userPrivi=getHttpServiceRequest("/userprivilegebymodule?modulename=Good-Receive-Note")
    //call table refresh function
    refreshGRNTable();
    //call form refresh function
    refreshGRNForm();
})
const disableElement=()=>{
    selectSupplierElement.disabled=true;
    selectPurchaseOrderCodeElement.disabled=true;
    textSupplierBillNoElement.disabled=true;
    dateReceivedDateElement.disabled=true;
    selectStatusElement.disabled=true;
    textNoteElement.disabled=true;
    textTotalBooksElement.disabled=true;
    textTotalAmountElement.disabled=true;
    textDiscountElement.disabled=true;
    textTaxAmountElement.disabled=true;
    textNetAmountElement.disabled=true;
}

const refreshGRNTable=()=>{
    // IF table is already DataTable THEN remove it THEN create new DataTable
    if ($.fn.DataTable.isDataTable('#tableGRN')) {
        $('#tableGRN').DataTable().destroy();
    }
    grns= new Array();
    grns= ajaxGetrequest("/grn/alldata")

    // property array
    let displayProperty = [
        { propertyName: "grnno", dataType: "string" },
        { propertyName: getSupplier, dataType: "function" },
        { propertyName: getPurchaseOrderCode, dataType: "function" },
        { propertyName: "supplierbillno", dataType: "string" },
        { propertyName: "datereceived", dataType: "string" },
        { propertyName: "totalbooks", dataType: "string" },
        { propertyName: "totalamount", dataType: "string" },
        { propertyName: "discount", dataType: "string" },
        { propertyName: "taxamount", dataType: "string" },
        { propertyName: "netamount", dataType: "string" },
        { propertyName: getStatus, dataType: "function" }
    ];
    fillDataIntoTableEight(
        tableBody,
        grns,
        displayProperty,
        refillGRNForm
    )
    buttonSubmit.classList.remove("d-none");
    //buttonUpdate.classList.add("d-none");
    buttonPrint.classList.add("d-none");
    //buttonDelete.classList.add("d-none");
    buttonSubmitInnerForm.classList.remove("d-none");
    buttonUpdateInnerForm.classList.add("d-none");


    $("#tableGRN").DataTable({
        responsive: true,
        autoWidth: false
    });
}

// get supplier name
const getSupplier=(ob)=>{
    return ob.supplier_id.name;
}

// get purchase order code
const getPurchaseOrderCode=(ob)=>{
    return ob.purchase_id.purchaseordercode;
}

// get status
const getStatus=(ob)=>{
    return ob.grnstatus_id.name;
}

const refillGRNForm=(dataOb)=>{
    setInitial([
        selectSupplierElement,
        selectPurchaseOrderCodeElement,
        textSupplierBillNoElement,
        dateReceivedDateElement,
        selectStatusElement,
        textNoteElement,
        textTotalBooksElement,
        textTotalAmountElement,
        textDiscountElement,
        textTaxAmountElement,
        textNetAmountElement
    ])
    console.log(dataOb);

    // shift to tab pane form
    tabpaneForm.classList.add('show', 'active');
    tabPaneTable.classList.remove('show', 'active');
    // shift to  form pill tab
    tabPillForm.classList.add('show', 'active');
    tabPillTable.classList.remove('show', 'active');

    grn= ajaxGetrequest("/grn/byid/"+ dataOb.id)
    oldGrn=ajaxGetrequest("/grn/byid/"+ dataOb.id)

    selectSupplierElement.value= JSON.stringify(grn.supplier_id);
    selectSupplierElement.disabled=true;

    let poCodes = ajaxGetrequest("/purchase/alldata");

    fillDataIntoSelect(
        selectPurchaseOrderCodeElement,
        "Select Purchase Order Code",
        poCodes,
        "purchaseordercode"
    );

     selectPurchaseOrderCodeElement.value = JSON.stringify(grn.purchase_id);


    textSupplierBillNoElement.value= grn.supplierbillno ;
    dateReceivedDateElement.value= grn.datereceived ;
    selectStatusElement.value= JSON.stringify(grn.grnstatus_id)

    //note- optional
    if (grn.note) {
        textNoteElement.value = grn.note;
    } else {
        textNoteElement.value = "";
    }
    textTotalBooksElement.value= grn.totalbooks ;
    textTotalAmountElement.value= grn.totalamount;
    textDiscountElement.value= grn.discount ;
    textTaxAmountElement.value= grn.taxamount ;
    textNetAmountElement.value= grn.netamount ;

    refreshInnerFormAndTable();

    // if(!userPrivi.privi_update){
    //     buttonUpdate.classList.add("d-none");
    // }else {
    //     buttonUpdate.classList.remove("d-none");
    // }
    // if(!userPrivi.privi_delete){
    //     buttonDelete.classList.add("d-none");
    // }else {
    //     buttonDelete.classList.remove("d-none");
    // }

    // set button visibility
    // only showing update. submit space also not showing
    buttonSubmit.classList.add("d-none");
    // buttonSubmitInnerForm.classList.add("d-none");
    buttonPrint.classList.remove("d-none")
}

// delete function
const deleteGRNRecord=(dataOb)=>{
    //  confirmation
    grn = getHttpServiceRequest("/grn/byid/"+ dataOb.id)
    Swal.fire({
        title: "Confirm Deletion",
        html: `<p>Are you sure to Delete this GRN Record ?</p>
          <p>GRN No : <strong>${grn.grnno || ''}</strong><br></p>
           <p>Supplier : <strong>${grn.supplier_id.name || ''}</strong><br></p>
           <p>Purchase Order Code : <strong>${grn.purchase_id.purchaseordercode || ''}</strong></p>`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ff0000ff",
        cancelButtonColor: "rgb(0, 102, 255)",
        confirmButtonText: "Yes, Delete",
        cancelButtonText: "Cancel",
        reverseButtons: true

    }).then((result) => {
        if (result.isConfirmed) {
            let deleteServiceResponse = getHttpServiceRequest("/grn/delete", "DELETE", dataOb)
            if (deleteServiceResponse == "OK") {
                Swal.fire({
                    title: "Deleted!",
                    text: "GRN Record Deleted Successfully.",
                    icon: 'success',

                });
                //refresh table
                refreshGRNTable();
                refreshGRNForm();

                // shift to tab pane table
                tabpaneForm.classList.remove('show', 'active');
                tabPaneTable.classList.add('show', 'active');

                // shift to  table pill tab
                tabPillForm.classList.remove('show', 'active');
                tabPillTable.classList.add('show', 'active');
            } else {
                Swal.fire({
                    title: 'Deletion Failed',
                    html: `<p>GRN record could not be deleted.</p>
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
const printGRNRecord=(dataOb)=>{
    let grnModal_view = new bootstrap.Modal(
        document.getElementById("modalGRNView"),
        {}
    );
    grnModal_view.show();
    grn= getHttpServiceRequest("/grn/byid/"+ dataOb.id);
    tdGRNNo.innerText= dataOb.grnno ;
    tdSupplier.innerText= dataOb.supplier_id.name ;
    tdPurchaseOrderCode.innerText= dataOb.purchase_id.purchaseordercode ;
    tdInvoiceNo.innerText= dataOb.supplierbillno ;
    tdReceivedDate.innerText= dataOb.datereceived ;
    tdStatus.innerText= dataOb.grnstatus_id.name ;
    tdTotalBooks.innerText= dataOb.totalbooks ;
    tdTotalAmount.innerText= dataOb.totalamount ;
    tdDiscount.innerText= dataOb.discount ;
    tdTaxAmount.innerText= dataOb.taxamount ;
    tdNetAmount.innerText= dataOb.netamount ;
    tdnote.innerText= dataOb.note ;

    if(!dataOb.grnHasBookList || dataOb.grnHasBookList.length===0){
        return "-";
    }
    let bookTitles= dataOb.grnHasBookList.map(grnbook=>grnbook.book_id.title);
    tdReceivedBookList.innerText=bookTitles.join(", ");
}

const printGRN=()=>{
    let tab = window.open();
    tab.document.write('<html>'
        + '<head><title>Print GRN Record</title>'
        + '<link rel="stylesheet" href="../resources/bootstrap-5.2.3/css/bootstrap.min.css"/>'
        + '</head>'
        + '<body>'
        + divCardPrintGRN.outerHTML
        + '</body></html>');

    setInterval(() => {
        tab.stop();
        tab.print();
        tab.close();
    }, 700);
}

// refresh inner form and table
const refreshInnerFormAndTable=()=>{
    // refresh form area
    grnHasBook= new Object();

    if(grn.purchase_id == null){
        let books= [];
        fillDataIntoSelect(selectBookElement,"Please Select Book",books,"title")
        selectBookElement.disabled=true;
    }else{
        filterBooksByPO();
    }

    let conditions= ajaxGetrequest("/conditions/alldata")
    fillDataIntoSelect(selectConditionElement,"Select Condition",conditions,"name")

    textOrderedQuantityElement.value="";
    textReceivedQuantityElement.value="";
    textUnitPriceElement.value="";
    textLineAmountElement.value="";
    textRemarksElement.value="";
    textLineAmountElement.disabled=true;


    setInitial([
        selectBookElement,
        textOrderedQuantityElement,
        textReceivedQuantityElement,
        textUnitPriceElement,
        textLineAmountElement,
        selectConditionElement,
        textRemarksElement
    ])

    // refresh table area= fill table
    let innerColumns = [
        { propertyName: getInnerBook, dataType: "function" },
        { propertyName: "orderedquantity", dataType: "string" },
        { propertyName: "receivedquantity", dataType: "string" },
        { propertyName: "unitprice", dataType: "string" },
        { propertyName: "lineamount", dataType: "string" },
        { propertyName: getCondition, dataType: "function" }
    ];

    fillDataIntoInnerTable(
        tableBodyReceivedBooks,
        grn.grnHasBookList,
        innerColumns,
        editReceivedBookForm,
        deleteReceivedBook
    )

    // calculate total amount
    let totalAmount=0;
    for (const grnbook of grn.grnHasBookList){
        totalAmount += parseFloat(grnbook.lineamount);
    }
    textTotalAmountElement.value=totalAmount.toFixed(2);
    grn.totalamount= totalAmount;
    textTotalAmountElement.style.borderBottom="2px solid lightgreen"

    // set total amount as net amount also. further calculations written for net amount outside the inner form
    // net amount= total amount - discount + tax
    textNetAmountElement.value=totalAmount.toFixed(2);
    grn.netamount= totalAmount;

    // calculate total books count
    let totalBooks = 0;
    grn.grnHasBookList.forEach(book => {
        totalBooks += Number(book.receivedquantity) || 0;
    });
    textTotalBooksElement.value = totalBooks;
    grn.totalbooks= totalBooks;
    textTotalBooksElement.style.borderBottom="2px solid lightgreen"

    buttonUpdateInnerForm.classList.add("d-none");
    buttonSubmitInnerForm.classList.remove("d-none");
}

// get book title for inner table
const getInnerBook=(dataOb)=>{
    return dataOb.book_id.title;
}

const getCondition=(dataOb)=>{
    return dataOb.conditions_id.name;
}

// edit book form table
const editReceivedBookForm=(dataOb)=>{
    buttonUpdateInnerForm.classList.remove("d-none");
    buttonSubmitInnerForm.classList.add("d-none");

    grnHasBook= JSON.parse(JSON.stringify(dataOb));
    oldGrnHasBook= JSON.parse(JSON.stringify(dataOb));

    let books=[];
    books.push(grnHasBook.book_id);
    fillDataIntoSelect(selectBookElement,"Please Select Book",books,"title")
    selectBookElement.value= JSON.stringify(grnHasBook.book_id) ;
    selectBookElement.disabled="disabled";

    textOrderedQuantityElement.value= dataOb.orderedquantity  ;
    textReceivedQuantityElement.value= dataOb.receivedquantity  ;
    textUnitPriceElement.value= dataOb.unitprice  ;
    textLineAmountElement.value= dataOb.lineamount ;
    selectConditionElement.value= JSON.stringify(grnHasBook.conditions_id) ;
    if(dataOb.remarks==null || dataOb.remarks== undefined){
        textRemarksElement.value= "";
    }else{
        textRemarksElement.value= dataOb.remarks ;
    }

}

// delete book from table
const deleteReceivedBook=(dataOb)=>{

    Swal.fire({
        title: "Confirm Remove",
        html: `<p>Are you sure to remove Received Book?</p>`,
        icon: "warning",
        confirmButtonColor: "#ff0000ff",
        confirmButtonText: "Yes, Remove",

    }).then((result) => {
        if (result.isConfirmed) {
            let extIndex= grn.grnHasBookList.map(grnbook=>grnbook.book_id.id).indexOf(dataOb.book_id.id)
            if(extIndex>-1){
                grn.grnHasBookList.splice(extIndex,1);
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
const checkReceivedBookErrors=()=>{
    let errors="";
    if(grnHasBook.book_id==null){
        errors += "Please Select Book.<br>";
        selectBookElement.style.borderBottom="2px solid pink";
    }
    // auto book price
    if(grnHasBook.orderedquantity==null){
        errors += "Please Enter Ordered Quantity.<br>";
        textOrderedQuantityElement.style.borderBottom="2px solid pink";
    }
    if(grnHasBook.receivedquantity==null){
        errors += "Please Enter Received Quantity.<br>";
        textReceivedQuantityElement.style.borderBottom="2px solid pink";
    }
    if(grnHasBook.unitprice==null){
        errors += "Please Enter Unit Price.<br>";
        textUnitPriceElement.style.borderBottom="2px solid pink";
    }
    if(grnHasBook.conditions_id==null){
        errors += "Please Select Condition.<br>";
        selectConditionElement.style.borderBottom="2px solid pink";
    }
    return errors;
}

// submit inner form function
const receivedBookSubmit=()=>{
    console.log(grnHasBook);
    let errors = checkReceivedBookErrors();
    if (errors === "") {
        // form has not any errors
        Swal.fire({
            title: "Confirm Save",
            html: `<p>Are you sure to add Received Book?</p>`,
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
                grn.grnHasBookList.push(grnHasBook);
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
const checkReceivedBookUpdates=()=>{
    let updates="";
    if(grnHasBook!= null && oldGrnHasBook!=null){
        if(grnHasBook.orderedquantity!=oldGrnHasBook.orderedquantity){
            updates+="Orderd Quantity is changed " +
                oldGrnHasBook.orderedquantity+" into "+
                grnHasBook.orderedquantity+
                ".<br>"
        }
        if(grnHasBook.receivedquantity!=oldGrnHasBook.receivedquantity){
            updates+="Received Quantity is changed " +
                oldGrnHasBook.receivedquantity+" into "+
                grnHasBook.receivedquantity+
                ".<br>"
        }
        if(grnHasBook.unitprice!=oldGrnHasBook.unitprice){
            updates+="Unit Price is changed " +
                oldGrnHasBook.unitprice+" into "+
                grnHasBook.unitprice+
                ".<br>"
        }
        if(grnHasBook.conditions_id.name!=oldGrnHasBook.conditions_id.name){
            updates+="Condition is changed " +
                oldGrnHasBook.conditions_id.name+" into "+
                grnHasBook.conditions_id.name+
                ".<br>"
        }
        if(grnHasBook.remarks!=oldGrnHasBook.remarks){
            updates+="Remarks is changed " +
                oldGrnHasBook.remarks+" into "+
                grnHasBook.remarks+
                ".<br>"
        }
    }
    return updates;
}

// update inner form function
const receivedBookUpdate=()=>{
   // console.log(purchaseorderBook);
    let errors = checkReceivedBookErrors();
    if (errors === "") {
        let updates= checkReceivedBookUpdates();
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
                html: `<p>Are you sure to update this Received Book?</p>`,
                icon: "warning",
                confirmButtonColor: "#ff0000ff",
                cancelButtonColor: "rgb(0, 102, 255)",
                confirmButtonText: "Yes, Update",
                cancelButtonText: "Cancel",
                reverseButtons: true,

            }).then((result) => {
                if (result.isConfirmed) {
                    let extIndex= grn.grnHasBookList.map(grnbook=>grnbook.book_id.id).indexOf(grnHasBook.book_id.id);
                    if(extIndex>-1){
                        grn.grnHasBookList[extIndex].orderedquantity= grnHasBook.orderedquantity;
                        grn.grnHasBookList[extIndex].receivedquantity= grnHasBook.receivedquantity;
                        grn.grnHasBookList[extIndex].unitprice= grnHasBook.unitprice;
                        grn.grnHasBookList[extIndex].lineamount= grnHasBook.lineamount;
                        grn.grnHasBookList[extIndex].condition_id= grnHasBook.condition_id;
                        grn.grnHasBookList[extIndex].remarks= grnHasBook.remarks;
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

// define function for filter purchase orders by supplier
const filterPOBySupplier=()=>{
    let supplier = JSON.parse(selectSupplierElement.value);
    let poCodesBySupplier= ajaxGetrequest("/purchase/bysupplier/"+supplier.id);
    fillDataIntoSelect(selectPurchaseOrderCodeElement,"Select Purchase Order Code",poCodesBySupplier,"purchaseordercode")
    selectPurchaseOrderCodeElement.disabled=false;
}

// define function for filter book by purchase order
const filterBooksByPO=()=>{

    if(selectPurchaseOrderCodeElement.value == ""){
        return;
    }
    let porder = JSON.parse(selectPurchaseOrderCodeElement.value);

    let booksByPO= ajaxGetrequest("/book/bypurchaseorder/"+porder.id);

    const poAllBooks= booksByPO; // {id:1, code: 000001},{}
    const poBookWithoutSelected= grn.grnHasBookList; // {item_id:{id:1, code: 000001}, purchaseprice:}

    const poBookWithoutSelectedIds= new Set(poBookWithoutSelected.map(book =>book.book_id.id));
    const filteredArray= poAllBooks.filter(book1=> !poBookWithoutSelectedIds.has(book1.id))

    if(grn.grnHasBookList.length>0){
        fillDataIntoSelect(selectBookElement,"Select Book",filteredArray,"title")
    }else{
        fillDataIntoSelect(selectBookElement,"Select Book",booksByPO,"title")
    }
    selectBookElement.disabled=false;
}

const getPOBookInfo=()=>{
    let porder = JSON.parse(selectPurchaseOrderCodeElement.value);
    let purchaseOrder= ajaxGetrequest("/purchase/byid/"+porder.id);

    let receivedBook= JSON.parse(selectBookElement.value);
    let bookInfo= purchaseOrder.purchaseHasBookList.find(book=>book.book_id.id===receivedBook.id)
    if(bookInfo){
        textUnitPriceElement.value= bookInfo.purchaseprice;
        textUnitPriceElement.style.borderBottom= "2px solid lightgreen";
        grnHasBook.unitprice=textUnitPriceElement.value;

        textOrderedQuantityElement.value= bookInfo.quantity;
        textOrderedQuantityElement.style.borderBottom= "2px solid lightgreen";
        grnHasBook.orderedquantity =textOrderedQuantityElement.value;
        textOrderedQuantityElement.disabled= true;
    }

}

const validateReceivedQuantity=()=>{
    let orderedQuantity= textOrderedQuantityElement.value;
    let receivedQuantity= parseFloat(textReceivedQuantityElement.value);

    const pattern = "^(([1-9][0-9]{0,7}))$";
    const regExpPattern = new RegExp(pattern);
    // not empty
    if (receivedQuantity != "") {
        if(regExpPattern.test(receivedQuantity)){
            if(receivedQuantity<=orderedQuantity){
                textReceivedQuantityElement.style.borderBottom="2px solid lightgreen"
                grnHasBook.receivedquantity=receivedQuantity;
            }else{
                textReceivedQuantityElement.style.borderBottom="2px solid pink"
            }
        }else{
            textReceivedQuantityElement.style.borderBottom="2px solid pink"
        }
    }
}

const calculateNetAmount=()=>{
    let totalAmount= parseFloat(textTotalAmountElement.value) || 0;
    let discountAmount =parseFloat(textDiscountElement.value) || 0;
    let taxAmount =parseFloat(textTaxAmountElement.value) || 0;
    textNetAmountElement.value= (totalAmount-discountAmount)+taxAmount;
    grn.netamount= textNetAmountElement.value;
}


// define function for generate line price
const generateLinePrice=()=>{
    let unitPrice = parseFloat(textUnitPriceElement.value);
    if(grnHasBook.receivedquantity != null){
        let receivedQuantity=  parseFloat(textReceivedQuantityElement.value);
        textLineAmountElement.value= (unitPrice* receivedQuantity).toFixed(2);
        grnHasBook.lineamount= textLineAmountElement.value;
        textLineAmountElement.style.borderBottom="2px solid lightgreen ";

    }else{
        textLineAmountElement.value= "";
        grnHasBook.lineamount= null;
        setInitial([
            textLineAmountElement
        ])
    }
}

const refreshGRNForm=()=>{
    receiveNoteForm.reset();

    if(!userPrivi.privi_insert){
        disableElement();
        buttonSubmit.classList.add("d-none");
        buttonSubmitInnerForm.classList.add("d-none");
        tabpaneForm.classList.remove('show', 'active');
        tabPillForm.classList.remove('show','active')
        tabPaneTable.classList.add('show', 'active');
        tabPillTable.classList.add('show','active')
    }
    grn= new Object();
    grn.grnHasBookList= new Array();

    // set min and max value for received date
    //YYYY-MM-DD
    let minDate= new Date();
    let maxDate= new Date();
    minDate.setDate(minDate.getDate()-7);
    dateReceivedDateElement.min=getDateValue(minDate);
    dateReceivedDateElement.max=getDateValue(maxDate) ;

    // received date set

    let suppliers=ajaxGetrequest("/supplier/alldata")
    fillDataIntoSelect(
        selectSupplierElement,
        "Select Supplier",
        suppliers,
        "name"
    )

    let grnstatus= ajaxGetrequest("/grnstatus/alldata")
    fillDataIntoSelect(
        selectStatusElement,
        "Select Status",
        grnstatus,
        "name"
    )
    selectPurchaseOrderCodeElement.value="";
    textDiscountElement.value = "";
    textTaxAmountElement.value = "";
    textNetAmountElement.value = "";

    refreshInnerFormAndTable();

    setInitial([
        selectSupplierElement,
        selectPurchaseOrderCodeElement,
        textSupplierBillNoElement,
        dateReceivedDateElement,
        selectStatusElement,
        textNoteElement,
        textTotalBooksElement,
        textTotalAmountElement,
        textDiscountElement,
        textTaxAmountElement,
        textNetAmountElement
    ])
    // auto select status - fill default value for grn status- received
    selectStatusElement.value= JSON.stringify(grnstatus[0]);
    // binding to object
    grn.grnstatus_id=grnstatus[0];
    selectStatusElement.disabled=true;
    //set valid color
    selectStatusElement.style.borderBottom="2px solid lightgreen";

    selectPurchaseOrderCodeElement.disabled=true;
}

//check grn form errors
const checkGRNFormErrors=()=>{
    let errors="";
    if(grn.supplier_id == null){
        errors+="Please Select Supplier.<br>";
        selectSupplierElement.style.borderBottom="2px solid pink"
    }
    if(grn.purchase_id == null){
        errors+="Please Select Purchase Order Code.<br>";
        selectPurchaseOrderCodeElement.style.borderBottom="2px solid pink"
    }
    if(grn.supplierbillno == null){
        errors+="Please Enter Supplier Bill No.<br>";
        textSupplierBillNoElement.style.borderBottom="2px solid pink"
    }
    if(grn.datereceived == null){
        errors+="Please Select Received Date.<br>";
        dateReceivedDateElement.style.borderBottom="2px solid pink"
    }
    if(grn.grnstatus_id == null){
        errors+="Please Select Status.<br>";
        selectStatusElement.style.borderBottom="2px solid pink"
    }
    // total books
    if(grn.totalbooks == null){
        errors+="Please Enter Total Books Count.<br>";
        textTotalBooksElement.style.borderBottom="2px solid pink"
    }

    // total amount
    // discount
    // tax amount
    // net amount

    if(grn.grnHasBookList.length == 0){
        errors+="Please Select Book.<br>";
    }
    return errors;
}

// grn submit function
const grnSubmitButton=()=>{
    console.log(grn);
    let formErrors = checkGRNFormErrors();
    if (formErrors === "") {
        // form has not any errors
        Swal.fire({
            title: "Confirm Save",
            html: `<p>Are you sure to save this GRN record?</p>`,
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
                let postServiceResponse = getHttpServiceRequest("/grn/insert", "POST", grn);

                if (postServiceResponse == "OK") {
                    // save successs
                    Swal.fire({
                        title: "Saved!",
                        text: "GRN record saved successfully.",
                        icon: 'success',
                    });
                    refreshGRNTable();
                    refreshGRNForm();
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
                        html: `<p>GRN record could not be saved.</p>
                <p>Details: ${postServiceResponse}</p>`,
                        confirmButtonText: 'OK'
                    });
                }
            } else {
                //get user confirm for form discard
                // can get user confirmation for form refresh
                Swal.fire({
                    title: "Confirm Refresh",
                    text: "Do you need to refresh GRN form ?",
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

// check grn form updates
const checkGRNFormUpdates=()=>{
    let updates="";
    if(grn!= null && oldGrn!= null){
        if(grn.supplier_id.name != oldGrn.supplier_id.name){
            updates+="Supplier is changed "+
                oldGrn.supplier_id.name+" into "+
                grn.supplier_id.name+
                ".<br>"
        }
        if(grn.purchase_id.purchaseordercode != oldGrn.purchase_id.purchaseordercode){
            updates+="Purchase Order is changed "+
                oldGrn.purchase_id.purchaseordercode+" into "+
                grn.purchase_id.purchaseordercode+
                ".<br>"
        }
        if(grn.supplierbillno != oldGrn.supplierbillno){
            updates+="Supplier Bill No is changed "+
                oldGrn.supplierbillno+" into "+
                grn.supplierbillno+
                ".<br>"
        }
        if(grn.datereceived != oldGrn.datereceived){
            updates+="Received Date is changed "+
                oldGrn.datereceived+" into "+
                grn.datereceived+
                ".<br>"
        }
        if(grn.grnstatus_id.name != oldGrn.grnstatus_id.name){
            updates+="Status is changed "+
                oldGrn.grnstatus_id.name+" into "+
                grn.grnstatus_id.name+
                ".<br>"
        }
        if(grn.totalbooks != oldGrn.totalbooks){
            updates+="Total Books is changed "+
                oldGrn.totalbooks+" into "+
                grn.totalbooks+
                ".<br>"
        }
        if(grn.totalamount != oldGrn.totalamount){
            updates+="Total Amount is changed "+
                oldGrn.totalamount+" into "+
                grn.totalamount+
                ".<br>"
        }
        if(grn.discount != oldGrn.discount){
            updates+="Discount is changed "+
                oldGrn.discount+" into "+
                grn.discount+
                ".<br>"
        }
        if(grn.taxamount != oldGrn.taxamount){
            updates+="Tax Amount is changed "+
                oldGrn.taxamount+" into "+
                grn.taxamount+
                ".<br>"
        }
        if(grn.netamount != oldGrn.netamount){
            updates+="Net Amount is changed "+
                oldGrn.netamount+" into "+
                grn.netamount+
                ".<br>"
        }
        if(grn.note != oldGrn.note){
            updates+="Note is changed "+
                oldGrn.note+" into "+
                grn.note+
                ".<br>"
        }
        if (JSON.stringify(grn.grnHasBookList) !== JSON.stringify(oldGrn.grnHasBookList)) {
            updates += "Books are changed.<br>";
        }
    }return updates;
}

// update grn form function
const grnUpdateButton=()=>{
// need to check  all required feild with valid value
    let formErrors = checkGRNFormErrors();
    if (formErrors == "") {
        let formUpdates = checkGRNFormUpdates();
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
                html: `<p>Are you sure to update this GRN record?</p>
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
                    let updateServiceResponse = getHttpServiceRequest("/grn/update", "PUT", grn);
                    if (updateServiceResponse == "OK") {
                        //user confrim update
                        Swal.fire({
                            title: "Updated!",
                            text: "GRN record updated successfully.",
                            icon: 'success',

                        });
                        //refresh form and table
                        refreshGRNTable();
                        refreshGRNForm();

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
                            html: `<p>GRN record could not be updated.</p>
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