const  textMemberNicElement = document.getElementById("textMemberNic");
const textMemberEmailElement = document.getElementById("textMemberEmail");
const  textMemberMobileNoElement = document.getElementById("textMemberMobileNo");

const  starRequiredNicElement  = document.getElementById("starRequiredNic")
const starRequiredEmailElement  = document.getElementById("starRequiredEmail")
const  starRequiredMobileNoElement  = document.getElementById("starRequiredMobileNo")
let dobElement = document.getElementById("dateDOB");

const selectGuarantorElement = document.getElementById("selectGuarantor");
let guarantorNicElement = document.getElementById("guarantorNic")
let guarantorMobileNoElement = document.getElementById("guarantorMobileNo")
const newGurantorRow1= document.getElementById("newGurantorRow1");
const newGurantorRow2= document.getElementById("newGurantorRow2");

//// MEMBERSHIP
const numberMembershipFeeElement = document.getElementById("numberMembershipFee");
const selectMembershipElement = document.getElementById("selectMembership");
const selectStatusElement = document.getElementById("selectStatus");

// PAYMENT ////
let selectPaymentTypeElement = document.getElementById("selectPaymentType")
let paymentMethod= document.getElementById("selectPaymentMethod");
let referenceNoRow= document.getElementById("referenceNoRow");
let textReferenceNumberElement= document.getElementById("textReferenceNumber");
let starReferenceNoElement = document.getElementById("starReferenceNo");
let numberReceivedAmount= document.getElementById("numberReceivedAmount");

window.addEventListener("load",()=>{
     // enable tooltip
  $('[data-bs-toggle="tooltip"]').tooltip();

    userPrivi=getHttpServiceRequest("/userprivilegebymodule?modulename=Member-Registration")
    refreshMemberRegistrationForm();
  // call refresh form function
    refreshGuarantorForm();
    refreshMemberForm();
    refreshNewMembershipForm();
    refreshPaymentForm();

})

// Check if Guarantor Exists
// If exists → use existing guarantor.id
// If not → save new guarantor → get returned guarantor.id

// Save Member
// Set member.guarantor_id = guarantor.id
// Save member
// Get returned member.id

// Save Membership
// Set membership.member_id = member.id
// Save membership

// Save Payment
// Set payment.member_id = member.id
// Save payment


// disable member form elements
const disableElement=()=>{

    document.getElementById("radioChild").disabled=true;
    document.getElementById("radioAdult").disabled=true;
    document.getElementById("textMemberName").disabled=true;
    document.getElementById("textMemberNic").disabled=true;
    document.getElementById("dateDOB").disabled=true;
    document.getElementById("textMemberEmail").disabled=true;
    document.getElementById("textMemberMobileNo").disabled=true;
    document.getElementById("textMemberAddress").disabled=true;
    document.getElementById("selectMemberStatus").disabled=true;
    document.getElementById("filePhoto").disabled=true;
    document.getElementById("radioGuardian").disabled=true;
    document.getElementById("radioGuarantor").disabled=true;
    document.getElementById("guarantorNic").disabled=true;
    document.getElementById("guarantorMobileNo").disabled=true;
    document.getElementById("selectGuarantor").disabled=true;

    document.getElementById("textGuarantorNic").disabled=true;
    document.getElementById("textGuarantorName").disabled=true;
    document.getElementById("textGuarantorEmail").disabled=true;
    document.getElementById("textGuarantorMobileNo").disabled=true;
    document.getElementById("textGuarantorAddress").disabled=true;
    document.getElementById("selectGuarantorStatus").disabled=true;

    selectMembershipElement.disabled=true;
    numberMembershipFeeElement.disabled=true;
    selectStatusElement.disabled=true;

    document.getElementById("selectPaymentType").disabled=true;
    document.getElementById("selectPaymentMethod").disabled=true;
    document.getElementById("numberFullAmount").disabled=true;
    document.getElementById("numberReceivedAmount").disabled=true;
    document.getElementById("numberBalance").disabled=true;
    document.getElementById("textReferenceNumber").disabled=true;

}

const refreshMemberRegistrationForm=()=>{

    if(!userPrivi.privi_insert){
        disableElement();
        buttonSubmit.classList.add("d-none");
    }

}

//////// START MEMBER //////////

// validate select gurantor options --> nic, mobile no

// validate guarantor nic
guarantorNicElement.addEventListener("keyup",()=>{
    const guarantornicValue= guarantorNicElement.value;
    let pattern="(([0-9]{9}[vV])|([0-9]{12}))$";
    const regExpPattern = new RegExp(pattern);
    if(guarantornicValue!=""){
        if(regExpPattern.test(guarantornicValue)){
            guarantorNicElement.style.borderBottom = " 2px solid lightgreen";
        }
        else{
            guarantorNicElement.style.borderBottom = " 2px solid pink";
        }
    }else{
        guarantorNicElement.style.borderBottom = " 2px solid pink";
    }
})

// validate guarantor mobile no
guarantorMobileNoElement.addEventListener("keyup",()=>{
    const guarantormobilenoValue= guarantorMobileNoElement.value;
    let pattern="^[7][01245678][0-9]{7}$";
    const regExpPattern = new RegExp(pattern);
    if(guarantormobilenoValue!=""){
        if(regExpPattern.test(guarantormobilenoValue)){
            guarantorMobileNoElement.style.borderBottom = " 2px solid lightgreen";
        }
        else{
            guarantorMobileNoElement.style.borderBottom = " 2px solid pink";
        }
    }else{
        guarantorMobileNoElement.style.borderBottom = " 2px solid pink";
    }
})

// search existing guarantor
const searchGuarantor = () => {
    let fullGuarantorMobileNoValue = "0" + guarantorMobileNoElement.value;
    //  remove leading spaces ,trailing spaces
    let nic = document.getElementById("guarantorNic").value.trim();
    let mobileno = fullGuarantorMobileNoValue;
    let select = document.getElementById("selectGuarantor");

    // reset select dropdown -- Clear old search results
    select.innerHTML = '<option value="">Select Guarantor</option>';

    // at least values required for exact match
    if (nic === "" && mobileno === "") {
        return;
    }

    // build url
    // nic=200073400244&mobileno=0713935982
    // URLSearchParams -- built-in JavaScript object used to Create, read, and encode URL query parameters safely.
    let params = new URLSearchParams({
        nic: nic,
        mobileno: mobileno
    });

    // receive a list of guarantor objects
    let guarantorSelected = getHttpServiceRequest("guarantor/search?" + params.toString()
    );

    // no results
    if (!guarantorSelected) {
        //  SweetAlert / message
        return;
    }

    let option = document.createElement("option");
    option.value = JSON.stringify(guarantorSelected);
    option.text = guarantorSelected.name;

    select.appendChild(option);
    select.value = JSON.stringify(guarantorSelected);
    member.guarantor_id = guarantorSelected;
    select.style.borderBottom = "2px solid lightgreen";

    newGurantorRow1.style.display="none";
    newGurantorRow2.style.display="none";
    document.getElementById("textGuarantorNic").disabled=true;
    document.getElementById("textGuarantorName").disabled=true;
    document.getElementById("textGuarantorEmail").disabled=true;
    document.getElementById("textGuarantorMobileNo").disabled=true;
    document.getElementById("textGuarantorAddress").disabled=true;
    document.getElementById("selectGuarantorStatus").disabled=true;

};

selectGuarantorElement.addEventListener("change", ()=>{
    member.guarantor_id = JSON.parse(selectGuarantor.value);
})

dobElement.addEventListener("change",()=>{
    const dobValue= dobElement.value;
    const pattern = "[0-9]{4}-[0-9]{2}-[0-9]{2}";
    const regExpPattern = new RegExp(pattern);
    if(dobValue!= ""){
        // value not empty
        if(regExpPattern.test(dobValue)){
            //value is valid
            // check age
            let dobYear = "";
            dobYear = dobValue.substring(0, 4);
            let currentYear = new Date().getFullYear();
            let age = parseInt(currentYear) - parseInt(dobYear);
            if (age >= 5 && age <= 100) {
                member.dob= dobValue;
                if (age < 16) {
                    radioChild.checked = true;
                    member.membertype = "Child";
                    radioGuardian.checked = true;
                    member.guarantortype = "Guardian";
                    radioChild.disabled = true;
                    radioGuardian.disabled = true;
                    radioAdult.disabled = true;
                    radioGuarantor.disabled = true;
                    textMemberNicElement.required = false;
                    textMemberEmailElement.required = false;
                    textMemberMobileNoElement.required = false;
                    starRequiredNicElement.style.display = "none";
                    starRequiredEmailElement.style.display = "none";
                    starRequiredMobileNoElement.style.display = "none";

                    let membershipTypes=ajaxGetrequest("/childmembershiptypes/valid");
                    fillDataIntoSelect(selectMembership,"Select Membership Type",membershipTypes,"name");

                } else {
                    radioAdult.checked = true;
                    member.membertype = "Adult";
                    radioGuarantor.checked = true;
                    member.guarantortype = "Guarantor";
                    radioChild.disabled = true;
                    radioGuardian.disabled = true;
                    radioAdult.disabled = true;
                    radioGuarantor.disabled = true;
                    textMemberNicElement.required = true;
                    textMemberEmailElement.required = false;
                    textMemberMobileNoElement.required = true;
                    starRequiredNicElement.style.display = "block";
                    starRequiredEmailElement.style.display = "none";
                    starRequiredMobileNoElement.style.display = "block";

                    let membershipTypes=ajaxGetrequest("/adultmembershiptypes/valid");
                    fillDataIntoSelect(selectMembership,"Select Membership Type",membershipTypes,"name");
                }
                dobElement.style.borderBottom = " 2px solid lightgreen";
            }else{
                // age is below 3 or above 100
                member.dob= null;
                member.membertype= null;
                member.guarantortype= null;
                dobElement.style.borderBottom = " 2px solid pink";

                radioChild.disabled = false;
                radioGuardian.disabled = false;
                radioAdult.disabled = false;
                radioGuarantor.disabled = false;

                if(radioAdult.checked){
                    radioAdult.checked = false;
                }
                if(radioGuarantor.checked){
                    radioGuarantor.checked = false;
                }
                if(radioChild.checked){
                    radioChild.checked = false;
                }
                if(radioGuardian.checked){
                    radioGuardian.checked = false;
                }
            }
        }else{
            // value is invalid
            member.dob= null;
            member.membertype= null;
            member.guarantortype= null;

            radioChild.disabled = false;
            radioGuardian.disabled = false;
            radioAdult.disabled = false;
            radioGuarantor.disabled = false;

            if(radioAdult.checked){
                radioAdult.checked = false;
            }
            if(radioGuarantor.checked){
                radioGuarantor.checked = false;
            }
            if(radioChild.checked){
                radioChild.checked = false;
            }
            if(radioGuardian.checked){
                radioGuardian.checked = false;
            }

            if(dobElement.required){
                dobElement.style.borderBottom = " 2px solid pink";
            }else {
                dobElement.style.borderBottom = "white";
            }
        }
    }
})

// nic validator , get date of birth from nic
textMemberNicElement.addEventListener("keyup", () => {
    const nicValue = textMemberNicElement.value;
    const pattern = "^(([0-9]{9}[vV])|([0-9]{12}))$";
    const regExpPattern = new RegExp(pattern);
    if (nicValue != "") {
        // not empty
        if (regExpPattern.test(nicValue)) {
            // value is valid
            let dobYear = "";
            let genderValue = "";
            if (nicValue.length == 10) {
                dobYear = "19" + nicValue.substring(0, 2);
                genderValue = nicValue.substring(2, 5);
            } else {
                dobYear = nicValue.substring(0, 4);
                genderValue = nicValue.substring(4, 7);
            }
            // dateDOB.min = dobYear + "-01-01";
            // dateDOB.max = dobYear + "-12-31";
            let currentYear = new Date().getFullYear();
            let age = parseInt(currentYear) - parseInt(dobYear);
            if (age >= 16 && age <= 100) {
                member.nic = nicValue;
                // set value into employee object relevant property
                textMemberNicElement.style.borderBottom = " 2px solid lightgreen";

                let dayOfYear= parseInt(genderValue);
                //generate gender
                if (parseInt(genderValue) >= 500) {
                    //female
                    dayOfYear = dayOfYear-500;
                }else {
                    dayOfYear=dayOfYear;
                }
                //generate dob
                if (dayOfYear <= 0) return null;

                // leap year check
                const isLeap = (y) => (y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0));
                const maxDay = isLeap(parseInt(dobYear)) ? 366 : 365;
                if (dayOfYear > maxDay) return null;

                //  UTC - avoid timezone problems.
                // new Date(Date.UTC(year, 0, dayOfYear)) -- (Jan 1 + dayOfYear - 1) in UTC.
                const utcDate = new Date(Date.UTC(parseInt(dobYear), 0, dayOfYear));
                // Convert to YYYY-MM-DD
                const yyyy = utcDate.getUTCFullYear();
                const mm = String(utcDate.getUTCMonth() + 1).padStart(2, '0');
                const dd = String(utcDate.getUTCDate()).padStart(2, '0');
                member.dob= `${yyyy}-${mm}-${dd}`;
                console.log(member.dob);
                dobElement.value= member.dob;
                dobElement.style.borderBottom="2px solid lightgreen";

                if(age<16){
                    radioChild.checked=true;
                    member.membertype="Child";
                    radioGuardian.checked=true;
                    member.guarantortype="Guardian";
                    radioChild.disabled=true;
                    radioGuardian.disabled=true;
                    radioAdult.disabled=true;
                    radioGuarantor.disabled=true;
                    textMemberNicElement.required=false;
                    textMemberEmailElement.required=false;
                    textMemberMobileNoElement.required=false;
                    starRequiredNicElement.style.display = "none";
                    starRequiredEmailElement.style.display="none";
                    starRequiredMobileNoElement.style.display="none";

                    let membershipTypes=ajaxGetrequest("/childmembershiptypes/valid");
                    fillDataIntoSelect(selectMembership,"Select Membership Type",membershipTypes,"name");

                }else{
                    radioAdult.checked=true;
                    member.membertype="Adult";
                    radioGuarantor.checked=true;
                    member.guarantortype="Guarantor";
                    radioChild.disabled=true;
                    radioGuardian.disabled=true;
                    radioAdult.disabled=true;
                    radioGuarantor.disabled=true;
                    textMemberNicElement.required=true;
                    textMemberEmailElement.required=false;
                    textMemberMobileNoElement.required=true;
                    starRequiredNicElement.style.display = "block";
                    starRequiredEmailElement.style.display="none";
                    starRequiredMobileNoElement.style.display="block";

                    let membershipTypes=ajaxGetrequest("/adultmembershiptypes/valid");
                    fillDataIntoSelect(selectMembership,"Select Membership Type",membershipTypes,"name");
                }
            }else{
                // age is below 16 or above 100
                member.nic= null;
                member.membertype= null;
                member.guarantortype= null;
                textMemberNicElement.style.borderBottom = " 2px solid pink";
                dobElement.value= null;
                dobElement.style.borderBottom = "white";

                radioChild.disabled = false;
                radioGuardian.disabled = false;
                radioAdult.disabled = false;
                radioGuarantor.disabled = false;

                if(radioAdult.checked){
                    radioAdult.checked = false;
                }
                if(radioGuarantor.checked){
                    radioGuarantor.checked = false;
                }
                if(radioChild.checked){
                    radioChild.checked = false;
                }
                if(radioGuardian.checked){
                    radioGuardian.checked = false;
                }
            }


        } else {
            // value is in valid
            member.nic = null;
            member.dob == null;
            textMemberNicElement.style.borderBottom = "2px solid pink";
            dobElement.value= null;
            dobElement.style.borderBottom = "white";
            radioChild.disabled = false;
            radioGuardian.disabled = false;
            radioAdult.disabled = false;
            radioGuarantor.disabled = false;

            if(radioAdult.checked){
                radioAdult.checked = false;
            }
            if(radioGuarantor.checked){
                radioGuarantor.checked = false;
            }
            if(radioChild.checked){
                radioChild.checked = false;
            }
            if(radioGuardian.checked){
                radioGuardian.checked = false;
            }
        }
    } else {
        // value empty
        member.nic = null;
        member.dob == null;
        if (textMemberNicElement.required) {
            textMemberNicElement.style.borderBottom = " 2px solid pink";
        } else {
            textMemberNicElement.style.borderBottom = "white";
        }
    }
});

//////// END MEMBER //////////


///// START MEMBERSHIP //////
// get fee according to membership type
selectMembershipElement.addEventListener("change", ()=>{
    let membershipType = JSON.parse(selectMembership.value);
    membership.membershiptype_id = membershipType;

    // binding to membership object
    membership.fee= membershipType.membershipfee;
    //appear on ui
    numberMembershipFee.value= membership.fee;
    // set valid color
    numberMembershipFee.style.borderBottom="2px solid lightgreen";

    payment.amount=membershipType.membershipfee;
    numberFullAmount.value= payment.amount;
    numberFullAmount.style.borderBottom="2px solid lightgreen";


})

// get end date according to start date and duration of membership type
const getEndDate=()=>{
    if (!selectMembership.value) return;
    let membershipType = JSON.parse(selectMembership.value);
    let duration = Number(membershipType.membershipduration);
    console.log(duration);
    // start date value as Date object
    let startDate= getDateValue(new Date());
    membership.startdate= startDate;
    // end sate value as Date  object and equal to start date
    let endDate = new Date(startDate);

    // value set to end date= start date + duration
    endDate.setDate(endDate.getDate()+duration-1);
    //Converts the end date to YYYY-MM-DD format
    membership.enddate=  getDateValue(endDate);
}


///// END MEMBERSHIP /////

////// START PAYMENT //////

paymentMethod.addEventListener("change",()=>{
    const selectedData= JSON.parse(selectPaymentMethod.value);
    if(selectedData.name==="Cash"){
        textReferenceNumberElement.required= false;
        starReferenceNoElement.style.display="none";
    }else {
        textReferenceNumberElement.required= true;
        starReferenceNoElement.style.display="block";
    }
})

const validateReceivedAmount=()=>{
    let amountValue= parseFloat(numberFullAmount.value);
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
    let amountValue= numberFullAmount.value;
    let receivedAmountValue= numberReceivedAmount.value;
    let balanceValue= (parseFloat(receivedAmountValue)-parseFloat(amountValue)).toFixed(2)
    numberBalance.value= balanceValue;
    numberBalance.style.borderBottom="2px solid lightgreen";
    payment.balance= balanceValue;
}

//////// END PAYMENT //////

const refreshGuarantorForm =()=>{
    guarantorForm.reset();

    selectGuarantorElement.innerHTML = '<option value="">Select Guarantor</option>';
    selectGuarantorElement.value = "";

    newGurantorRow1.style.display="flex";
    newGurantorRow2.style.display="flex";

    textGuarantorNic.disabled = false;
    textGuarantorName.disabled = false;
    textGuarantorEmail.disabled = false;
    textGuarantorMobileNo.disabled = false;
    textGuarantorAddress.disabled = false;
    selectGuarantorStatus.disabled = false;

    // create new guarantor object for store valid form value
    guarantor = new Object();

    let guarantorStatus= ajaxGetrequest("/guarantorstatus/alldata");
    fillDataIntoSelect(
        selectGuarantorStatus,
        "Select Guarantor Status",
        guarantorStatus,
        "name"
    );

    setInitial([
        textGuarantorName,
        textGuarantorNic,
        textGuarantorEmail,
        textGuarantorMobileNo,
        textGuarantorAddress
    ])
    selectGuarantorStatus.value=JSON.stringify(guarantorStatus[0]);
    selectGuarantorStatus.style.borderBottom="2px solid lightgreen"
    guarantor.guarantorstatus_id= guarantorStatus[0];
    selectGuarantorStatus.disabled=true;
}

const clearFile=()=>{
    imgMemberPhoto.src="/resources/images/memberdefault.png";
    member.memberphoto= null;
}

const refreshMemberForm =()=>{
    // clean static element- only value- empty static element
    memberForm.reset();
    imgMemberPhoto.src="/resources/images/memberdefault.png";

    // create new member oject for store valid form value
    member = new Object();

    setInitial(
        [
            textMemberName,
            textMemberNic,
            dateDOB,
            textMemberEmail,
            textMemberMobileNo,
            textMemberAddress,
            selectMemberStatus,
            filePhoto,
            guarantorNic,
            guarantorMobileNo,
            selectGuarantor,
        ]
    )


    starRequiredNicElement.style.display = "none";

    let memberStatus= ajaxGetrequest("/memberstatus/alldata");
    fillDataIntoSelect(
        selectMemberStatus,
        "Select Member Status",
        memberStatus,
        "name"
    );
    selectMemberStatus.value= JSON.stringify(memberStatus[0]);
    selectMemberStatus.style.borderBottom="2px solid lightgreen";
    // binding to book object
    member.memberstatus_id=memberStatus[0];
    selectMemberStatus.disabled=true;
}

const refreshNewMembershipForm =()=>{
    membershipForm.reset();

    // create new membership object for store valid form value
    membership= new Object;

    setInitial([
        selectMembershipElement,
        numberMembershipFeeElement,
        selectStatusElement
    ])

    let membershipStatuses= ajaxGetrequest("/membershipstatus/alldata");
    fillDataIntoSelect(selectStatus,"Select Membership Status",membershipStatuses,"name");
    // auto select status - fill default value for membership status - Active
    selectStatusElement.value= JSON.stringify(membershipStatuses[0]);
    selectStatusElement.style.borderBottom="2px solid lightgreen";
    // binding to book object
    membership.membershipstatus_id=membershipStatuses[0];
    selectStatusElement.disabled=true;

    let membershipTypes=ajaxGetrequest("/membershiptype/valid");
    fillDataIntoSelect(selectMembership,"Select Membership Type",membershipTypes,"name");

    // setting membership category/ registration type as new
    let membershipCategories= ajaxGetrequest("/membershipcategory/alldata");
    membership.membershipcategory_id=membershipCategories[0];


}

const refreshPaymentForm =()=>{
    paymentForm.reset();
    // create new payment object for store valid form value
    payment=new Object();

    setInitial([
        selectPaymentType,
        selectPaymentMethod,
        numberFullAmount,
        numberReceivedAmount,
        numberBalance,
        textReferenceNumber
    ])

    let paymenttypes= ajaxGetrequest("/paymenttype/alldata");
    fillDataIntoSelect(selectPaymentType,"Select Payment Type",paymenttypes,"name");
    selectPaymentTypeElement.value= JSON.stringify(paymenttypes[0]);
    selectPaymentTypeElement.style.borderBottom="2px solid lightgreen";
    payment.paymenttype_id= paymenttypes[0];
    selectPaymentTypeElement.disabled=true;

    let paymentmethods=ajaxGetrequest("/memberpaymentmethod/alldata");
    fillDataIntoSelect(selectPaymentMethod,"Select Payment Method", paymentmethods,"name");
    starReferenceNoElement.style.display="none";


}

const checkGuarantorFormErrors = () => {
    let errors = "";

    // If no existing guarantor selected
    if (selectGuarantorElement.value === "") {

        // If user also didn't fill new guarantor fields
        if (!guarantor.name &&
            !guarantor.nic &&
            !guarantor.mobileno &&
            !guarantor.address) {

            errors += "Please Select Guarantor or Enter New Guarantor Details.<br>";
            return errors;
        }

        // Validate new guarantor fields
        if (!guarantor.name) {
            textGuarantorName.style.borderBottom = "2px solid pink";
            errors += "Please Enter Guarantor Name.<br>";
        }

        if (!guarantor.nic) {
            textGuarantorNic.style.borderBottom = "2px solid pink";
            errors += "Please Enter Guarantor NIC.<br>";
        }

        if (!guarantor.mobileno) {
            textGuarantorMobileNo.style.borderBottom = "2px solid pink";
            errors += "Please Enter Guarantor Mobile Number.<br>";
        }

        if (!guarantor.address) {
            textGuarantorAddress.style.borderBottom = "2px solid pink";
            errors += "Please Enter Guarantor Address.<br>";
        }
        if (guarantor.guarantorstatus_id == null) {
            selectGuarantorStatus.style.borderBottom = "2px solid pink";
            errors += "Please Select Guarantor Status.<br>";
        }
    }

    return errors;
};

const checkMemberFormErrors=()=>{
    let errors = "";
    if(member.membertype==null){
        errors += "Please Select Member Type.<br>";
    }
    if (member.name == null) {
        textMemberName.style.borderBottom = "2px solid pink";
        errors += "Please Enter Member Name.<br>";
    }
    if (member.dob == null) {
        dateDOB.style.borderBottom = "2px solid pink";
        errors += "Please Enter Member Date Of Birth.<br>";
    }

    if (member.address == null) {
        textMemberAddress.style.borderBottom = "2px solid pink";
        errors += "Please Enter Member Address.<br>";
    }

    if (member.memberstatus_id == null) {
        selectMemberStatus.style.borderBottom = "2px solid pink";
        errors += "Please Select Member Status.<br>";
    }
    // required fields according to member type
    if(member.membertype=="Adult"){

        //nic required
        if (member.nic == null) {
            textMemberNic.style.borderBottom = "2px solid pink";
            errors += "Please Enter Member NIC.<br>";
        }
        // mobile no required
        if (member.mobileno == null) {
            textMemberMobileNo.style.borderBottom = "2px solid pink";
            errors += "Please Enter Member Mobile Number.<br>";
        }
    }

    return errors;
}

const checkNewMembershipFormErrors=()=>{
    let errors = "";
    if(membership.membershiptype_id==null){
        selectMembershipElement.style.borderBottom = "2px solid pink";
        errors += "Please Select Membership Type.<br>";
    }
    return errors;

}

const checkPaymentFormErrors=()=>{
    let errors = "";
    if(payment.memberpaymentmethod_id==null){
        selectPaymentMethod.style.borderBottom = "2px solid pink";
        errors += "Please Select Payment Method.<br>";
    }
    if (numberReceivedAmount.value.trim() === "") {
        numberReceivedAmount.style.borderBottom = "2px solid pink";
        errors += "Please Enter Received Amount.<br>";
    }
    return errors;
}

const buttonSubmitForm=()=>{

    if(member.guarantor_id==null){
        member.guarantor_id= guarantor;
    }
    payment.membership_id= membership;
    payment.member_id= member;

    let errors="";
    errors += checkMemberFormErrors();
    errors += checkGuarantorFormErrors();
    errors += checkNewMembershipFormErrors();
    errors += checkPaymentFormErrors();
    if (errors !== "") {
        // form has errors
        Swal.fire({
            title: 'Save Failed',
            html: `<p>Form has Following Errors.</p>
                <p>${errors}</p>`,
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }
        // form has not any errors
        Swal.fire({
            title: "Confirm Save",
            html: `<p>Are you sure to save this member registration form?</p>`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ff0000ff",
            cancelButtonColor: "rgb(0, 102, 255)",
            confirmButtonText: "Yes, Save",
            cancelButtonText: "Cancel",
            reverseButtons: true

        }).then((result) => {

            if (result.isConfirmed) {
                if(textGuarantorMobileNo.value){
                    guarantor.mobileno ="0" +textGuarantorMobileNo.value;
                }else{
                    guarantor.mobileno=null;
                }

                if (textMemberMobileNo.value) {
                    member.mobileno = "0" + textMemberMobileNo.value;
                } else {
                    member.mobileno = null;
                }

                console.log(payment);
                let paymentObject = getHttpServiceRequest("/memberregistration/insert", "POST", payment);
                if (paymentObject !=="OK") {
                    Swal.fire({
                        title: "Payment Save Failed",
                        icon: "warning",
                        html: `<p>Details: ${paymentObject}</p>`,
                        confirmButtonText: 'OK',
                    });
                    return;
                }
                // save successs
                Swal.fire({
                    title: "Success!",
                    text: "All records saved successfully.",
                    icon: 'success',

                });

                // Refresh all forms
                refreshGuarantorForm();
                refreshMemberForm();
                refreshNewMembershipForm();
                refreshPaymentForm();


            } else {
                //get user confirm for form discard
                // can get user confrimation for form refresh
                Swal.fire({
                    title: "Confirm Refresh",
                    text: "Do you need to refresh member form ?",
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

                });

            }
        });
};