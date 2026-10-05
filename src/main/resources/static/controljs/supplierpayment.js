const tabpaneForm = document.getElementById("supplierPaymentTabPillForm");
const tabPaneTable = document.getElementById("supplierPaymentTabPillTable");
const tabPillForm = document.getElementById("supplierPaymentFormPill");
const tabPillTable = document.getElementById("supplierPaymentTablePill");

const selectSupplierElement= document.getElementById("selectSupplier");
const selectPaymentMethodElement= document.getElementById("selectPaymentMethod");
const numberTotalAmountElement= document.getElementById("numberTotalAmount");
const numberPaidAmountElement= document.getElementById("numberPaidAmount");
const numberBalanceElement= document.getElementById("numberBalance");
const textChequeNumberElement= document.getElementById("textChequeNumber");
const dateChequeDateElement= document.getElementById("dateChequeDate");
const textTransferNumberElement= document.getElementById("textTransferNumber");
const dateTransferDateElement= document.getElementById("dateTransferDate")
const textNoteElement= document.getElementById("textNote");
const tableBody= document.getElementById("tableBodySupplierPayment");
const methodChequeRowElement= document.getElementById("methodChequeRow")
const methodTransferRowElement= document.getElementById("methodTransferRow")

const tableBodyGRNInfo = document.getElementById("tableBodySupplierGRNs");

window.addEventListener("load",()=>{
    // enable tooltip
    $('[data-bs-toggle="tooltip"]').tooltip();
    userPrivi=getHttpServiceRequest("/userprivilegebymodule?modulename=Supplier-Payment")

    //call table refresh function
    refreshSupplierPaymentTable();
    //call form refresh function
    refreshSupplierPaymentForm();
})
const disableElement=()=>{
    selectSupplierElement.disabled= true;
    selectPaymentMethodElement.disabled= true;
    numberTotalAmountElement.disabled= true;
    numberPaidAmountElement.disabled= true;
    numberBalanceElement.disabled= true;
    textChequeNumberElement.disabled= true;
    dateChequeDateElement.disabled= true;
    textTransferNumberElement.disabled= true;
    dateTransferDateElement.disabled=true;
    textNoteElement.disabled= true;
}

const validatePaidAmount=()=>{
    let totalAmountValue= parseFloat(numberTotalAmountElement.value);
    let paidAmountValue= parseFloat(numberPaidAmountElement.value);

    const pattern = "^([1-9][0-9]{1,4})$";
    const regExpPattern = new RegExp(pattern);
    // not empty
    if (paidAmountValue != "") {
        if(regExpPattern.test(paidAmountValue)){
            if(paidAmountValue<=totalAmountValue){
                numberPaidAmountElement.style.borderBottom="2px solid lightgreen"
                supplierpayment.paidamount=paidAmountValue;
            }else{
                numberPaidAmountElement.style.borderBottom="2px solid pink"
            }
        }else{
            numberPaidAmountElement.style.borderBottom="2px solid pink"
        }
    }
}

selectPaymentMethodElement.addEventListener("change",()=>{
    const selectedData= JSON.parse(selectPaymentMethodElement.value);
    if(selectedData.name==="Cash"){
        methodChequeRowElement.style.display="none";
        methodTransferRowElement.style.display="none";
    }
    if(selectedData.name==="Cheque"){
        methodChequeRowElement.style.display="flex";
        methodTransferRowElement.style.display="none";
    }
    if(selectedData.name==="Bank Transfer"){
        methodChequeRowElement.style.display="none";
        methodTransferRowElement.style.display="flex";
    }

})
// fill grn info into table when select supplier

selectSupplierElement.addEventListener("change",()=>{
    numberTotalAmountElement.value = "";
    numberPaidAmountElement.value = "";
    numberBalanceElement.value = "";

    supplierpayment.totalamount = null;
    supplierpayment.paidamount = null;
    supplierpayment.balance = null;

        const supplier = JSON.parse(selectSupplierElement.value);
        if (!supplier || !supplier.id) {
            tableBodyGRNInfo.innerHTML = "";
            return;
        }
        let grnListBySupplier= getHttpServiceRequest("/grn/bysupplier/"+supplier.id)

        if (!grnListBySupplier || grnListBySupplier.length === 0) {
            tableBodyGRNInfo.innerHTML = "";
            return;
        }

        fillGRNInfoIntoTable(
            tableBodyGRNInfo,
            grnListBySupplier
        );
    })

// common function for fill grn info into table
const fillGRNInfoIntoTable = (
    tableBody,
    dataList,
    // displayProperty
) => {
    tableBody.innerHTML = "";
    let totalAmount = 0;

    dataList.forEach((grn, index) => {

        //tr
        let tr = document.createElement("tr");

        tr.grnObject = grn;

        // index
        let tdIndex = document.createElement("td");
        tdIndex.innerText = index + 1;
        tr.appendChild(tdIndex);

        // GRN No
        let tdGrnNo = document.createElement("td");
        tdGrnNo.innerText = grn.grnno;
        tr.appendChild(tdGrnNo);

        // Total Amount
        let tdTotal = document.createElement("td");
        tdTotal.innerText = grn.totalamount;
        tr.appendChild(tdTotal);

        // After Balance
        let tdBalance = document.createElement("td");
        tdBalance.innerText = grn.balance; // make sure backend sends this
        tr.appendChild(tdBalance);

        totalAmount += parseFloat(grn.balance || 0);

        // Pay Amount
        let tdPay = document.createElement("td");
        let inputPay = document.createElement("input");
        inputPay.type = "number";
        inputPay.disabled=true;
        inputPay.classList.add("form-control");

        tdPay.appendChild(inputPay);
        tr.appendChild(tdPay);

        // New Balance
        let tdNewBalance = document.createElement("td");
        tdNewBalance.innerText = "0";
        tr.appendChild(tdNewBalance);

        //tr append into tbody
        tableBody.appendChild(tr);
    });
    // set total amount field
    numberTotalAmountElement.value = totalAmount.toFixed(2);
    supplierpayment.totalamount = totalAmount;
};

numberPaidAmountElement.addEventListener("input", () => {
    distributePayment();
});

const distributePayment = () => {

    let paidamount = parseFloat(numberPaidAmountElement.value || 0);

    let rows = document.querySelectorAll("#tableBodySupplierGRNs tr");

    rows.forEach(row => {

        let afterBalanceCell = row.children[3];     // After Balance
        let payInput = row.children[4].querySelector("input"); // pay amount
        let newBalanceCell = row.children[5]; // new balance

        let balance = parseFloat(afterBalanceCell.innerText || 0);

        if (paidamount > 0) {

            if (paidamount >= balance) {
                // fully settle this GRN
                payInput.value = balance;
                newBalanceCell.innerText = "0";
                paidamount -= balance;
            } else {
                // partially settle
                payInput.value = paidamount;

                newBalanceCell.innerText = (balance - paidamount).toFixed(2);
                paidamount = 0;
            }

        } else {
            // no money left
            payInput.value = "";
            newBalanceCell.innerText = balance.toFixed(2);
        }
    });

    // update bottom balance
    getBalance();

    supplierpayment.supplierPaymentHasGRNList=[];
    rows.forEach(row=>{
        let grn= row.grnObject;

        let totalAmount = parseFloat(row.children[2].innerText || 0);
        let afterBalance = parseFloat(row.children[3].innerText || 0);
        let payAmount = parseFloat(row.children[4].querySelector("input").value || 0);
        let newBalance = parseFloat(row.children[5].innerText || 0);

        if (payAmount > 0) {
            let supplierPaymentHasGRN = {
                grnamount: totalAmount,
                afterbalance: afterBalance,
                payamount: payAmount,
                newbalance: newBalance,
                grn_id: grn
            };

            supplierpayment.supplierPaymentHasGRNList.push(supplierPaymentHasGRN);
        }
    })
};

const refreshSupplierPaymentTable=()=>{
    // IF table is already DataTable THEN remove it THEN create new DataTable
    if ($.fn.DataTable.isDataTable('#tableSupplierPayment')) {
        $('#tableSupplierPayment').DataTable().destroy();
    }
    let supplierpayments= ajaxGetrequest("/supplierpayment/alldata");
    // property array
    let displayProperty = [
        { propertyName: "paymentno", dataType: "string" },
        { propertyName: getSupplier, dataType: "function" },
        { propertyName: grnList, dataType: "function" },
        { propertyName: getPaymentMethod, dataType: "function" },
        { propertyName: "totalamount", dataType: "string" },
        { propertyName: "paidamount", dataType: "string" },
        { propertyName: "balance", dataType: "string" }
    ];
    //fill data into table function
    fillDataIntoTableEight(
        tableBody,
        supplierpayments,
        displayProperty,
        refillSupplierPaymentForm
    );

    buttonSubmit.classList.remove("d-none");
    buttonPrint.classList.add("d-none");


    $("#tableSupplierPayment").DataTable({
        responsive: true,
        autoWidth: false
    });
}

const getSupplier=(ob)=>{
    return ob.supplier_id.name;
}
const grnList=(ob)=>{
    if(!ob.supplierPaymentHasGRNList || ob.supplierPaymentHasGRNList.length===0){
        return "-";
    }
    let grnNos = ob.supplierPaymentHasGRNList.map(spgrn=>spgrn.grn_id.grnno);
    return grnNos.join(", ");
}

const getPaymentMethod=(ob)=>{
    return ob.paymentmethod_id.name;
}

const refillSupplierPaymentForm=(dataOb)=>{
    setInitial([
        selectSupplierElement,
        selectPaymentMethodElement,
        numberTotalAmountElement,
        numberPaidAmountElement,
        numberBalanceElement,
        textChequeNumberElement,
        dateChequeDateElement,
        textTransferNumberElement,
        dateTransferDateElement,
        textNoteElement
    ])
    // shift to tab pane form
    tabpaneForm.classList.add('show', 'active');
    tabPaneTable.classList.remove('show', 'active');
    // shift to  form pill tab
    tabPillForm.classList.add('show', 'active');
    tabPillTable.classList.remove('show', 'active');

    supplierpayment= getHttpServiceRequest("/supplierpayment/byid/"+ dataOb.id);
    oldSupplierPayment= getHttpServiceRequest("/supplierpayment/byid/"+ dataOb.id)


    const paymentMethod= dataOb.paymentmethod_id.name;
    if(paymentMethod==="Cash"){
        methodChequeRowElement.style.display="none";
        methodTransferRowElement.style.display="none";
    }
    if(paymentMethod==="Cheque"){
        methodChequeRowElement.style.display="block";
        methodTransferRowElement.style.display="none";
    }
    if(paymentMethod==="Bank Transfer"){
        methodChequeRowElement.style.display="none";
        methodTransferRowElement.style.display="block";
    }
    selectSupplierElement.value= JSON.stringify(supplierpayment.supplier_id);

    selectPaymentMethodElement.value= JSON.stringify(supplierpayment.paymentmethod_id);
    numberTotalAmountElement.value= supplierpayment.totalamount ;
    numberPaidAmountElement.value= supplierpayment.paidamount ;
    numberBalanceElement.value= supplierpayment.balance ;
    if(supplierpayment.chequedate != undefined || supplierpayment.chequedate!=null){
        dateChequeDateElement.value= supplierpayment.chequedate ;
    }else{
        dateChequeDateElement.value="";
    }
    if(supplierpayment.chequeno != undefined || supplierpayment.chequeno!=null){
        textChequeNumberElement.value= supplierpayment.chequeno ;
    }else{
        textChequeNumberElement.value="";
    }
    if(supplierpayment.transferdate != undefined || supplierpayment.transferdate!=null){
        dateTransferDateElement.value= supplierpayment.transferdate ;
    }else{
        dateTransferDateElement.value="";
    }
    if(supplierpayment.transferno != undefined || supplierpayment.transferno!=null){
        textTransferNumberElement.value= supplierpayment.transferno ;
    }else{
        textTransferNumberElement.value="";
    }
    if(supplierpayment.note != undefined || supplierpayment.note!=null){
        textNoteElement.value= supplierpayment.note ;
    }else{
        textNoteElement.value="";
    }

    refillGRNInfoTable(dataOb);

    buttonSubmit.classList.add("d-none");
    buttonPrint.classList.remove("d-none");
}

const refillGRNInfoTable = (supplierpayment) => {

    tableBodyGRNInfo.innerHTML = "";

    supplierpayment.supplierPaymentHasGRNList.forEach((sphgrn, index) => {


        let tr = document.createElement("tr");

        // index
        let tdIndex = document.createElement("td");
        tdIndex.innerText = index + 1;
        tr.appendChild(tdIndex);

        // GRN No
        let tdGrnNo = document.createElement("td");
        tdGrnNo.innerText = sphgrn.grn_id.grnno;
        tr.appendChild(tdGrnNo);

        // Total Amount
        let tdTotal = document.createElement("td");
        tdTotal.innerText = sphgrn.grnamount;
        tr.appendChild(tdTotal);

        // After Balance
        let tdBalance = document.createElement("td");
        tdBalance.innerText = sphgrn.afterbalance;
        tr.appendChild(tdBalance);


        // Pay Amount
        let tdPay = document.createElement("td");
        let inputPay = document.createElement("input");
        inputPay.type = "number";
        inputPay.classList.add("form-control");

        inputPay.value = sphgrn.payamount;

        tdPay.appendChild(inputPay);
        tr.appendChild(tdPay);

        // New Balance
        let tdNewBalance = document.createElement("td");
        tdNewBalance.innerText = sphgrn.newbalance;
        tr.appendChild(tdNewBalance);

        tableBodyGRNInfo.appendChild(tr);
    });

};

const printSupplierPaymentRecord = (dataOb) => {

    let supplierPaymentModal_view = new bootstrap.Modal(
        document.getElementById("modalSupplierPaymentView"), {}
    );

    supplierPaymentModal_view.show();

    tdPaymentNo.innerText = dataOb.paymentno;
    tdSupplier.innerText = dataOb.supplier_id.name;
    tdPaymentDate.innerText = dataOb.addeddatetime.split("T")[0];
    tdPaymentMethod.innerText = dataOb.paymentmethod_id.name;
    tdTotalAmount.innerText = dataOb.totalamount;
    tdPaidAmount.innerText = dataOb.paidamount;
    tdBalance.innerText = dataOb.balance;
    tdChequeDate.innerText = dataOb.chequedate ?? "-";
    tdChequeNo.innerText = dataOb.chequeno ?? "-";
    tdTransferDate.innerText = dataOb.transferdate ?? "-";
    tdTransferNo.innerText = dataOb.transferno ?? "-";
    tdNote.innerText = dataOb.note ?? "-";

    // Fill GRN table
    tbodyPrintGRNs.innerHTML = "";

    dataOb.supplierPaymentHasGRNList.forEach((item, index) => {

        let tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.grn_id.grnno}</td>
            <td>${item.grnamount}</td>
            <td>${item.afterbalance}</td>
            <td>${item.payamount}</td>
            <td>${item.newbalance}</td>
        `;

        tbodyPrintGRNs.appendChild(tr);
    });
}


const printSupplierPayment = () => {
    let tab = window.open();
    tab.document.write('<html>'
        + '<head><title>Print Supplier Payment Record</title>'
        + '<link rel="stylesheet" href="../resources/bootstrap-5.2.3/css/bootstrap.min.css"/>'
        + '</head>'
        + '<body>'
        + divCardPrintSupplierPayment.outerHTML
        + '</body></html>');

    setInterval(() => {
        tab.stop();
        tab.print();
        tab.close();
    }, 700);
}

const getBalance=()=>{
    let totalAmountValue= numberTotalAmountElement.value;
    let paidAmountValue= numberPaidAmountElement.value;
    // convert text element values for parse float is better option
    // to fixed -- 2 decimal points
    let balanceValue= (parseFloat(totalAmountValue)-parseFloat(paidAmountValue)).toFixed(2)
    numberBalanceElement.value= balanceValue;
    numberBalanceElement.style.borderBottom="2px solid lightgreen";
    supplierpayment.balance= balanceValue;
}

const refreshSupplierPaymentForm=()=>{
    // clean static element- only value- empty static element
    supplierPaymentForm.reset();

    if(!userPrivi.privi_insert){
        disableElement();
        buttonSubmit.classList.add("d-none");
        tabpaneForm.classList.remove('show', 'active');
        tabPillForm.classList.remove('show','active')
        tabPaneTable.classList.add('show', 'active');
        tabPillTable.classList.add('show','active')
    }

    supplierpayment = new Object();
    supplierpayment.supplierPaymentHasGRNList = [];

    tableBodyGRNInfo.innerHTML="";

    // set min and max value for cheque date
    //YYYY-MM-DD
    let minChequeDate= new Date();
    let maxChequeDate= new Date();
    minChequeDate.setDate(minChequeDate.getDate()+1)
    maxChequeDate.setDate(maxChequeDate.getDate()+14);
    dateChequeDateElement.min=getDateValue(minChequeDate);
    dateChequeDateElement.max=getDateValue(maxChequeDate) ;

    // set min and max value for transfer date
    //YYYY-MM-DD
    let maxTransferDate= new Date();
    dateTransferDateElement.max=getDateValue(maxTransferDate) ;


    let paymentmethods=ajaxGetrequest("/paymentmethod/alldata");
    fillDataIntoSelect(selectPaymentMethodElement,"Select Payment Method", paymentmethods,"name");

    // valid suppliers | nor deleted | not blacklisted ?
    let suppliers=ajaxGetrequest("/supplier/alldata");
    fillDataIntoSelect(selectSupplierElement,"Select Supplier", suppliers,"name");


    setInitial([
        selectSupplierElement,
        selectPaymentMethodElement,
        numberTotalAmountElement,
        numberPaidAmountElement,
        numberBalanceElement,
        textChequeNumberElement,
        dateChequeDateElement,
        textTransferNumberElement,
        dateTransferDateElement,
        textNoteElement
    ])
    methodChequeRowElement.style.display="flex";
    methodTransferRowElement.style.display="flex";
}

const checkSupplierPaymentFormErrors=()=>{
    let errors="";
    if(supplierpayment.supplier_id==null){
        selectSupplierElement.style.borderBottom = "2px solid pink";
        errors += "Please Select Supplier.<br>";
    }
    if(supplierpayment.paymentmethod_id==null){
        selectPaymentMethodElement.style.borderBottom = "2px solid pink";
        errors += "Please Select Payment Method.<br>";
    }
    if(supplierpayment.totalamount==null){
        numberTotalAmountElement.style.borderBottom = "2px solid pink";
        errors += "Please Enter Total Amount.<br>";
    }
    if(supplierpayment.paidamount==null){
        numberPaidAmountElement.style.borderBottom = "2px solid pink";
        errors += "Please Enter Paid Amount.<br>";
    }
    if(supplierpayment.paymentmethod_id.name=="Cheque"){
        if(supplierpayment.chequedate==null){
            dateChequeDateElement.style.borderBottom = "2px solid pink";
            errors += "Please Select Cheque Date.<br>";
        }
        if(supplierpayment.chequeno==null){
            textChequeNumberElement.style.borderBottom = "2px solid pink";
            errors += "Please Enter Cheque No.<br>";
        }
    }
    if(supplierpayment.paymentmethod_id.name=="Bank Transfer"){
        if(supplierpayment.transferdate==null){
            dateTransferDateElement.style.borderBottom = "2px solid pink";
            errors += "Please Select Transfer Date.<br>";
        }
        if(supplierpayment.transferno==null){
            textTransferNumberElement.style.borderBottom = "2px solid pink";
            errors += "Please Enter Transfer No.<br>";
        }
    }
    return errors;
}

// define function for submit form
const buttonSupplierPaymentSubmit = () => {
    console.log(supplierpayment);

    // check form has valid value
    let formErrors = checkSupplierPaymentFormErrors();
    if (formErrors === "") {
        Swal.fire({
            title: "Confirm Save",
            html: `<p>Are you sure to save this supplier payment record?</p>`,
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
                let postServiceResponse = getHttpServiceRequest("/supplierpayment/insert", "POST", supplierpayment);
                if (postServiceResponse == "OK") {
                    // save successs
                    Swal.fire({
                        title: "Saved!",
                        text: "Supplier Payment record saved successfully.",
                        icon: 'success',

                    });
                    refreshSupplierPaymentTable();
                    refreshSupplierPaymentForm();
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
                        html: `<p>Supplier Payment record could not be saved.</p>
                <p>Details: ${postServiceResponse}</p>`,
                        confirmButtonText: 'OK'
                    });
                }
            } else {
                //get user confirm for form discard
                // can get user confrimation for form refresh
                Swal.fire({
                    title: "Confirm Refresh",
                    text: "Do you need to refresh supplier payment form ?",
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