const tabpaneForm = document.getElementById("paymentTabPillForm");
const tabPaneTable = document.getElementById("paymentTabPillTable");
const tabPillForm = document.getElementById("paymentFormPill");
const tabPillTable = document.getElementById("paymentTablePill");

let tableBody = document.querySelector("#tableBodyPayment");
let textMemberNoElement= document.getElementById("textMemberNo")
let paymentMethod= document.getElementById("selectPaymentMethod");
let referenceNoRow= document.getElementById("referenceNoRow");
let textReferenceNumberElement= document.getElementById("textReferenceNumber");
let starReferenceNoElement = document.getElementById("starReferenceNo");
let selectPaymentTypeElement= document.getElementById("selectPaymentType");
let numberReceivedAmount= document.getElementById("numberReceivedAmount");

window.addEventListener("load",()=>{
     // enable tooltip
     $('[data-bs-toggle="tooltip"]').tooltip();
    userPrivi=getHttpServiceRequest("/userprivilegebymodule?modulename=Payment")

    //call table refresh function
    refreshPaymentTable();
    //call form refresh funcion
    refreshPaymentForm();

    let urlParam= window.location.search;
    let searchParams = new URLSearchParams(urlParam);

    if(searchParams.has("membershipid")){
        refillPaymentForm(searchParams.get("membershipid"));
        window.history.replaceState({}, document.title,"/payment")
    }

    if(searchParams.has("borrowIds")){
        let ids = searchParams.get("borrowIds");

        //let borrows = ajaxGetrequest("/borrow/byids?ids=" + ids);
        let borrows = ajaxGetrequest("/payment/byborrowids?borrowIds=" + ids);
        console.log("Borrows:", borrows);

        refillFinePaymentForm(borrows);
        window.history.replaceState({}, document.title,"/payment");
    }
})

const disableElement=()=>{
    document.getElementById("textMemberNo").disabled=true;
    document.getElementById("selectPaymentType").disabled=true;
    document.getElementById("selectPaymentMethod").disabled=true;
    document.getElementById("numberAmount").disabled=true;
    document.getElementById("numberReceivedAmount").disabled=true;
    document.getElementById("numberBalance").disabled=true;
    document.getElementById("textReferenceNumber").disabled=true;
    document.getElementById("textNote").disabled=true;
}

paymentMethod.addEventListener("change",()=>{
    const selectedData= JSON.parse(selectPaymentMethod.value);
    if(selectedData.name==="Cash"){
        referenceNoRow.style.display="none";
        textReferenceNumberElement.required= false;
    }else {
        referenceNoRow.style.display="flex";
        textReferenceNumberElement.required= true;
        starReferenceNoElement.style.display="block";
    }
})

const refreshPaymentTable=()=>{
    // IF table is already DataTable THEN remove it THEN create new DataTable
    if ($.fn.DataTable.isDataTable('#tablePayment')) {
        $('#tablePayment').DataTable().destroy();
    }
    let payments= ajaxGetrequest("/payment/alldata");
    // property array
    let displayProperty = [
        { propertyName: "paymentno", dataType: "string" },
        { propertyName: getMemberNumber, dataType: "function" },
        { propertyName: getMemberName, dataType: "function" },
        { propertyName: getPaymentType, dataType: "function" },
        { propertyName: getPaymentMethod, dataType: "function" },
        { propertyName: "amount", dataType: "string" },
        { propertyName: "referenceno", dataType: "string" }
    ];
    //fill data into table function
    fillDataIntoTableEight(
        tableBody,
        payments,
        displayProperty,
        refillPaymentForm
    );

    buttonSubmit.classList.remove("d-none");
    buttonPrint.classList.add("d-none");


    $("#tablePayment").DataTable({
        responsive: true,
        autoWidth: false
    });
}

const getMemberNumber=(ob)=>{
    return ob.member_id.memberno;
}

const getMemberName=(ob)=>{
    return ob.member_id.name;
}

const getPaymentType=(ob)=>{
    return ob.paymenttype_id.name;
}

const getPaymentMethod=(ob)=>{
    return ob.memberpaymentmethod_id.name;
}


const refillFinePaymentForm = (borrows) => {
    setInitial([
        textMemberNo,
        selectPaymentType,
        selectPaymentMethod,
        numberAmount,
        numberReceivedAmount,
        numberBalance,
        textReferenceNumber,
        textNote
    ])

    // shift to tab pane form
    tabpaneForm.classList.add('show', 'active');
    tabPaneTable.classList.remove('show', 'active');
    // shift to  form pill tab
    tabPillForm.classList.add('show', 'active');
    tabPillTable.classList.remove('show', 'active');

    payment= new Object();
    oldPayment= null;


    // get member from first borrow
    let member = borrows[0].member_id;
    payment.member_id = member;

    textMemberNo.value = member.memberno;
    textMemberNo.style.borderBottom = "2px solid lightgreen";
    textMemberNo.disabled=true;

    if(member.memberphoto!=null){
        imgMemberPhoto.src= atob(member.memberphoto);
    }else{
        imgMemberPhoto.src="/resources/images/memberdefault.png";
    }

    textMemberName.innerText = member.name;
    textMemberStatus.innerText = member.memberstatus_id.name;

    let paymenttypes= ajaxGetrequest("/paymenttype/alldata");
    fillDataIntoSelect(selectPaymentType,"Select Payment Type",paymenttypes,"name");
    selectPaymentTypeElement.value= JSON.stringify(paymenttypes[1]);
    selectPaymentTypeElement.style.borderBottom="2px solid lightgreen";
    payment.paymenttype_id= paymenttypes[1];
    selectPaymentTypeElement.disabled=true;


    let totalFine = 0;

    borrows.forEach(b => {
        totalFine += b.remainingfine;
    });

    payment.amount=totalFine;
    numberAmount.value = totalFine.toFixed(2);
    numberAmount.style.borderBottom="2px solid lightgreen";
    numberAmount.disabled=true;

    buttonSubmit.classList.remove("d-none");
    buttonPrint.classList.add("d-none");
    //  store borrow IDs
    payment.paymentHasBorrowList = borrows.map(b => {
        return {
            borrow_id: { id: b.id }
        };
    });
}

const refillPaymentForm=(data)=>{
    setInitial([
        textMemberNo,
        selectPaymentType,
        selectPaymentMethod,
        numberAmount,
        numberReceivedAmount,
        numberBalance,
        textReferenceNumber,
        textNote
    ])
    // shift to tab pane form
    tabpaneForm.classList.add('show', 'active');
    tabPaneTable.classList.remove('show', 'active');
    // shift to  form pill tab
    tabPillForm.classList.add('show', 'active');
    tabPillTable.classList.remove('show', 'active');

    if(typeof data==="number" || typeof data==="string"){
        let membership= getHttpServiceRequest("/membership/byid/"+data);
        payment= new Object();
        oldPayment= null;

        payment.member_id=membership.member_id;
        payment.amount=membership.fee;
        payment.membership_id= membership;

        let paymenttypes= ajaxGetrequest("/paymenttype/alldata");
        fillDataIntoSelect(selectPaymentType,"Select Payment Type",paymenttypes,"name");
        selectPaymentTypeElement.value= JSON.stringify(paymenttypes[0]);
        selectPaymentTypeElement.style.borderBottom="2px solid lightgreen";
        payment.paymenttype_id= paymenttypes[0];
        selectPaymentTypeElement.disabled=true;

        textMemberNo.value= membership.member_id.memberno ;
        textMemberNo.style.borderBottom="2px solid lightgreen";
        textMemberNo.disabled=true;

        numberAmount.value= membership.fee ;
        numberAmount.style.borderBottom="2px solid lightgreen";
        numberAmount.disabled=true;

        if(membership.member_id.memberphoto!=null){
            imgMemberPhoto.src= atob(membership.member_id.memberphoto);
        }else{
            imgMemberPhoto.src="/resources/images/memberdefault.png";
        }
        textMemberName.innerText= membership.member_id.name;
        textMemberStatus.innerText= membership.member_id.memberstatus_id.name;

        buttonSubmit.classList.remove("d-none");
        buttonPrint.classList.add("d-none");

        return;
    }
    if (typeof data==="object"){
        payment = getHttpServiceRequest("/payment/byid/"+ data.id);
        oldPayment = getHttpServiceRequest("/payment/byid/"+ data.id);

        const paymentMethod= data.memberpaymentmethod_id.name;
        if(paymentMethod==="Cash"){
            referenceNoRow.style.display="none";
            textReferenceNumberElement.required= false;
        }else {
            referenceNoRow.style.display="flex";
            textReferenceNumberElement.required= true;
            starReferenceNoElement.style.display="block";
        }

        textMemberNo.value= payment.member_id.memberno ;
        selectPaymentType.value= JSON.stringify(payment.paymenttype_id) ;
        selectPaymentMethod.value= JSON.stringify(payment.memberpaymentmethod_id) ;

        numberAmount.value= payment.amount ;
        numberReceivedAmount.value= payment.receivedamount ;
        numberBalance.value= payment.balance ;
        if(payment.referenceno != undefined || payment.referenceno!=null){
            textReferenceNumber.value= payment.referenceno ;
        }else{
            textReferenceNumber.value="";
        }
        if(payment.note != undefined || payment.note!=null){
            textNote.value= payment.note ;
        }else{
            textNote.value="";
        }

        if(payment.member_id.memberphoto!=null){
            imgMemberPhoto.src= atob(payment.member_id.memberphoto);
        }else{
            imgMemberPhoto.src="/resources/images/memberdefault.png";
        }
        // also refill membership info
        textMemberName.innerText= payment.member_id.name;
        textMemberStatus.innerText= payment.member_id.memberstatus_id.name;

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
        buttonPrint.classList.remove("d-none");
    }

}

// define function for payment print
const printPaymentRecord = (dataOb) => {
    let paymentModal_view = new bootstrap.Modal(
        document.getElementById("modalPaymentView"),
        {}
    );
    paymentModal_view.show();
    tdPaymentNo.innerText= dataOb.paymentno;
    tdMemberNo.innerText= dataOb.member_id.memberno  ;
    tdMemberName.innerText= dataOb.member_id.name  ;
    tdPaymentType.innerText= dataOb.paymenttype_id.name  ;
    tdPaymentMethod.innerText= dataOb.memberpaymentmethod_id.name  ;
    tdAmount.innerText= dataOb.amount  ;
    tdReferenceNo.innerText= dataOb.referenceno  ;
    tdNote.innerText= dataOb.note  ;


}

const printPayment = () => {
    let tab = window.open();
    tab.document.write('<html>'
        + '<head><title>Print Payment Record</title>'
        + '<link rel="stylesheet" href="../resources/bootstrap-5.2.3/css/bootstrap.min.css"/>'
        + '</head>'
        + '<body>'
        + divCardPrintPayment.outerHTML
        + '</body></html>');

    setInterval(() => {
        tab.stop();
        tab.print();
        tab.close();
    }, 700);
}


// member no validate and set as member_id
textMemberNoElement.addEventListener("keyup", ()=>{
    const textMemberNoValue = textMemberNoElement.value;
    let pattern= "^[M][E][M][0-9]{9}$";
    const regExpPttern= new RegExp(pattern);
    if(textMemberNoValue !=""){
        // value is not empty
        if(regExpPttern.test(textMemberNoValue)){
            // value is valid
            let memberByMemberNo= getHttpServiceRequest("/member/bymemberno/"+textMemberNoValue)
            if(memberByMemberNo && memberByMemberNo.id){
                // member found
                payment.member_id= memberByMemberNo;
                textMemberNoElement.style.borderBottom = " 2px solid lightgreen";
                console.log(payment);

                textMemberName.innerText=memberByMemberNo.name ;
                textMemberStatus.innerText= memberByMemberNo.memberstatus_id.name;
                if(memberByMemberNo.memberphoto){
                    imgMemberPhoto.src= atob(memberByMemberNo.memberphoto);
                }else{
                    imgMemberPhoto.src="/resources/images/memberdefault.png";
                }


                document.getElementById("selectPaymentType").disabled=false;
                document.getElementById("selectPaymentMethod").disabled=false;
                document.getElementById("numberAmount").disabled=false;
                document.getElementById("numberReceivedAmount").disabled=false;
                document.getElementById("textReferenceNumber").disabled=false;
                document.getElementById("textNote").disabled=false;

            }else{
                // member not found
                payment.member_id= null;
                textMemberNoElement.style.borderBottom = " 2px solid pink";
                textMemberName.innerText="-" ;
                textMemberStatus.innerText= "-";
                imgMemberPhoto.src="/resources/images/memberdefault.png";


                document.getElementById("selectPaymentType").disabled=true;
                document.getElementById("selectPaymentMethod").disabled=true;
                document.getElementById("numberAmount").disabled=true;
                document.getElementById("numberReceivedAmount").disabled=true;
                document.getElementById("textReferenceNumber").disabled=true;
                document.getElementById("textNote").disabled=true;


            }

        }else{
            // value is invalid
            textMemberNoElement.style.borderBottom = " 2px solid pink";
            textMemberName.innerText="-" ;
            textMemberStatus.innerText= "-";
            imgMemberPhoto.src="/resources/images/memberdefault.png";
        }
    }else{
        // value is empty
        if (textMemberNoElement.required) {
            textMemberNoElement.style.borderBottom = "2px solid pink";
            textMemberName.innerText="-" ;
            textMemberStatus.innerText= "-";
            imgMemberPhoto.src="/resources/images/memberdefault.png";
        } else {
            textMemberNoElement.style.borderBottom = "white";
        }
    }
})

const validateReceivedAmount=()=>{
    let amountValue= parseFloat(numberAmount.value);
    let receivedAmountValue= parseFloat(numberReceivedAmount.value);

    const pattern = "^([1-9][0-9]{1,4})$";
    const regExpPattern = new RegExp(pattern);
    // not empty
    if (receivedAmountValue != "") {
        if(regExpPattern.test(receivedAmountValue)){
            if(receivedAmountValue>=amountValue){
                numberReceivedAmount.style.borderBottom="2px solid lightgreen"
            }else{
                numberReceivedAmount.style.borderBottom="2px solid pink"
            }
        }else{
            numberReceivedAmount.style.borderBottom="2px solid pink"
        }
    }
}

const getBalance=()=>{
    let amountValue= numberAmount.value;
    let receivedAmountValue= numberReceivedAmount.value;
    // convert text element values for parse float is better option
    // to fixed -- 2 decimal points
    let balanceValue= (parseFloat(receivedAmountValue)-parseFloat(amountValue)).toFixed(2)
    numberBalance.value= balanceValue;
    numberBalance.style.borderBottom="2px solid lightgreen";
    payment.balance= balanceValue;
}

const refreshPaymentForm=()=>{
    // clean static element- only value- empty static element
    paymentForm.reset();
    textMemberName.innerText="-" ;
    textMemberStatus.innerText= "-";
    imgMemberPhoto.src="/resources/images/memberdefault.png";

    if(!userPrivi.privi_insert){
        disableElement();
        buttonSubmit.classList.add("d-none");
        tabpaneForm.classList.remove('show', 'active');
        tabPillForm.classList.remove('show','active')
        tabPaneTable.classList.add('show', 'active');
        tabPillTable.classList.add('show','active')
    }
    // create new payment object for store valid form value
    payment=new Object();

    let paymenttypes= ajaxGetrequest("/paymenttype/alldata");
    fillDataIntoSelect(selectPaymentType,"Select Payment Type",paymenttypes,"name");

    let paymentmethods=ajaxGetrequest("/memberpaymentmethod/alldata");
    fillDataIntoSelect(selectPaymentMethod,"Select Payment Method", paymentmethods,"name");

    starReferenceNoElement.style.display="none";

    setInitial([
        textMemberNo,
        selectPaymentType,
        selectPaymentMethod,
        numberAmount,
        numberReceivedAmount,
        numberBalance,
        textReferenceNumber,
        textNote
    ])

}

const checkPaymentFormErrors=()=>{
    let errors="";
    if(payment.member_id==null){
        textMemberNo.style.borderBottom = "2px solid pink";
        errors += "Please Enter Member No.<br>";
    }
    if(payment.paymenttype_id==null){
        selectPaymentType.style.borderBottom = "2px solid pink";
        errors += "Please Select Payment Type.<br>";
    }
    if(payment.memberpaymentmethod_id==null){
        selectPaymentMethod.style.borderBottom = "2px solid pink";
        errors += "Please Select Payment Method.<br>";
    }
    if(payment.amount==null){
        numberAmount.style.borderBottom = "2px solid pink";
        errors += "Please Enter Amount.<br>";
    }
    if (numberReceivedAmount.value.trim() === "") {
        numberReceivedAmount.style.borderBottom = "2px solid pink";
        errors += "Please Enter Received Amount.<br>";
    }
    return errors;
}

// define function for submit form
const buttonPaymentSubmit = () => {
    console.log(payment);

    // check form has valid value
    let formErrors = checkPaymentFormErrors();
    if (formErrors === "") {
        Swal.fire({
            title: "Confirm Save",
            html: `<p>Are you sure to save this payment record?</p>`,
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
                let postServiceResponse = getHttpServiceRequest("/payment/insert", "POST", payment);
                if (postServiceResponse == "OK") {
                    // save successs
                    Swal.fire({
                        title: "Saved!",
                        text: "Payment record saved successfully.",
                        icon: 'success',

                    });
                    refreshPaymentTable();
                    refreshPaymentForm();
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
                        html: `<p>Payment record could not be saved.</p>
                <p>Details: ${postServiceResponse}</p>`,
                        confirmButtonText: 'OK'
                    });
                }
            } else {
                //get user confirm for form discard
                // can get user confrimation for form refresh
                Swal.fire({
                    title: "Confirm Refresh",
                    text: "Do you need to refresh payment form ?",
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