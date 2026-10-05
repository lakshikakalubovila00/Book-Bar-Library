const tabpaneForm = document.getElementById("employeeTabPillForm");
const tabPaneTable = document.getElementById("employeeTabPillTable");
const tabPillForm = document.getElementById("employeeFormPill");
const tabPillTable = document.getElementById("employeeTablePill");

let tableBody = document.querySelector("#tableBodyEmployee");
const selectEmployeeStatusElement= document.getElementById("selectEmployeeStatus");

// browser load event call
window.addEventListener("load", () => {
  // enable tooltip
  $('[data-bs-toggle="tooltip"]').tooltip();

  userPrivi=getHttpServiceRequest("/userprivilegebymodule?modulename=Employee")
  //call table refresh function
  refreshEmployeetable();
  //call form refresh function
  refreshEmployeeForm();
})

const disableElement=()=>{
        document.getElementById("textFullName").disabled=true;
        document.getElementById("selectCallingName").disabled=true;
        document.getElementById("textNic").disabled=true;
        document.getElementById("radioMale").disabled=true;
        document.getElementById("radioFemale").disabled=true;
        document.getElementById("dob").disabled=true;
        document.getElementById("civilStatus").disabled=true;
        document.getElementById("textEmail").disabled=true;
        document.getElementById("textMobileNo").disabled=true;
        document.getElementById("textLandNo").disabled=true;
        document.getElementById("selectDesignation").disabled=true;
        document.getElementById("btnAddNewDesigantion").disabled=true;
        document.getElementById("selectEmployeeStatus").disabled=true;
        document.getElementById("textAddress").disabled=true;
        document.getElementById("textNote").disabled=true;
}

// ** start Table functions

const refreshEmployeetable = () => {

    // IF table is already DataTable THEN remove it THEN create new DataTable
    if ($.fn.DataTable.isDataTable('#tableEmployee')) {
        $('#tableEmployee').DataTable().destroy();
    }
    //data array
  /* let employees=[
       {
           id:1,
           fullname:"Lakshika Kalubovila",
           callingname:"Lakshika",
           nic :"200073400244",
           gender :"Female",
           dob :"2000-08-21",
           civilstatus :"Single",
           email:"lakshika@gmail.com",
           address :"194/2, Uggalla, Padukka.",
           note:"Hi",
           designation_id: { id: 1, name: "Manager" },
           employeestatus_id: { id: 1, name: "Working" },
           mobilenumber:"0713935982",
           landnumber:"0123456789"
       }
   ]; */
  let employees = ajaxGetrequest("/employee/list");

  // property array
  let displayProperty = [
      { propertyName: "employeephoto", dataType: "image" },
      { propertyName: "empno", dataType: "string" },
    { propertyName: "fullname", dataType: "string" },
    { propertyName: "callingname", dataType: "string" },
    { propertyName: "nic", dataType: "string" },
    { propertyName: "email", dataType: "string" },
    { propertyName: "mobilenumber", dataType: "string" },
    { propertyName: getdesignation, dataType: "function" },
    { propertyName: getemployeestatus, dataType: "function" }
  ];

  //fill data into table function
  fillDataIntoTableEight(
    tableBody,
    employees,
    displayProperty,
    refillEmployeeForm,
      "/resources/images/empphotodefault.png"
  );

  buttonSubmit.classList.remove("d-none");
  buttonUpdate.classList.add("d-none");
  buttonPrint.classList.add("d-none");
  buttonDelete.classList.add("d-none");


    $("#tableEmployee").DataTable({
        responsive: true,
        autoWidth: false
    });

}

//define function of get designation data
const getdesignation = (ob) => {
  return ob.designation_id.name;
};

//define function of get employee status
const getemployeestatus = (ob) => {
  if (ob.employeestatus_id.name == "Working") {
    return '<i class="fa-solid fa-user-check fa-lg" style="color: #0062ff;"></i>';
  }
  if (ob.employeestatus_id.name == "Resign") {
    return '<i class="fa-solid fa-user-minus fa-lg" style="color: #ffae00;"></i>';
  }
  //pic for fired
    if (ob.employeestatus_id.name == "Fired") {
        return '<i class="fa-solid fa-user-minus fa-lg" style="color: #ff6a00;"></i>';
    }
  if (ob.employeestatus_id.name == "Deleted") {
    return '<i class="fa-solid fa-trash fa-lg me-1" style="color: rgb(255, 0, 0);"></i>';
  }
};

// define function for employee edit
const refillEmployeeForm = (dataOb) => {
    setInitial([
        textFullName,
        selectCallingName,
        textNic,
        dob,
        civilStatus,
        textEmail,
        textMobileNo,
        textLandNo,
        selectDesignation,
        selectEmployeeStatus,
        textAddress,
        textNote
    ]);

  // shift to tab pane form
  tabpaneForm.classList.add('show', 'active');
  tabPaneTable.classList.remove('show', 'active');
  // shift to  form pill tab
  tabPillForm.classList.add('show', 'active');
  tabPillTable.classList.remove('show', 'active');

  // direct assign - reference variable
  employee = getHttpServiceRequest("/employee/byid/"+ dataOb.id) //path param
  oldEmployee = getHttpServiceRequest("/employee/byid/" + dataOb.id)

  textFullName.value = employee.fullname;

  if(employee.employeephoto!=null){
      imgEmpPhoto.src= atob(employee.employeephoto);
  }else{
      imgEmpPhoto.src="/resources/images/empphotodefault.png";
  }
  //generate calling name
  let fullnameParts = textFullName.value.split(" ");
  selectCallingName.innerHTML = "";
  fullnameParts.forEach((namePart) => {
    let option = document.createElement("option");
    option.value = namePart;
    option.innerText = namePart;
    selectCallingName.appendChild(option);
  });
  //selectCallingName
  selectCallingName.value = employee.callingname;

  textNic.value = employee.nic;
  dob.value = employee.dob;
  civilStatus.value = employee.civilstatus;
  textEmail.value = employee.email;
  textAddress.value = employee.address;

    let mobileNoWithoutZero = employee.mobilenumber.substring(1);
    textMobileNo.value = mobileNoWithoutZero;

  //land no- optional
  if (employee.landnumber != undefined || employee.landnumber != null) {
      let landNoWithoutZero = employee.landnumber.substring(1);
    textLandNo.value = landNoWithoutZero;
  } else {
    textLandNo.value = "";
  }

  //note- optional
  if (employee.note != undefined || employee.note != null) {
    textNote.value = employee.note;
  } else {
    textNote.value = "";
  }

  // gender
  if (employee.gender == "Male") {
    radioMale.checked = true;
  } else {
    radioFemale.checked = true;
  }

  //designation
  selectDesignation.value = JSON.stringify(employee.designation_id);

  //employee status
  selectEmployeeStatus.value = JSON.stringify(employee.employeestatus_id);
  selectEmployeeStatus.disabled= false;


    if(!userPrivi.privi_update){
        buttonUpdate.classList.add("d-none");
    }else {
        buttonUpdate.classList.remove("d-none");
    }
    if(!userPrivi.privi_delete){
        buttonDelete.classList.add("d-none");
    }else {
        buttonDelete.classList.remove("d-none");
    }

    // set button visibility
  // only showing update. submit space also not showing
  buttonSubmit.classList.add("d-none");
  buttonPrint.classList.remove("d-none");

}

// define function for employee delete
const deleteEmployeeRecord = (dataOb) => {
  //  confirmation
    employee = getHttpServiceRequest("/employee/byid/"+ dataOb.id)
    Swal.fire({
    title: "Confirm Deletion",
    html: `<p>Are you sure to Delete this Employee Record ?</p>
          <p>Employee Fullname : <strong>${employee.fullname || ''}</strong><br></p>
           <p>Employee NIC : <strong>${employee.nic || ''}</strong><br></p>
           <p>Employee Email : <strong>${employee.email || ''}</strong></p>`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ff0000ff",
    cancelButtonColor: "rgb(0, 102, 255)",
    confirmButtonText: "Yes, Delete",
    cancelButtonText: "Cancel",
        reverseButtons :true

  }).then((result) => {
    if (result.isConfirmed) {
      let deleteServiceResponse = getHttpServiceRequest("/employee/delete", "DELETE", dataOb)
      if (deleteServiceResponse == "OK") {
        Swal.fire({
          title: "Deleted!",
          text: "Employee Record Deleted Successfully.",
          icon: 'success',

        });
        // alert("Employee record Deleted Successfully..!");
        //refresh table
        refreshEmployeetable();
        refreshEmployeeForm();
        // shift to tab pane table
        tabpaneForm.classList.remove('show', 'active');
        tabPaneTable.classList.add('show', 'active');

        // shift to  table pill tab
        tabPillForm.classList.remove('show', 'active');
        tabPillTable.classList.add('show', 'active');
      } else {
        Swal.fire({
          title: 'Deletion Failed',
          html: `<p>Employee record could not be deleted.</p>
                <p>Details: ${deleteServiceResponse}</p>`,
          confirmButtonText: 'OK'
        });
        // alert("Fail to Delete Employee. Has following errors \n" + deleteServiceResponse);
      }
    } else {
      //refresh table
    }
  })
}

// define function for employee print
const printEmployeeRecord = (dataOb) => {
  let employeeModal_view = new bootstrap.Modal(
    document.getElementById("modalEmployeeView"),
    {}
  );
  employeeModal_view.show();
    employee = getHttpServiceRequest("/employee/byid/"+ dataOb.id);
    if(dataOb.employeephoto){
        tdPhoto.src= atob(dataOb.employeephoto);
    }else{
        tdPhoto.src="/resources/images/empphotodefault.png";
    }
    tdfullname.innerText = dataOb.fullname;
  tdcallingname.innerText = dataOb.callingname;

  tdnic.innerText = dataOb.nic;
  tdgender.innerText = dataOb.gender;
  tddob.innerText = dataOb.dob;
  tdcivilstatus.innerText = dataOb.civilstatus;

  tdemail.innerText = dataOb.email;
  tdaddress.innerText = dataOb.address;
  if(dataOb.note != undefined){
      tdnote.innerText = dataOb.note;
  }

  tddesignation.innerText = dataOb.designation_id.name;
  tdstatus.innerText = dataOb.employeestatus_id.name;

if(dataOb.landnumber!= undefined){
    tdlandnumber.innerText = dataOb.landnumber;
}
  tdmobilenumber.innerText = dataOb.mobilenumber;



}

const printEmployee = () => {
  let tab = window.open();
  tab.document.write('<html>'
    + '<head><title>Print Employee Record</title>'
    + '<link rel="stylesheet" href="../resources/bootstrap-5.2.3/css/bootstrap.min.css"/>'
    + '</head>'
    + '<body>'
    + divCardPrintEmployee.outerHTML
    + '</body></html>');

  setInterval(() => {
    tab.stop();
    tab.print();
    tab.close();
  }, 700);
}

const clearFile=()=>{
    imgEmpPhoto.src="/resources/images/empphotodefault.png";
    employee.employephoto= null;
}

//Form Function Start
const refreshEmployeeForm = () => {

  // clean static element- only value- empty static element
  employeeForm.reset();
    imgEmpPhoto.src="/resources/images/empphotodefault.png";

  if(!userPrivi.privi_insert){
      disableElement();
      buttonSubmit.classList.add("d-none");
      tabpaneForm.classList.remove('show', 'active');
      tabPillForm.classList.remove('show','active')
      tabPaneTable.classList.add('show', 'active');
      tabPillTable.classList.add('show','active')
  }

  // create new employee object for store valid form value
  employee = new Object();

  //need to refresh dynamic element
  // dynamic dropdown
  /* let designations=[
    { id: 1, name: "Manager" },
    { id: 2, name: "Librarian" },
    { id: 3, name: "Assistant Librarian" },
    { id: 4, name: "Store Manager" }
  ]; */

  let designations = ajaxGetrequest("/designation/alldata");

  fillDataIntoSelect(
    selectDesignation,
    "Please Select Designation",
    designations,
    "name"
  );

  /*let employeeStatus=[
    { id: 1, name: "Working" },
    { id: 2, name: "Resign" },
  ];*/

  let employeeStatus = ajaxGetrequest("/employeestatus/alldata");


  fillDataIntoSelect(
      selectEmployeeStatusElement,
    "Please Select Employee Status",
    employeeStatus,
    "name"
  );

  setInitial([
      textFullName,
      selectCallingName,
      textNic,
      dob,
      civilStatus,
      textEmail,
      textMobileNo,
      textLandNo,
      selectDesignation,
      selectEmployeeStatus,
      textAddress,
      textNote
  ]);
  selectCallingName.innerHTML = "";

    // auto select status - fill default value for employee status- working
    selectEmployeeStatusElement.value= JSON.stringify(employeeStatus[0]);
    // binding to employee object
    employee.employeestatus_id=employeeStatus[0];
    selectEmployeeStatusElement.disabled=true;
    //set valid color
    selectEmployeeStatusElement.style.borderBottom="2px solid lightgreen";
}

// full name validator , generate calling name from full name
let textElementFullname = document.querySelector("#textFullName");
let selectCallingName = document.querySelector("#selectCallingName");

textElementFullname.addEventListener("keyup", () => {

  const fullnameValue = textElementFullname.value;

  let pattern = "^([A-Z][a-z]{2,20}[\\s]){1,20}([d][e][\\s]){0,1}([A-Z][a-z]{2,20})$";
  
  const regExpPattern = new RegExp(pattern);
  if (fullnameValue != "") {
    // value not empty
    if (regExpPattern.test(fullnameValue)) {
      // value is valid
      textElementFullname.style.borderBottom = " 2px solid lightgreen";
      // set value into employee object relevent property
      employee.fullname = fullnameValue;
      
      //generate callingname

      
      selectCallingName.innerHTML = "";
      let optionmsg = document.createElement("option");
      optionmsg.value="";
      optionmsg.innerText = "Select Calling Name";
      optionmsg.selected = "selected";
      optionmsg.disabled = "disabled";
      selectCallingName.appendChild(optionmsg);

      let fullnameParts = fullnameValue.split(" ");

      fullnameParts.forEach((namePart) => {
        let option = document.createElement("option");
        option.value = namePart; // element value
        option.innerText = namePart; // display value
        if (namePart.length > 2) {
          selectCallingName.appendChild(option);

        }
      });

    } else {
      //value is in-valid
      
      textElementFullname.style.borderBottom = "2px solid pink";
      employee.fullname = null;
      employee.callingname = null;
    }

  } else {
    //value is empty
    employee.fullname = null;
    employee.callingname = null;
    if (textElementFullname.required) {
      textElementFullname.style.borderBottom = "2px solid pink";
    } else {
      textElementFullname.style.borderBottom = "white";
    }
  }
});

// Nic validator , auto select gender 

let textElementNic = document.querySelector("#textNic");
let dobElement = document.querySelector("#dob");

textElementNic.addEventListener("keyup", () => {

  const nicValue = textElementNic.value;
  const pattern = "^(([0-9]{9}[vV])|([0-9]{12}))$";
  const regExpPattern = new RegExp(pattern);
  if (nicValue != "") {
    // value not empty
    if (regExpPattern.test(nicValue)) {
      // value is valid
      //check age
      let dobYear = "";
      let genderValue = "";
      if (nicValue.length == 10) {
        dobYear = "19" + nicValue.substring(0, 2);
        genderValue = nicValue.substring(2, 5);
      } else {
        dobYear = nicValue.substring(0, 4);
        genderValue = nicValue.substring(4, 7);
      }
      // dob.min = dobYear + "-01-01";
      // dob.max = dobYear + "-12-31";
      let currentYear = new Date().getFullYear();
      let age = parseInt(currentYear) - parseInt(dobYear);
      if (age >= 18 && age <= 60) {
        employee.nic = nicValue;
        // set value into employee object relevent property
        textElementNic.style.borderBottom = " 2px solid lightgreen";

        let dayOfYear= parseInt(genderValue);
        //generate gender
        if (parseInt(genderValue) >= 500) {
          //female
          radioFemale.checked = true;
          employee.gender = "Female";
          dayOfYear = dayOfYear-500;
            radioFemale.disabled=true;
            radioMale.disabled=true;
        } else {
          radioMale.checked = true;
          employee.gender = "Male";
            radioFemale.disabled=true;
            radioMale.disabled=true;
        }
        //generate dob
          if (dayOfYear <= 0) return null;

          // leap year check
          const isLeap = (y) => (y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0));
          const maxDay = isLeap(parseInt(dobYear)) ? 366 : 365;
          if (dayOfYear > maxDay) return null;
            // UTC -- Coordinated Universal Time (primary time standard in world)
          //UTC Date      : 2025-12-09
          // Sri Lanka Date: 2025-12-10  (after midnight local time)
          //  UTC - avoid timezone problems
          // new Date(Date.UTC(year, 0, dayOfYear)) -- (Jan 1 + dayOfYear - 1) in UTC.
          const utcDate = new Date(Date.UTC(parseInt(dobYear), 0, dayOfYear));
          // Convert to YYYY-MM-DD
          const yyyy = utcDate.getUTCFullYear();
          const mm = String(utcDate.getUTCMonth() + 1).padStart(2, '0');
          const dd = String(utcDate.getUTCDate()).padStart(2, '0');
          employee.dob= `${yyyy}-${mm}-${dd}`;
          console.log(employee.dob);
          dobElement.value= employee.dob;
      }
    } else {
      //value is in-valid
      employee.nic = null;
      employee.gender = null;
      employee.dob = null;
      textElementNic.style.borderBottom = " 2px solid pink";

    }
  } else {
    //value is empty
    employee.nic = null;
    employee.gender = null;
    employee.dob = null;

    if (textElementNic.required) {
      textElementNic.style.borderBottom = " 2px solid pink";
    } else {
      textElementNic.style.borderBottom = "white";
    }
  }
});

// define check form error function

const checkEmployeeFormErrors = () => {
  // let errors=""; adding errors to this with \n create one piece of data and can't access individually
  // used array to get each error individually , so we can create separate dynamic element in each error.
  let errors = "";

  if (employee.fullname == null) {
    textFullName.style.borderBottom = "2px solid pink";
    errors += "Please Enter Full Name.<br>";

  }
  if (employee.callingname == null) {
    selectCallingName.style.borderBottom = "2px solid pink";
    errors += "Please Select Calling Name.<br>";
  }
  if (employee.nic == null) {
    textNic.style.borderBottom = "2px solid pink";
    errors += "Please Enter NIC Number.<br>";
  }
  if (employee.dob == null) {
    dob.style.borderBottom = "2px solid pink";
    errors += "Please Enter Date Of Birth.<br>";
  }
  if (employee.civilstatus == null) {
    civilStatus.style.borderBottom = "2px solid pink";
    errors += "Please Enter Civil Status.<br>";
  }
  if (employee.email == null) {
    textEmail.style.borderBottom = "2px solid pink";
    errors += "Please Enter Email.<br>";
  }
  if (employee.mobilenumber == null) {
    textMobileNo.style.borderBottom = "2px solid pink";
    errors += "Please Enter Mobile Number.<br>";
  }

  if (employee.designation_id == null) {
    selectDesignation.style.borderBottom = "2px solid pink";
    errors += "Please Select Designation.<br>";
  }
  if (employee.employeestatus_id == null) {
    selectEmployeeStatus.style.borderBottom = "2px solid pink";
    errors += "Please Select Employee Status.<br>";
  }
  if (employee.address == null) {
    textAddress.style.borderBottom = "2px solid pink";
    errors += "Please Enter Address.<br>";
  }
    if (employee.employeephoto == null) {
        errors += "Please Add Employee Photo.<br>";
    }

  // optional
  // if (employee.landnumber == null) {
  //   textLandNo.style.borderBottom = "2px solid pink";
  // Push the error message to the array
  //errors.push("Please Enter Landnumber");
  // }
  return errors;
};

const buttonEmployeeSubmit = () => {

    // check form has valid value
    let formErrors = checkEmployeeFormErrors();
    if (formErrors === "") {
        // form has not any errors
        // let userConfirm = window.confirm(
        //   "Are you sure to save the following employee record?"
        // );
        Swal.fire({
            title: "Confirm Save",
            html: `<p>Are you sure to save this employee record?</p>`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ff0000ff",
            cancelButtonColor: "rgb(0, 102, 255)",
            confirmButtonText: "Yes, Save",
            cancelButtonText: "Cancel",
            reverseButtons :true

        }).then((result) => {
            if (result.isConfirmed) {
                let fullEmployeeMobileNo = "0" + textMobileNo.value;
                employee.mobilenumber = fullEmployeeMobileNo;


                if (textLandNo.value.trim() !== "") {
                    let fullEmployeeLandNo = "0" + textLandNo.value;
                    employee.landnumber = fullEmployeeLandNo;
                } else {
                    employee.landnumber = null;
                }

                console.log(employee);

                // call post service
                let postServiceResponse = getHttpServiceRequest("/employee/insert", "POST", employee);

                if (postServiceResponse == "OK") {
                    // save successs
                    Swal.fire({
                        title: "Saved!",
                        text: "Employee record saved successfully.",
                        icon: 'success',

                    });
                    refreshEmployeetable();
                    refreshEmployeeForm();
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
                        html: `<p>Employee record could not be saved.</p>
                <p>Details: ${postServiceResponse}</p>`,
                        confirmButtonText: 'OK'
                    });
                    // window.alert(
                    //   "Employee record could not be saved due to the following errors: \n" + postServiceResponse
                    // );
                }
            } else {
                //get user confirm for form discard
                // can get user confrimation for form refresh
                Swal.fire({
                    title: "Confirm Refresh",
                    text: "Do you need to refresh employee form ?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#ff0000ff",
                    cancelButtonColor: "rgb(0, 102, 255)",
                    confirmButtonText: "OK",
                    reverseButtons :true

                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload();
                    }
                })
                // let userConfrimForRefresh = window.confirm(
                //   "Do you want to refresh the form?"
                // );
                // if (userConfrimForRefresh) {
                //   window.location.reload();
                // }
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

        // window.alert("The form contains the following errors: \n" + formErrors);
    }
}

// define check update function
const checkEmployeeFromUpdates = () => {

  let updates = "";
  if (employee != null && oldEmployee != null) {
    if (employee.fullname != oldEmployee.fullname) {
      updates += "Full name is changed " +
        oldEmployee.fullname + " into " +
        employee.fullname +
        ".<br>";
    }
    if (employee.callingname != oldEmployee.callingname) {
      updates +=
        "Calling name is changed " +
        oldEmployee.callingname +
        " into " +
        employee.callingname +
        " .<br>";
    }
    if (employee.nic != oldEmployee.nic) {
      updates +=
        "NIC is changed " +
        oldEmployee.nic +
        " into " +
        employee.nic +
        " .<br>";
    }
    if (employee.gender != oldEmployee.gender) {
      updates +=
        "gender  is changed " +
        oldEmployee.gender +
        " into " +
        employee.gender +
        " .<br>";
    }
    if (employee.dob != oldEmployee.dob) {
      updates +=
        "Date of Birth  is changed " +
        oldEmployee.dob +
        " into " +
        employee.dob +
        " .<br>";
    }
    if (employee.civilstatus != oldEmployee.civilstatus) {
      updates +=
        "Civil Status  is changed " +
        oldEmployee.civilstatus +
        " into " +
        employee.civilstatus +
        " .<br>";
    }
    if (employee.email != oldEmployee.email) {
      updates +=
        "Email  is changed " +
        oldEmployee.email +
        " into " +
        employee.email +
        " .<br>";
    }
      let mobileNoWithoutZero = employee.mobilenumber.substring(1);
    let oldmobileNoWithoutZero= oldEmployee.mobilenumber.substring(1);
      if ( mobileNoWithoutZero!= oldmobileNoWithoutZero) {
          updates +=
              "Mobile Number is changed " +
              oldEmployee.mobilenumber +
              " into " +
              employee.mobilenumber +
              " .<br>";
      }
      if (employee.landnumber != oldEmployee.landnumber) {
          updates +=
              "Land Number  is changed " +
              oldEmployee.landnumber +
              " into " +
              employee.landnumber +
              " .<br>";
      }

    if (employee.designation_id.name != oldEmployee.designation_id.name) {
      updates +=
        "designation  is changed " +
        oldEmployee.designation_id.name +
        " into " +
        employee.designation_id.name +
        " .<br>";
    }
      if (employee.employeestatus_id.name != oldEmployee.employeestatus_id.name) {
          updates +=
              "Employee Status  is changed " +
              oldEmployee.employeestatus_id.name +
              " into " +
              employee.employeestatus_id.name +
              " .<br>";
      }
      if (employee.address != oldEmployee.address) {
          updates +=
              "Address  is changed " +
              oldEmployee.address +
              " into " +
              employee.address +
              " .<br>";
      }
      if (employee.note != oldEmployee.note) {
          updates +=
              "Note  is changed " +
              oldEmployee.note +
              " into " +
              employee.note +
              " .<br>";
      }
      if (employee.employeephoto != oldEmployee.employeephoto) {
          updates +=
              "Employee Photo  is changed.<br>";
      }
  }
  return updates;
};

// define function for update record
const buttonEmployeeUpdate = () => {
    let fullEmployeeMobileNo = "0" + textMobileNo.value;
    employee.mobilenumber = fullEmployeeMobileNo;

    if (textLandNo.value.trim() !== "") {
        let fullEmployeeLandNo = "0" + textLandNo.value;
        employee.landnumber = fullEmployeeLandNo;
    } else {
        employee.landnumber = null;
    }

  // need to check  all required feild with valid value
  let formErrors = checkEmployeeFormErrors();
  if (formErrors == "") {
    let formUpdates = checkEmployeeFromUpdates();
    if (formUpdates == "") {
      //no updates
      Swal.fire({
        title: 'Update Failed',
        text: "Form has not any changes to update.",
        confirmButtonText: 'OK'
      });
      // window.alert("Form has nothing to update.");
    } else {
      //has updates
      Swal.fire({
        title: "Confirm Update",
        html: `<p>Are you sure to update this employee record?</p>
            <p>${formUpdates}</p>`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ff0000ff",
        cancelButtonColor: "rgb(0, 102, 255)",
        confirmButtonText: "Yes, Update",
        cancelButtonText: "Cancel",
          reverseButtons :true

      }).then((result) => {
        if (result.isConfirmed) {
          let updateServiceResponse = getHttpServiceRequest("/employee/update", "PUT", employee);


          if (updateServiceResponse == "OK") {
            //user confrim update
            Swal.fire({
              title: "Updated!",
              text: "Employee record updated successfully.",
              icon: 'success',

            });
            // window.alert("Updated successfully.");
            //refresh form and table
            refreshEmployeetable();
            refreshEmployeeForm();

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
            html: `<p>Employee record could not be updated.</p>
                <p>${updateServiceResponse}</p>`,
            confirmButtonText: 'OK'
          });
            // window.alert(
            //   "Fail to update, Form has following errors.\n" +
            //   updateServiceResponse
            // );
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
    // window.alert("Form has Following Errors \n" + formErrors);
  }
};

// refresh designation form
const refreshDesigantionForm=()=>{
    formDesignation.reset();

    designation= new Object();

    let roles = ajaxGetrequest("/role/alldatawithoutadmin");
    fillDataIntoSelect(selectRole, "Select Role", roles, "name");

    setInitial([
        textDesignationName,
        checkNeedUserAccount,
        selectRole
    ])
    checkNeedUserAccount.checked = "checked";
    lblNeedUserAccount.innerText = "User Account Required";
    designation.useraccount = true;


}

const checkDesignationFormErrors=()=>{
    let errors="";
    if(designation.name == null){
        textDesignationName.style.borderBottom = "2px solid pink";
        errors += " Please Enter Name.<br>";
    }
    return errors;
}

const buttonDesignationSubmit=()=>{
    console.log(designation);
    let formErrors = checkDesignationFormErrors();
    if (formErrors == "") {
        Swal.fire({
            title: "Confirm Save",
            html: `<p>Are you sure to save this Designation record?</p>`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ff0000ff",
            cancelButtonColor: "rgb(0, 102, 255)",
            confirmButtonText: "Yes, Save",
            cancelButtonText: "Cancel",
            reverseButtons :true

        }).then((result) => {
            if (result.isConfirmed) {
                // call post service
                let postServiceResponse = getHttpServiceRequest("/designation/insert", "POST", designation);
                if (postServiceResponse == "OK") {
                    // save successs
                    Swal.fire({
                        title: "Saved!",
                        text: "Designation saved successfully.",
                        icon: 'success',

                    });
                    refreshDesigantionForm();

                    $("#modalAddNewDesigantion").modal("hide");

                    let designations= getHttpServiceRequest("/designation/alldata");
                    fillDataIntoSelect(selectDesignation,
                        "Please Select Designation",
                        designations,
                        "name")
                    selectDesignation.value= JSON.stringify(designations[designations.length-1]);
                    employee.designation_id= designations[designations.length-1];
                    selectDesignation.style.borderBottom="2px solid lightgreen";
                } else {
                    // save not completed
                    Swal.fire({
                        title: 'Save Failed',
                        html: `<p>Designation could not be saved.</p>
                                <p>Details: ${postServiceResponse}</p>`,
                        confirmButtonText: 'OK'
                    });
                }
            } else {
                //get user confirm for form discard
                // can get user confrimation for form refresh
                Swal.fire({
                    title: "Confirm Refresh",
                    text: "Do you need to refresh Designation form ?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#ff0000ff",
                    cancelButtonColor: "rgb(0, 102, 255)",
                    confirmButtonText: "OK",
                    reverseButtons :true

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
        // window.alert("Form has Following Errors \n" + formErrors);
        Swal.fire({
            title: 'Save Failed',
            html: `<p>Form has Following Errors.</p>
                <p>${formErrors}</p>`,
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }

}