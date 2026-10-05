
let tableBody = document.querySelector("#tableBodyMember");

const tabpaneForm = document.getElementById("memberTabPillForm");
const tabPaneTable = document.getElementById("memberTabPillTable");
const tabPillForm = document.getElementById("memberFormPill");
const tabPillTable = document.getElementById("memberTablePill");

const  textMemberNicElement = document.getElementById("textMemberNic");
const textMemberEmailElement = document.getElementById("textMemberEmail");
const  textMemberMobileNoElement = document.getElementById("textMemberMobileNo");
let dobElement = document.getElementById("dateDOB");

const  starRequiredNicElement  = document.getElementById("starRequiredNic")
const starRequiredEmailElement  = document.getElementById("starRequiredEmail")
const  starRequiredMobileNoElement  = document.getElementById("starRequiredMobileNo")

const selectGuarantorElement = document.getElementById("selectGuarantor");


window.addEventListener("load", () => {
  // enable tooltip
  $('[data-bs-toggle="tooltip"]').tooltip();
  // get logged user privilege
    userPrivi=getHttpServiceRequest("/userprivilegebymodule?modulename=Member");

  // call table refresh function
  refreshMembertable();
  // call member form refresh function
  refreshMemberForm();
    // call Guarantor form refresh function
  refreshGuarantorForm();
})

// validate select gurantor options --> nic, mobile no

let guarantorNicElement = document.getElementById("guarantorNic")
let guarantorMobileNoElement = document.getElementById("guarantorMobileNo")

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

    // both values required for exact match
    if (nic === "" || mobileno === "") {
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

};

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
    document.getElementById("textNote").disabled=true;

}

// disable guarantor form elements
const disableGuarantorElement=()=>{
    document.getElementById("textGuarantorNic").disabled=true;
    document.getElementById("textGuarantorName").disabled=true;
    document.getElementById("textGuarantorEmail").disabled=true;
    document.getElementById("textGuarantorMobileNo").disabled=true;
    document.getElementById("textGuarantorAddress").disabled=true;
    document.getElementById("selectGuarantorStatus").disabled=true;
}

// refresh member table function
const refreshMembertable = () => {

    // IF table is already DataTable THEN remove it THEN create new DataTable
    if ($.fn.DataTable.isDataTable('#tableMember')) {
        $('#tableMember').DataTable().destroy();
    }

  let members = ajaxGetrequest("/member/alldata");

  // property array
  let displayProperty = [
      { propertyName: "memberphoto", dataType: "image" },
      { propertyName: "memberno", dataType: "string" },
    { propertyName: "name", dataType: "string" },
      {propertyName: "membertype", dataType: "string"},
    { propertyName: getguarantor, dataType: "function" },
    { propertyName: "mobileno", dataType: "string" },
    { propertyName: "address", dataType: "string" },
    { propertyName: getmemberstatus, dataType: "function" },
    // { propertyName: "nic", dataType: "string" },
    // { propertyName: "email", dataType: "string" }
  ];

  //fill data into table function
  fillDataIntoTableEight(
    tableBody,
    members,
    displayProperty,
    refillMemberForm,
      "/resources/images/memberdefault.png"
  );

  buttonSubmitMember.classList.remove("d-none");
  buttonUpdateMember.classList.add("d-none");
  buttonPrintMember.classList.add("d-none");
  buttonDeleteMember.classList.add("d-none");

    $("#tableMember").DataTable({
        responsive: true,
        autoWidth: false
    });
}

//define function of get guarantor data
const getguarantor = (ob) => {
  return ob.guarantor_id.name;
};

// define function of get member status 
const getmemberstatus = (ob) => {
  if (ob.memberstatus_id.name == "Active") {
    return '<i class="fa-solid fa-circle-check fa-lg me-1 " style="color:rgb(0, 189, 72);"></i>';
  }
  if (ob.memberstatus_id.name == "Inactive") {
    return ' <i class="fa-solid fa-circle-xmark fa-lg me-1 " style="color: #ff0000;"></i>';
  }
  if (ob.memberstatus_id.name == "Suspended") {
    return '<i class="fa-solid fa-circle-pause fa-lg me-1" style="color: #FFD43B;"></i>';
  }
  if (ob.memberstatus_id.name == "Blacklisted") {
    return '<i class="fa-solid fa-ban fa-lg me-1" style="color: #75001d;"></i>';
  }
    if (ob.memberstatus_id.name == "Deleted") {
        return '<i class="fa-solid fa-trash fa-lg me-1" style="color: rgb(255, 0, 0);"></i>';
    }
}

// define function for member edit
const refillMemberForm = (dataOb) => {
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
            textNote,
        ]
    )
    console.log(dataOb);

  // shift to tab pane form
  tabpaneForm.classList.add('show', 'active');
  tabPaneTable.classList.remove('show', 'active');
  // shift to  form pill tab
  tabPillForm.classList.add('show', 'active');
  tabPillTable.classList.remove('show', 'active');

  // direct assign - reference variable
  member = getHttpServiceRequest("member/byid/"+dataOb.id);
  oldMember = getHttpServiceRequest("member/byid/"+dataOb.id);

  const memberType= member.membertype;

  if (memberType === "Child") {

                textMemberNicElement.required=false;
                textMemberEmailElement.required=false;
                textMemberMobileNoElement.required=false;

                starRequiredNicElement.style.display = "none";
                starRequiredEmailElement.style.display="none";
                starRequiredMobileNoElement.style.display="none";

            } else if (memberType === "Adult") {

                textMemberNicElement.required=true;
                textMemberEmailElement.required=true;
                textMemberMobileNoElement.required=true;
                starRequiredNicElement.style.display = "block";
                starRequiredEmailElement.style.display="block";
                starRequiredMobileNoElement.style.display="block";
            }

    //member type
    if (member.membertype == "Child") {
        radioChild.checked = true;
    } else {
        radioAdult.checked = true;
    }
// member name
  textMemberName.value = member.name;

  //nic- optional
  if (member.nic != undefined || member.nic != null) {
    textMemberNic.value = member.nic;
  } else {
    textMemberNic.value = "";
  }
// dob
  dateDOB.value = member.dob;

  // email - optional
  if (member.email != undefined || member.email != null) {
    textMemberEmail.value = member.email;
  } else {
    textMemberEmail.value = "";
  }

    // mobile no - optional

    if (member.mobileno != undefined || member.mobileno != null) {
        let mobileNoWithoutZero = member.mobileno.substring(1);
        textMemberMobileNo.value = mobileNoWithoutZero;
    } else {
        textMemberMobileNo.value = "";
    }

    // Clear old options
    selectGuarantor.innerHTML = '<option value="">Select Guarantor</option>';

    if (member.guarantor_id != null) {

        let option = document.createElement("option");
        option.value = JSON.stringify(member.guarantor_id);
        option.text = member.guarantor_id.name;

        selectGuarantor.appendChild(option);
        selectGuarantor.value = JSON.stringify(member.guarantor_id);
    }

// address - required
  textMemberAddress.value = member.address;

  //photo - optional
    if(member.memberphoto!=null){
        imgMemberPhoto.src= atob(member.memberphoto);
    }else{
        imgMemberPhoto.src="/resources/images/memberdefault.png";
    }

  //guarantor type
  if (member.guarantortype == "Guardian") {
    radioGuardian.checked = true;
  } else {
    radioGuarantor.checked = true;
  }

  //note- optional
  if (member.note != undefined || member.note != null) {
    textNote.value = member.note;
  } else {
    textNote.value = "";
  }

  //status 
  selectMemberStatus.value = JSON.stringify(member.memberstatus_id);
    selectMemberStatus.disabled=false;

    if(!userPrivi.privi_update){
        buttonUpdateMember.classList.add("d-none");
    }else {
        buttonUpdateMember.classList.remove("d-none");
    }
    if(!userPrivi.privi_delete){
        buttonDeleteMember.classList.add("d-none");
    }else {
        buttonDeleteMember.classList.remove("d-none");
    }

  // set button visibility
  // only showing update. submit space also not showing
  buttonSubmitMember.classList.add("d-none");
  buttonPrintMember.classList.remove("d-none");

    refillGuarantorForm(member.guarantor_id);
}

// define function for member delete
const deleteMemberRecord = (dataOb) => {
  // confrimation
  member = getHttpServiceRequest("member/byid/"+dataOb.id);

  Swal.fire({
    title: "Confirm Deletion",
    html: `<p>Are you sure to Delete this Member Record ?</p>
          <p>Member Fullname : <strong>${member.name || ''}</strong><br></p>
          <p> Member NIC : <strong>${member.nic || ''}</strong><br></p>
           <p>Member Email : <strong>${member.email || ''}</strong></p>`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ff0000ff",
    cancelButtonColor: "rgb(0, 102, 255)",
    confirmButtonText: "Yes, Delete",
    cancelButtonText: "Cancel",
      reverseButtons: true

  }).then((result) => {
    if (result.isConfirmed) {
      let deleteServiceResponse = getHttpServiceRequest("/member/delete", "DELETE", dataOb)
      if (deleteServiceResponse == "OK") {
        Swal.fire({
          title: "Deleted!",
          text: "Member Record Deleted Successfully.",
          icon: 'success',

        });
        // alert("Member record Deleted Successfully..!");
        //refresh table
        refreshMembertable();
        // refresh member form
          refreshMemberForm();
        // shift to tab pane table
        tabpaneForm.classList.remove('show', 'active');
        tabPaneTable.classList.add('show', 'active');

        // shift to  table pill tab
        tabPillForm.classList.remove('show', 'active');
        tabPillTable.classList.add('show', 'active');
      } else {
        Swal.fire({
          title: 'Deletion Failed',
          html: `<p>Member Record Could not be Deleted.</p>
                <p>Details: ${deleteServiceResponse}</p>`,
          confirmButtonText: 'OK'
        });
        // alert("Fail to Delete Member. Has following errors \n" + deleteServiceResponse);
      }
    } else {
      //refresh table
    }
  })
}

// function for open print modal
const printMemberRecord = (dataOb) => {
  let memberModal_view = new bootstrap.Modal(
    document.getElementById("modalMemberView"), {}
  );
  memberModal_view.show();

    if(dataOb.memberphoto){
        tdMemberPhoto.src= atob(dataOb.memberphoto);
    }else{
        tdMemberPhoto.src="/resources/images/memberdefault.png";
    }
    tdMemberType.innerText= dataOb.membertype;
    tdMemberNo.innerText= dataOb.memberno;
  tdMemberName.innerText = dataOb.name;
  tdMemberNic.innerText = dataOb.nic;
  tdMemberDob.innerText = dataOb.dob;
  tdMemberEmail.innerText = dataOb.email;
  tdMemberMobileNo.innerText = dataOb.mobileno;
  tdMemberAddress.innerText = dataOb.address;
  tdGuarantorType.innerText= dataOb.guarantortype;
  tdMemberGuarantorName.innerText = dataOb.guarantor_id.name;
  tdMemberStatus.innerText = dataOb.memberstatus_id.name;
}

//function for print
const printMember = () => {
  let tab = window.open();
  tab.document.write('<html>'
    + '<head><title>Print Member Record</title>'
    + '<link rel="stylesheet" href="../resources/bootstrap-5.2.3/css/bootstrap.min.css"/>'
    + '</head>'
    + '<body>'
    + divCardPrintMember.outerHTML
    + '</body></html>');

  setInterval(() => {
    tab.stop();
    tab.print();
    tab.close();
  }, 700);
}

const clearFile=()=>{
    imgMemberPhoto.src="/resources/images/memberdefault.png";
    member.memberphoto= null;
}

// form function
const refreshMemberForm = () => {
  // clean static element- only value- empty static element
  memberForm.reset();
    imgMemberPhoto.src="/resources/images/memberdefault.png";

    if(!userPrivi.privi_insert){
        disableElement();
        buttonSubmitMember.classList.add("d-none");
        tabpaneForm.classList.remove('show', 'active');
        tabPillForm.classList.remove('show','active')
        tabPaneTable.classList.add('show', 'active');
        tabPillTable.classList.add('show','active')
    }
  // create new employee oject for store valid form value
  member = new Object();

  // let memberStatus = [
  //   { id: 1, name: "Active" },
  //   { id: 2, name: "Inactive" },
  //   { id: 3, name: "Suspended" },
  //   { id: 4, name: "Blacklisted" }
  // ];

    let memberStatus= ajaxGetrequest("/memberstatus/alldata");
  fillDataIntoSelect(
    selectMemberStatus,
    "Select Member Status",
    memberStatus,
    "name"
  );


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
          textNote,
      ]
  )
    starRequiredNicElement.style.display = "none";

    selectMemberStatus.value=JSON.stringify(memberStatus[0]);
    selectMemberStatus.style.borderBottom="2px solid lightgreen"
    member.memberstatus_id= memberStatus[0];
    selectMemberStatus.disabled=true;
}

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
                // set value into member object relevant property
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
                // leap year check - leap year should be : divisible by 4
                // but years divisible by 100 are NOT leap
                // years divisible by 400 ARE leap
                const isLeap = (y) => (y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0));
                // maximum days in year (leap year - 366) (normal year - 365)
                const maxDay = isLeap(parseInt(dobYear)) ? 366 : 365;
                if (dayOfYear > maxDay) return null;
                //  UTC - avoid timezone problems.
                // Date.UTC(year, month, day)
                // year -2000 , month - jan- dec (0-11) ,
                // new Date(Date.UTC(year, 0, dayOfYear)) -- (Jan 1 + dayOfYear - 1) in UTC.
                const utcDate = new Date(Date.UTC(parseInt(dobYear), 0, dayOfYear));
                // Convert to YYYY-MM-DD
                //gets year from UTC date.
                const yyyy = utcDate.getUTCFullYear();
                // gets month from UTC date.
                // jan as 0 so add 1 , pad start making it with to 01
                const mm = String(utcDate.getUTCMonth() + 1).padStart(2, '0');
                // gets day from UTC date.
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

//****************** START---GUARANTOR ********************//

// refresh guarantor form function
const refreshGuarantorForm = () => {
    // clean static element- only value- empty static element
    guarantorForm.reset();
    // create new employee oject for store valid form value
    guarantor = new Object();

    let guarantorStatus= ajaxGetrequest("/guarantorstatus/alldata");
    fillDataIntoSelect(
        selectGuarantorStatus,
        "Select Guarantor Status",
        guarantorStatus,
        "name"
    );

    if(!userPrivi.privi_insert){
        disableGuarantorElement();
        buttonSubmitGuarantor.classList.add("d-none");
    }else{
        buttonSubmitGuarantor.classList.remove("d-none");
    }

    setInitial([
        textGuarantorName,
        textGuarantorNic,
        textGuarantorEmail,
        textGuarantorMobileNo,
        textGuarantorAddress,
        selectGuarantorStatus
    ])

    selectGuarantorStatus.value=JSON.stringify(guarantorStatus[0]);
    selectGuarantorStatus.style.borderBottom="2px solid lightgreen"
    guarantor.guarantorstatus_id= guarantorStatus[0];
    selectGuarantorStatus.disabled=true;

    buttonUpdateGuarantor.classList.add("d-none");

}

// define function for guarantor edit
const refillGuarantorForm = (dataOb) => {

    setInitial([
        textGuarantorName,
        textGuarantorNic,
        textGuarantorEmail,
        textGuarantorMobileNo,
        textGuarantorAddress,
        selectGuarantorStatus
    ])

    // direct assign - reference variable
    guarantor = getHttpServiceRequest("guarantor/byid/"+ dataOb.id);
    oldGuarantor = getHttpServiceRequest("guarantor/byid/"+ dataOb.id);

    textGuarantorName.value = guarantor.name;
    textGuarantorNic.value = guarantor.nic;

    // email - optional
    if (guarantor.email != undefined || guarantor.email != null) {
        textGuarantorEmail.value = guarantor.email;
    } else {
        textGuarantorEmail.value = "";
    }
    let mobileNoWithoutZero = guarantor.mobileno.substring(1);
    textGuarantorMobileNo.value = mobileNoWithoutZero;

    textGuarantorAddress.value = guarantor.address;

    //guarantor type
    //guarantor status
    selectGuarantorStatus.value = JSON.stringify(guarantor.guarantorstatus_id);

    if(!userPrivi.privi_update){
        buttonUpdateGuarantor.classList.add("d-none");
    }else {
        buttonUpdateGuarantor.classList.remove("d-none");
    }
    // if(!userPrivi.privi_delete){
    //     buttonDeleteGuarantor.classList.add("d-none");
    // }else {
    //     buttonDeleteGuarantor.classList.remove("d-none");
    // }

    // set button visibility
    // only showing update. submit space also not showing
    buttonSubmitGuarantor.classList.add("d-none");
    // buttonPrintGuarantor.classList.remove("d-none");
}

// check guarantor form errors function
const checkGuarantorFormErrors = () => {
    let errors = "";
    if (guarantor.name == null) {
        textGuarantorName.style.borderBottom = "2px solid pink";
        errors += "Please Enter Guarantor Name.<br>";
    }
    if (guarantor.nic == null) {
        textGuarantorNic.style.borderBottom = "2px solid pink";
        errors += "Please Enter Guarantor NIC.<br>";
    }
    if (guarantor.mobileno == null) {
        textGuarantorMobileNo.style.borderBottom = "2px solid pink";
        errors += "Please Enter Mobile Number.<br>";
    }
    if (guarantor.address == null) {
        textGuarantorAddress.style.borderBottom = "2px solid pink";
        errors += "Please Enter Address.<br>";
    }
    if (guarantor.guarantorstatus_id == null) {
        selectGuarantorStatus.style.borderBottom = "2px solid pink";
        errors += "Please Select Guarantor Status.<br>";
    }
    return errors;
}

// guarantor submit  button function
const buttonGuarantorSubmit = () => {

    let formErrors = checkGuarantorFormErrors();
    if (formErrors === "") {
        // form has not any errors
        Swal.fire({
            title: "Confirm Save",
            html: `<p>Are you sure to save this guarantor record?</p>`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ff0000ff",
            cancelButtonColor: "rgb(0, 102, 255)",
            confirmButtonText: "Yes, Save",
            cancelButtonText: "Cancel",
            reverseButtons: true

        }).then((result) => {
            if (result.isConfirmed) {

                let fullGuarantorMobileNo = "0" + textGuarantorMobileNo.value;
                guarantor.mobileno = fullGuarantorMobileNo;
                console.log(guarantor);

                // call post service
                let postServiceResponse = getHttpServiceRequest("/guarantor/insert", "POST", guarantor);
                if (postServiceResponse == "OK") {
                    // save successs
                    Swal.fire({
                        title: "Saved!",
                        text: "Guarantor record saved successfully.",
                        icon: 'success',

                    });

                    const  newguarantor = ajaxGetrequest("/guarantor/bynic/"+guarantor.nic)
                    selectGuarantor.innerHTML = '<option value="">Select Guarantor</option>';
                    let option = document.createElement("option");
                    option.value = JSON.stringify(newguarantor);
                    option.text = newguarantor.name;
                    selectGuarantor.appendChild(option);
                    selectGuarantor.value = JSON.stringify(newguarantor);
                    member.guarantor_id = newguarantor;
                    selectGuarantor.style.borderBottom = "2px solid lightgreen";

                    refreshGuarantorForm();
                    // modal hide
                    $("#modalGuarantorForm").modal("hide");

                } else {
                    // save not completed
                    Swal.fire({
                        title: 'Save Failed',
                        html: `<p>Guarantor record could not be saved.</p>
                <p>Details: ${postServiceResponse}</p>`,
                        confirmButtonText: 'OK'
                    });

                }
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
                        refreshGuarantorForm();
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

// define check update function
const checkGuarantorFormUpdates = () => {
    let updates = "";
    if (guarantor != null && oldGuarantor != null) {
        if (guarantor.name != oldGuarantor.name) {
            updates += "Guarantor Name is changed " + oldGuarantor.name + " into " + guarantor.name + ".<br>";
        }
        if (guarantor.nic != oldGuarantor.nic) {
            updates += "NIC is changed " + oldGuarantor.nic + " into " + guarantor.nic + ".<br>";
        }
        if (guarantor.email != oldGuarantor.email) {
            updates += "Email is changed " + oldGuarantor.email + " into " + guarantor.email + ".<br>";
        }
        if (guarantor.mobileno != oldGuarantor.mobileno) {
            updates += "Mobile Number is changed " + oldGuarantor.mobileno + " into " + guarantor.mobileno + ".<br>";
        }
        if (guarantor.address != oldGuarantor.address) {
            updates += "Address is changed " + oldGuarantor.address + " into " + guarantor.address + ".<br>";
        }
        if (guarantor.guarantorstatus_id.name != oldGuarantor.guarantorstatus_id.name) {
            updates += "Status is changed " + oldGuarantor.guarantorstatus_id.name + " into " + guarantor.guarantorstatus_id.name + ".<br>";
        }
    }
    return updates;
}

// define function for update record
const buttonGuarantorUpdate = () => {
    let fullGuarantorMobileNo = "0" + textGuarantorMobileNo.value;
    guarantor.mobileno = fullGuarantorMobileNo;
    console.log(guarantor);

    // need to check  all required feild with valid value
    let formErrors = checkGuarantorFormErrors();
    if (formErrors == "") {
        let formUpdates = checkGuarantorFormUpdates();
        if (formUpdates == "") {
            //no updates
            Swal.fire({
                title: 'Update Failed',
                text: "Form has not any changes to update.",
                confirmButtonText: 'OK'
            });
        } else {
            // has updates
            Swal.fire({
                title: "Confirm Update",
                html: `<p>Are you sure to update this guarantor record?</p>
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
                    let updateServiceResponse = getHttpServiceRequest("/guarantor/update", "PUT", guarantor);
                    if (updateServiceResponse == "OK") {
                        //user confrim update
                        Swal.fire({
                            title: "Updated!",
                            text: "Guarantor record updated successfully.",
                            icon: 'success',

                        });
                        //refresh form
                        refreshGuarantorForm();
                        // modal hide
                        $("#modalGuarantorForm").modal("hide");

                    } else {
                        // user cancel updates
                        Swal.fire({
                            title: 'Update Failed',
                            html: `<p>Guarantor record could not be updated.</p>
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

//****************** END---GUARANTOR ********************//

// define check form error function
const checkMemberFormErrors = () => {
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
        errors += "Please Enter Date Of Birth.<br>";
    }

    if (member.address == null) {
        textMemberAddress.style.borderBottom = "2px solid pink";
        errors += "Please Enter Address.<br>";
    }
    if (member.guarantor_id == null) {
        errors += "Please Select a Guarantor or OR Add New Guarantor.<br>";
        selectGuarantor.style.borderBottom = "2px solid pink";
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
            errors += "Please Enter NIC.<br>";
        }
        // mobile no required
        if (member.mobileno == null) {
          textMemberMobileNo.style.borderBottom = "2px solid pink";
          errors += "Please Enter Mobile Number.<br>";
        }
    }

  return errors;
}

const buttonMemberSubmit = () => {

  let formErrors = checkMemberFormErrors();
  if (formErrors === "") {
    // form has not any errors
    Swal.fire({
      title: "Confirm Save",
      html: `<p>Are you sure to save this member record?</p>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ff0000ff",
      cancelButtonColor: "rgb(0, 102, 255)",
      confirmButtonText: "Yes, Save",
      cancelButtonText: "Cancel",
        reverseButtons: true

    }).then((result) => {
      if (result.isConfirmed) {
          if (textMemberMobileNo.value) {
              member.mobileno = "0" + textMemberMobileNo.value;
          } else {
              member.mobileno = null;
          }

          console.log(member);

        // call post service
        let postServiceResponse = getHttpServiceRequest("/member/insert", "POST", member);

        if (postServiceResponse == "OK") {
          // save successs
          Swal.fire({
            title: "Saved!",
            text: "Member record saved successfully.",
            icon: 'success',

          });
          refreshMembertable();
          refreshMemberForm();
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
            html: `<p>Member record could not be saved.</p>
                <p>Details: ${postServiceResponse}</p>`,
            confirmButtonText: 'OK'
          });

        }
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

selectGuarantorElement.addEventListener("change", ()=>{
    member.guarantor_id = JSON.parse(selectGuarantor.value);
})
// define check update function
const checkMemberFormUpdates = () => {
  let updates = "";
  if (member != null && oldMember != null) {
      if (member.membertype != oldMember.membertype) {
          updates += "Member Type is changed " + oldMember.membertype + " into " + member.membertype + ".<br>";
      }
    if (member.name != oldMember.name) {
      updates += "Member Name is changed " + oldMember.name + " into " + member.name + ".<br>";
    }
    if (member.nic != oldMember.nic) {
      updates += "NIC is changed " + oldMember.nic + " into " + member.nic + ".<br>";
    }
    if (member.dob != oldMember.dob) {
      updates += "Date Of Birth is changed " + oldMember.dob + " into " + member.dob + ".<br>";
    }
    if (member.email != oldMember.email) {
      updates += "Email is changed " + oldMember.email + " into " + member.email + ".<br>";
    }
    if (member.mobileno != oldMember.mobileno) {
      updates += "Mobile Number is changed " + oldMember.mobileno + " into " + member.mobileno + ".<br>";
    }
    if (member.address != oldMember.address) {
      updates += "Address is changed " + oldMember.address + " into " + member.address + ".<br>";
    }
    if (member.memberstatus_id.name != oldMember.memberstatus_id.name) {
      updates += "Member Status is changed " + oldMember.memberstatus_id.name + " into " + member.memberstatus_id.name + ".<br>";
    }
    if (member.memberphoto != oldMember.memberphoto) {
      updates += "Member Photo is changed "+ ".<br>";
    }
    if (member.guarantortype != oldMember.guarantortype) {
      updates += "Guarantor Type is changed " + oldMember.guarantortype + " into " + member.guarantortype + ".<br>";
    }

    if (member.guarantor_id.name != oldMember.guarantor_id.name) {
          updates += "Guarantor is changed " + oldMember.guarantor_id.name + " into " + member.guarantor_id.name + ".<br>";
      }
    if (member.note != oldMember.note) {
      updates += "Note is changed " + oldMember.note + " into " + member.note + ".<br>";
    }

  }
  return updates;
}

// define function for update record
const buttonMemberUpdate = () => {
    if (textMemberMobileNo.value) {
        member.mobileno = "0" + textMemberMobileNo.value;
    } else {
        member.mobileno = null;
    }
  console.log(member);

  // need to check  all required feild with valid value
  let formErrors = checkMemberFormErrors();
  if (formErrors == "") {
    let formUpdates = checkMemberFormUpdates();
    if (formUpdates == "") {
      //no updates
      Swal.fire({
        title: 'Update Failed',
        text: "Form has not any changes to update.",
        confirmButtonText: 'OK'
      });
    } else {
      // has updates
      Swal.fire({
        title: "Confirm Update",
        html: `<p>Are you sure to update this member record?</p>
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
          let updateServiceResponse = getHttpServiceRequest("/member/update", "PUT", member);
          if (updateServiceResponse == "OK") {
            //user confrim update
            Swal.fire({
              title: "Updated!",
              text: "Member record updated successfully.",
              icon: 'success',

            });
            //refresh form and table
            refreshMembertable();
            refreshMemberForm();
            refreshGuarantorForm();

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
              html: `<p>Member record could not be updated.</p>
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







