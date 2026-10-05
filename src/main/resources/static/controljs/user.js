let tableBody = document.querySelector("#tableBodyUser");
let textRetypePasswordElement = document.querySelector("#textRetypePassword");
let textPasswordElement = document.querySelector("#textPassword");
let divParentElement = document.querySelector("#divRoleParent");


const tabpaneForm = document.getElementById("userTabPillForm");
const tabPaneTable = document.getElementById("userTabPillTable");
const tabPillForm = document.getElementById("userFormPill");
const tabPillTable = document.getElementById("userTablePill");

// define browser refresh event
window.addEventListener("load", () => {
    // enable tooltip
    $('[data-bs-toggle="tooltip"]').tooltip();

    userPrivi=getHttpServiceRequest("/userprivilegebymodule?modulename=User")

    // call table refresh function
    refreshUserTable();
    //call form refresh function
    refreshUserForm();
})

// function for disable user form elements
const disableElement=()=>{
        document.getElementById("selectEmployee").disabled=true;
        document.getElementById("textUserName").disabled=true;
         textPassword.disabled = true;
         textRetypePassword.disabled = true;
        document.getElementById("textEmail").disabled=true;
        document.getElementById("textNote").disabled=true;
        document.getElementById("checkUserStatus").disabled=true;

}

// ** start Table functions

//refresh table function
const refreshUserTable = () => {

    // IF table is already DataTable THEN remove it THEN create new DataTable
    if ($.fn.DataTable.isDataTable('#tableUser')) {
        $('#tableUser').DataTable().destroy();
    }

    // let users = [
    //     { employee_id: { id: 1, fullname: "Lakshika Kalubovila" }, username: "lakshika", email: "lakshikakalubovila@gmail.com", roles: [{ id: 1, name: "Manager" }], userstatus: false },
    //     { employee_id: { id: 2, fullname: "Nuwandara Sewmini" }, username: "nuwandara", email: "nuwandararajapakse@gmail.com", roles: [{ id: 1, name: "Librarian" }], userstatus: true },
    //     { employee_id: { id: 3, fullname: "Thamasha De Alwis" }, username: "thamasha", email: "milinithamasha@gmail.com", roles: [{ id: 2, name: "Assistant Librarian" }], userstatus: true },
    //     { employee_id: { id: 4, fullname: "Kanchana Wijesinghe" }, username: "kanchana", email: "kanchana2345@gmail.com", roles: [{ id: 3, name: "Book Store Manager" }], userstatus: false },
    //     { employee_id: { id: 5, fullname: "Sachini Amanda" }, username: "sachini", email: "sachini545@gmail.com", roles: [{ id: 2, name: "Assistant Librarian" }], userstatus: true }

    // ];

    let users = ajaxGetrequest("/user/alldata");

    //property array

    let displayProperty = [
        { propertyName: getEmployee, dataType: "function" },
        { propertyName: "username", dataType: "string" },
        { propertyName: "email", dataType: "string" },
        { propertyName: getRoles, dataType: "function" },
        { propertyName: getUserStatus, dataType: "function" }
    ]
    //fill data into table function
    fillDataIntoTableEight(tableBody, users, displayProperty, refillUserForm)

    buttonSubmit.classList.remove("d-none");
    buttonUpdate.classList.add("d-none");
    buttonPrint.classList.add("d-none");
    buttonDelete.classList.add("d-none");

    $("#tableUser").DataTable({
        responsive: true,
        autoWidth: false
    });
}

// define function for get employees
const getEmployee = (dataOb) => {
    if (dataOb.employee_id != null) {
        return dataOb.employee_id.fullname;
    }
    return "-";
}

//define function for get user roles
const getRoles=(dataOb)=>{
    let userRoles=getHttpServiceRequest("/role/byuser/" +dataOb.id);
    let roles="";
    userRoles.forEach(role=>{
        roles += role.name+", ";
    })
    return roles;
}


function getUserRolesUpdate(user) {
    return user.roles.map(role => role.name).join(", ");
}

//define function for get user status
const getUserStatus = (dataOb) => {
    let userstatus = '<i class="fa-solid fa-circle-xmark fa-lg " style="color: #ff0000;"></i>';
    if (dataOb.userstatus) {
        userstatus = '<i class="fa-solid fa-circle-check fa-lg " style="color:rgb(0, 189, 72);"></i>';
    }
    return userstatus;
}

//define function for refill user form
const refillUserForm = (dataOb) => {

    // set initial color
    setInitial(
        [
            selectEmployee,
            textUserName,
            textPassword,
            textRetypePassword,
            textEmail,
            textNote
        ]);


    // shift to tab pane form
    tabpaneForm.classList.add('show', 'active');
    tabPaneTable.classList.remove('show', 'active');
    // shift to  form pill tab
    tabPillForm.classList.add('show', 'active');
    tabPillTable.classList.remove('show', 'active');

    user=getHttpServiceRequest("/user/byid/"+dataOb.id);
    olduser=getHttpServiceRequest("/user/byid/"+dataOb.id);

// this part needs , if give user accounts in same form for employee and member
    // this is for user type Employee
    // document.getElementById("employeeList").style.display="block";
    // document.getElementById("radioEmployee").checked=true;
    // document.getElementById("radioMember").disabled=true;
    // need to write for member

    textUserName.value = user.username;
    textEmail.value = user.email;

    //optional element
    if (user.note != null || user.note != undefined) {
        textNote.value = user.note;
    } else {
        textNote.value = "";
    }

    //dynamic element
    let employees=getHttpServiceRequest("/employee/list")
    fillDataIntoSelect(selectEmployee,
        "Select Employee ",
        employees,
        "fullname");
    selectEmployee.value = JSON.stringify(user.employee_id);

    textPassword.disabled = true;
    textRetypePassword.disabled = true;

    if (user.userstatus) {
        user.userstatus = true;
        lblUserStatus.innerText = 'User Account is Active';
    } else {
        user.userstatus = false;
        lblUserStatus.innerText = 'User Account is In-Active';
    }
    // let roles = [
    //     { id: 1, name: "Manager" },
    //     { id: 2, name: "Librarian" },
    //     { id: 3, name: "Assistant Librarian" },
    //     { id: 4, name: "Book Store Manager" }

    // ];

    let roles = ajaxGetrequest("/role/alldatawithoutadmin");

    divParentElement.innerHTML = "";
    roles.forEach((role, index) => {
        let div = document.createElement("div");
        div.className = "form-check";

        let input = document.createElement("input");
        input.type = "checkbox";
        input.className = "form-check-input";

        if(!userPrivi.privi_insert){
            input.disabled = true;
        }

        input.onchange = () => {
            if (input.checked) {
                console.log("checked");
                console.log(role, index);
                //push role into user roles list
                user.roles.push(role);
            } else {
                console.log("unchecked");
                console.log(role, index);
                let extIndex = user.roles.map(urole => urole.name).indexOf(role.name);
                //pop role in user roles
                //user.roles.pop();
                if (extIndex != -1) {
                    user.roles.splice(extIndex, 1);
                }

            }
        }
        let extIndex = user.roles.map(urole => urole.name).indexOf(role.name);
        //pop role in user roles
        //user.roles.pop();
        if (extIndex != -1) {
            input.checked = true;
        }

        let label = document.createElement("label");
        label.className = "form-check-label checkbox-radio-label"
        label.innerText = role.name;

        div.appendChild(input);
        div.appendChild(label);
        divParentElement.appendChild(div);

    });

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
    buttonSubmit.classList.add("d-none");
    buttonPrint.classList.remove("d-none");



}

//define function for delete user record
const deleteUserRecord = (dataOb) => {
    Swal.fire({
        title: "Confirm Deletion",
        html: `<p>Are you sure to delete this User Record ?</p>
            <p>Username : <strong>${dataOb.username || ''}</strong><br>
           Email : <strong>${dataOb.email || ''}</strong></p>`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ff0000ff",
        cancelButtonColor: "rgb(0, 102, 255)",
        confirmButtonText: "Yes, Delete",
        cancelButtonText: "Cancel",
        reverseButtons: true

    }).then((result) => {
        if (result.isConfirmed) {
            let deleteServiceResponse = getHttpServiceRequest("/user/delete", "DELETE", dataOb);
            if (deleteServiceResponse == "OK") {
                Swal.fire({
                    title: "Deleted!",
                    text: "User record deleted successfully.",
                    icon: 'success',

                });
                // alert("User Delete Successfully");
                refreshUserTable();
                // refrsh form
                refreshUserForm();
                // shift to tab pane table
                tabpaneForm.classList.remove('show', 'active');
                tabPaneTable.classList.add('show', 'active');
                // shift to  table pill tab
                tabPillForm.classList.remove('show', 'active');
                tabPillTable.classList.add('show', 'active');
            } else {
                Swal.fire({
                    title: 'Deletion Failed',
                    html: `<p>User record could not be deleted.</p>
                            <p>Details: ${deleteServiceResponse}</p>`,
                    confirmButtonText: 'OK'
                });
                // alert("User delete Un-successfull..!\n Has Following Errors ..\n" + deleteServiceResponse)
            }
        } else {
            //refresh table
        }
    })
}

//define function for view user record
const printUserRecord = (dataOb) => {

    let myModalView = new bootstrap.Modal(document.getElementById("modalUserView"), {});
    myModalView.show();

    tdFullName.innerText = dataOb.employee_id.fullname;
    tdUserName.innerText = dataOb.username;
    tdEmail.innerText = dataOb.email;
    if(dataOb.note){
        tdNote.innerText = dataOb.note;
    }
    tdRoles.innerText = getRoles(dataOb);

    if (user.userstatus) {
        tdUserStatus.innerText = "Active";
    } else {
        tdUserStatus.innerText = "In-Active";
    }
}

//define function for print user
const printUser = () => {
    //open new tab
    let tab = window.open();
    tab.document.write('<html>'
        + '<head><title>Print User Record</title>'
        + '<link rel="stylesheet" href="../resources/bootstrap-5.2.3/css/bootstrap.min.css"/>'
        + '</head>'
        + '<body>'
        + divCardPrintUser.outerHTML
        + '</body></html>');

    setInterval(() => {
        tab.stop();
        tab.print();
        tab.close();
    }, 700);
}

//define function for refresh form
const refreshUserForm = () => {
    //call form reset function for empty static element
    formUser.reset();

    if(!userPrivi.privi_insert){
        disableElement();
        buttonSubmit.classList.add("d-none");
        tabpaneForm.classList.remove('show', 'active');
        tabPillForm.classList.remove('show','active')
        tabPaneTable.classList.add('show', 'active');
        tabPillTable.classList.add('show','active')
    }
    // need to refresh dynamic element
    // create new user object for store valid form value
    user = new Object();

    //create user role array
    user.roles = new Array();

    //dynamic dropdown
    // let employees = [
    //     { id: 1, fullname: "Lakshika Kalubovila" },
    //     { id: 2, fullname: "Nuwamdara Rajapakshe" },
    //     { id: 3, fullname: "Milini Thamasha" },
    //     { id: 4, fullname: "Kanchana Rathnayake" }
    // ];

    

    let employees = ajaxGetrequest("/employee/alldata");

    fillDataIntoSelect(
        selectEmployee,
        "Select Employee ",
        employees,
        "fullname"
    );
    // let roles = [
    //     { id: 1, name: "Manager" },
    //     { id: 2, name: "Librarian" },
    //     { id: 3, name: "Assistant Librarian" },
    //     { id: 4, name: "Book Store Manager" }

    // ];

    let roles = ajaxGetrequest("/role/alldatawithoutadmin");

    //define function for retype password validator

    textRetypePasswordElement.addEventListener("keyup", () => {
        let elementValue = textRetypePasswordElement.value;

        if (elementValue == textPasswordElement.value) {
            user.password = elementValue;
            textRetypePasswordElement.style.borderBottom = "2px solid lightgreen";
            textPasswordElement.style.borderBottom = "2px solid lightgreen";
        } else {
            textRetypePasswordElement.style.borderBottom = "2px solid pink";
            textPasswordElement.style.borderBottom = "2px solid pink";
            user.password = null;
        }
    })


    divParentElement.innerHTML = "";
    roles.forEach((role, index) => {
        let div = document.createElement("div");
        div.className = "form-check";

        let input = document.createElement("input");
        input.type = "checkbox";
        input.className = "form-check-input";

        if(!userPrivi.privi_insert){
            input.disabled = true;
        }
        input.onchange = () => {
            if (input.checked) {
                console.log("checked");
                console.log(role, index);
                //push role into user roles list
                user.roles.push(role);
            } else {
                console.log("unchecked");
                console.log(role, index);
                let extIndex = user.roles.map(urole => urole.name).indexOf(role.name);
                //pop role in user roles
                //user.roles.pop();
                if (extIndex !=-1) {
                    user.roles.splice(extIndex, 1);
                }
            }
        }

        let label = document.createElement("label");
        label.className = "form-check-label checkbox-radio-label"
        label.innerText = role.name;

        div.appendChild(input);
        div.appendChild(label);
        divParentElement.appendChild(div);



    });
    // set initial color
    setInitial(
        [
            selectEmployee,
            textUserName,
            textPassword,
            textRetypePassword,
            textEmail,
            textNote
        ]);

    checkUserStatus.checked = "checked";
    lblUserStatus.innerText = "User Account is Active";
    user.userstatus = true;


}

//define function for check form error
const checkUserFormErrors = () => {
    let errors = "";

    if (user.employee_id == null) {
        selectEmployee.style.borderBottom = "2px solid pink";
        errors += " Please Select Employee.<br>";
    }
    if (user.username == null) {
        textUserName.style.borderBottom = "2px solid pink";
        errors += " Please Enter Username.<br>";
    }
    if (user.password == null) {
        textPassword.style.borderBottom = "2px solid pink";
        errors += " Please Enter Password.<br>";
    }

    if (textRetypePasswordElement.value == "") {
        textRetypePassword.style.borderBottom = "2px solid pink";
        errors += " Please Retype Password.<br>";
    }
    if (user.email == null) {
        textEmail.style.borderBottom = "2px solid pink";
        errors += " Please Enter Email.<br>";
    }
    if (user.roles.length == 0) {
        // selectRole.style.borderBottom = "2px solid pink";
        errors += " Please Select Role.<br>";
    }

    return errors;
}

const buttonUserSubmit = () => {
    console.log(user);
    // check form has valid value
    let formErrors = checkUserFormErrors();
    if (formErrors == "") {
        // form has not any errors
        // let userConfirm = window.confirm(
        //     "Are you sure to submit following User Details ? "
        // );
        Swal.fire({
            title: "Confirm Save",
            html: `<p>Are you sure to save this User record?</p>`,
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
                let postServiceResponse = getHttpServiceRequest("/user/insert", "POST", user);
                if (postServiceResponse == "OK") {
                    // save successs
                    Swal.fire({
                        title: "Saved!",
                        text: "User record saved successfully.",
                        icon: 'success',

                    });
                    // window.alert("User saved successfully");

                    refreshUserTable();
                    refreshUserForm();

                    // shift to tab pane table
                    tabpaneForm.classList.remove('show', 'active');
                    tabPaneTable.classList.add('show', 'active');
                    // shift to  table pill tab
                    tabPillForm.classList.remove('show', 'active');
                    tabPillTable.classList.add('show', 'active');
                } else {
                    // save not completed
                    Swal.fire({
                        title: 'Save Failed',
                        html: `<p>User record could not be saved.</p>
                                <p>Details: ${postServiceResponse}</p>`,
                        confirmButtonText: 'OK'
                    });
                    // window.alert(
                    //     "Failed to save User , has following errors \n" + postServiceResponse
                    // );
                }
            } else {
                //get user confirm for form discard
                // can get user confrimation for form refresh
                Swal.fire({
                    title: "Confirm Refresh",
                    text: "Do you need to refresh user form ?",
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
                // let userConfrimForRefresh = window.confirm(
                //     "Do you need to refresh the form ?"
                // );
                // if (userConfrimForRefresh) {
                //     window.location.reload();
                // }
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

//define function for check form updates
const checkUserFromUpdates = () => {
    let updates = "";

    if (olduser != null) {
        if (getEmployee(user) != getEmployee(olduser)) {
            updates = updates +
                "Employee is changed "
                + getEmployee(olduser) +
                " into " +
                getEmployee(user) +
                " .\n";
        }
        if (user.username != olduser.username) {
            updates = updates + "Username is changed "
                + olduser.username +
                " into " +
                user.username +
                " .\n";
        }
        if (user.email != olduser.email) {
            updates = updates + "Email is changed "
                + olduser.email +
                " into " +
                user.email +
                " .\n";
        }
        if (user.note != olduser.note) {
            updates = updates + "Note is changed "
                + olduser.note +
                " into " +
                user.note +
                " .\n";
        }
        // sometimes length can be equal but values can not.
        if (user.roles.length != olduser.roles.length) {
            updates = updates + "User Roles are changed "
                + getUserRolesUpdate(olduser) +
                " into " +
                getUserRolesUpdate(user) +
                " .\n";
        }else{
            //length equal but values different
        }

        if (user.userstatus != olduser.userstatus) {
            updates = updates + "User Status is changed "
                + getUserStatus(olduser) +
                " into " +
                getUserStatus(user) +
                " .\n";
        }
    }
    return updates;
};

// define function for update record
const buttonUserUpdate = () => {
    // check form errors
    let formErrors = checkUserFormErrors();
    if (formErrors != "") {
        // check form formErrors
        let formUpdates = checkUserFromUpdates();
        if (formUpdates == "") {
            //no updates
            Swal.fire({
                title: 'Update Failed',
                text: "Form has not any changes to update.",
                confirmButtonText: 'OK'
            });
            // window.alert("Form has nothing to update.")
        } else {
            //has updates
            // let userConfirm = window.confirm("Are you sure to update following changes..\n" + formUpdates);
            Swal.fire({
                title: "Confirm Update",
                html: `<p>Are you sure to update this user record?</p>
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
                    let updateResponse = getHttpServiceRequest("/user/update", "PUT", user);
                    if (updateResponse == "OK") {
                        //user confrim update
                        Swal.fire({
                            title: "Updated!",
                            text: "User record updated successfully.",
                            icon: 'success',

                        });
                        // alert("Updated successfully.");
                        //refresh form and table
                        refreshUserTable();
                        refreshUserForm();

                        // shift to tab pane table
                        tabpaneForm.classList.remove('show', 'active');
                        tabPaneTable.classList.add('show', 'active');
                        // shift to  table pill tab
                        tabPillForm.classList.remove('show', 'active');
                        tabPillTable.classList.add('show', 'active');
                    }
                } else {
                    //user cancel updates
                    Swal.fire({
                        title: 'Update Failed',
                        html: `<p>User record could not be updated.</p>
                                <p>Details: ${updateResponse}</p>`,
                        confirmButtonText: 'OK'
                    });
                    // window.alert("Fail to update, has following errors.\n" + updateResponse)
                }
            })
        }
    } else {
        // has errors
        Swal.fire({
            title: 'Update Failed',
            html: `<p>Form has Following Errors.</p>
                <p>${formErrors}</p>`,
            icon: 'error',
            confirmButtonText: 'OK'
        });
        // window.alert("Form has following erroes..\n" + formErrors);
    }
}
