const tabpaneForm = document.getElementById("privilegeTabPillForm");
const tabPaneTable = document.getElementById("privilegeTabPillTable");
const tabPillForm = document.getElementById("privilegeFormPill");
const tabPillTable = document.getElementById("privilegeTablePill");

let tableBody = document.querySelector("#tableBodyPrivilege");

window.addEventListener("load", () => {
  // enable tooltip
  $('[data-bs-toggle="tooltip"]').tooltip();

    userPrivi=getHttpServiceRequest("/userprivilegebymodule?modulename=Privilege")

  // call table refresh function
  refreshPrivilegeTable();
  //call form refresh function
  refreshPrivilegeForm();

})

// function for disable form elements
const disableElement=()=>{
    document.getElementById("selectRole").disabled=true;
    document.getElementById("selectModule").disabled=true;
    document.getElementById("selectPrivilege").disabled=true;
    document.getElementById("radioNotActiveSelect").disabled=true;
    document.getElementById("insertPrivilege").disabled=true;
    document.getElementById("radioNotActiveInsert").disabled=true;
    document.getElementById("updatePrivilege").disabled=true;
    document.getElementById("radioNotActiveUpdate").disabled=true;
    document.getElementById("deletePrivilege").disabled=true;
    document.getElementById("radioNotActiveDelete").disabled=true;

}

// function for refresh table
const refreshPrivilegeTable = () => {

    // IF table is already DataTable THEN remove it THEN create new DataTable
    if ($.fn.DataTable.isDataTable('#tablePrivilege')) {
        $('#tablePrivilege').DataTable().destroy();
    }

  let privileges = ajaxGetrequest("/privilege/alldata");

  let displayProperty = [
    { propertyName: getRoleName, dataType: "function" },
    { propertyName: getModuleName, dataType: "function" },
    { propertyName: getSelectPrivi, dataType: "function" },
    { propertyName: getInsertPrivi, dataType: "function" },
    { propertyName: getUpdatePrivi, dataType: "function" },
    { propertyName: getDeletePrivi, dataType: "function" },
  ];

  fillDataIntoTableEight(tableBody,
    privileges,
    displayProperty,
    refillPrivilegeForm);

  buttonSubmit.classList.remove("d-none");
  buttonUpdate.classList.add("d-none");
  buttonPrint.classList.add("d-none");
  buttonDelete.classList.add("d-none");

    $("#tablePrivilege").DataTable({
        responsive: true,
        autoWidth: false
    });
}

// get role function
const getRoleName = (ob) => {
  return ob.role_id.name;
};

//get module function
const getModuleName = (ob) => {
  return ob.module_id.name;
};

//get select function
const getSelectPrivi = (dataOb) => {
  if (dataOb.privi_select) {
    return '<i class="fa-solid fa-circle-check fa-lg " style="color:rgb(0, 189, 72);"></i>';
  }
  return '<i class="fa-solid fa-circle-xmark fa-lg " style="color: #ff0000;"></i>';
}

//get insert function
const getInsertPrivi = (dataOb) => {
  if (dataOb.privi_insert) {
    return '<i class="fa-solid fa-circle-check fa-lg " style="color:rgb(0, 189, 72);"></i>';
  }
  return '<i class="fa-solid fa-circle-xmark fa-lg " style="color: #ff0000;"></i>';
}

//get update function
const getUpdatePrivi = (dataOb) => {
  if (dataOb.privi_update) {
    return '<i class="fa-solid fa-circle-check fa-lg " style="color:rgb(0, 189, 72);"></i>';
  }
  return '<i class="fa-solid fa-circle-xmark fa-lg " style="color: #ff0000;"></i>';
}

//get delete function
const getDeletePrivi = (dataOb) => {
  if (dataOb.privi_delete) {
    return '<i class="fa-solid fa-circle-check fa-lg " style="color:rgb(0, 189, 72);"></i>';
  }
  return '<i class="fa-solid fa-circle-xmark fa-lg " style="color: #ff0000;"></i>';
}

// refill form
const refillPrivilegeForm = (dataOb) => {

    //set Innitial color - clear element colors
    setInitial([
        selectRole,
        selectModule,
        selectPrivilege,
        radioNotActiveSelect,
        insertPrivilege,
        radioNotActiveInsert,
        updatePrivilege,
        radioNotActiveUpdate,
        deletePrivilege,
        radioNotActiveDelete
    ]);

  privilege = dataOb;

  // shift to tab pane form
  tabpaneForm.classList.add('show', 'active');
  tabPaneTable.classList.remove('show', 'active');
  // shift to  form pill tab
  tabPillForm.classList.add('show', 'active');
  tabPillTable.classList.remove('show', 'active');

  privilege = JSON.parse(JSON.stringify(dataOb));
  oldPrivilege = JSON.parse(JSON.stringify(dataOb));

   selectRole.disabled="disabled";
   selectModule.disabled="disabled";

  // role
  selectRole.value = JSON.stringify(dataOb.role_id);

  // module
  selectModule.value = JSON.stringify(dataOb.module_id);

  //select
  if (privilege.privi_select == true) {
    selectPrivilege.checked = true;
  } else {
    radioNotActiveSelect.checked = true;
  }

  //insert
  if (privilege.privi_insert == true) {
    insertPrivilege.checked = true;
  } else {
    radioNotActiveInsert.checked = true;
  }

  //update
  if (privilege.privi_update == true) {
    updatePrivilege.checked = true;
  } else {
    radioNotActiveUpdate.checked = true;
  }

  //delete
  if (privilege.privi_delete == true) {
    deletePrivilege.checked = true;
  } else {
    radioNotActiveDelete.checked = true;
  }

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

// delete function
const deletePrivilegeRecord = (dataOb) => {

  Swal.fire({
    title: "Confirm Deletion",
    html: `<p>Are you sure to delete this Privilege Record ?</p>
            <p>Role : <strong>${dataOb.role_id?.name || ''}</strong><br>
           Module : <strong>${dataOb.module_id?.name || ''}</strong></p>`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ff0000ff",
    cancelButtonColor: "rgb(0, 102, 255)",
    confirmButtonText: "Yes, Delete",
    cancelButtonText: "Cancel",
      reverseButtons: true

  }).then((result) => {
    if (result.isConfirmed) {

      let deleteServiceResponse = getHttpServiceRequest("/privilege/delete", "DELETE", dataOb);

      if (deleteServiceResponse == "OK") {
        Swal.fire({
          title: "Deleted!",
          text: "Privilege record deleted successfully.",
          icon: 'success',

        });
        // alert("Record Delete Successfully");
        refreshPrivilegeTable();
        //refresh form
          refreshPrivilegeForm();

        // shift to tab pane table
        tabpaneForm.classList.remove('show', 'active');
        tabPaneTable.classList.add('show', 'active');

        // shift to  table pill tab
        tabPillForm.classList.remove('show', 'active');
        tabPillTable.classList.add('show', 'active');

      } else {
        Swal.fire({
          title: 'Deletion Failed',
          html: `<p>Privilege record could not be deleted.</p>
                <p>Details: ${deleteServiceResponse}</p>`,
          confirmButtonText: 'OK'
        });
        // alert("Record delete Un-successfull..!\n Has Following Errors ..\n" + deleteServiceResponse)
      }

    }
  });

}

// function for open print modal
const printPrivilegeRecord = (dataOb) => {
  privilege = dataOb;

  let myModalView = new bootstrap.Modal(document.getElementById("modalPrivilegeView"), {});
  myModalView.show();

  tdRole.innerText = privilege.role_id.name;
  tdModule.innerText = privilege.module_id.name;

  //select
  if (privilege.privi_select) {
    tdSelect.innerHTML = '<i class="fa-solid fa-circle-check fa-lg " style="color:rgb(0, 189, 72);"></i>';
  } else {
    tdSelect.innerHTML = '<i class="fa-solid fa-circle-xmark fa-lg " style="color: #ff0000;"></i>';
  }
  //insert
  if (privilege.privi_insert) {
    tdInsert.innerHTML = '<i class="fa-solid fa-circle-check fa-lg " style="color:rgb(0, 189, 72);"></i>';
  } else {
    tdInsert.innerHTML = '<i class="fa-solid fa-circle-xmark fa-lg " style="color: #ff0000;"></i>';
  }
  //update
  if (privilege.privi_update) {
    tdUpdate.innerHTML = '<i class="fa-solid fa-circle-check fa-lg " style="color:rgb(0, 189, 72);"></i>';
  } else {
    tdUpdate.innerHTML = '<i class="fa-solid fa-circle-xmark fa-lg " style="color: #ff0000;"></i>';
  }
  //delete
  if (privilege.privi_delete) {
    tdDelete.innerHTML = '<i class="fa-solid fa-circle-check fa-lg " style="color:rgb(0, 189, 72);"></i>';
  } else {
    tdDelete.innerHTML = '<i class="fa-solid fa-circle-xmark fa-lg " style="color: #ff0000;"></i>';
  }

}

// print function
const printPrivilege = () => {
  let tab = window.open();
  tab.document.write('<html>'
    + '<head><title>Print Privilege Details</title>'
    + '<link rel="stylesheet" href="../resources/bootstrap-5.2.3/css/bootstrap.min.css"/>'
    + '</head>'
    + '<body>'
    + divCardPrintPrivilege.outerHTML
    + '</body></html>');

  setInterval(() => {
    tab.stop();
    tab.print();
    tab.close();
  }, 700);
}

// create function for refresh form
const refreshPrivilegeForm = () => {
  //clear static element
    formPrivilage.reset();

  privilege = new Object;

  selectRole.disabled="";
  selectModule.disabled="";

  privilege.roles = new Array();

  let roles = ajaxGetrequest("/role/alldatawithoutadmin");

  fillDataIntoSelect(selectRole, "Enter User Role", roles, "name");

  privilege.modules = new Array();

  let modules = ajaxGetrequest("module/alldata");

  fillDataIntoSelect(selectModule, "Enter Module", modules, "name");

  //set Innitial color - clear element colors
  setInitial([
      selectRole,
      selectModule,
      selectPrivilege,
      radioNotActiveSelect,
      insertPrivilege,
      radioNotActiveInsert,
      updatePrivilege,
      radioNotActiveUpdate,
      deletePrivilege,
      radioNotActiveDelete
  ]);

  selectPrivilege.checked = "";
  radioNotActiveSelect.checked = "";

  insertPrivilege.checked = "";
  radioNotActiveInsert.checked = "";

  updatePrivilege.checked = "";
  radioNotActiveUpdate.checked = "";

  deletePrivilege.checked = "";
  radioNotActiveDelete.checked = "";

 // buttonSubmit.classList.remove("d-none");
//  buttonUpdate.classList.add("d-none");

    if(!userPrivi.privi_insert){
        disableElement();
        buttonSubmit.classList.add("d-none");
        tabpaneForm.classList.remove('show', 'active');
        tabPillForm.classList.remove('show','active')
        tabPaneTable.classList.add('show', 'active');
        tabPillTable.classList.add('show','active')
    }
}

// check form errors
const checkPrivilegeFormErrors = () => {
  let errors = "";
  if (privilege.role_id == null) {
    selectRole.style.borderBottom = "2px solid pink";
    errors += "Please Enter User Role. <br>";
  }
  if (privilege.module_id == null) {
    selectModule.style.borderBottom = "2px solid pink";
    errors += "Please Enter User Module.<br>";
  }
  if (privilege.privi_select == null) {
    selectPrivilege.style.borderBottom = "2px solid pink";
    radioNotActiveSelect.style.borderBottom = "2px solid pink";
    errors += "Please select an option for Select Privilage.<br>";
  }
  if (privilege.privi_insert == null) {
    insertPrivilege.style.borderBottom = "2px solid pink";
    radioNotActiveInsert.style.borderBottom = "2px solid pink";
    errors += "Please select an option for Insert Privilage.<br>";
  }
  if (privilege.privi_update == null) {
    updatePrivilege.style.borderBottom = "2px solid pink";
    radioNotActiveUpdate.style.borderBottom = "2px solid pink";
    errors += "Please select an option for Update Privilage.<br>";
  }
  if (privilege.privi_delete == null) {
    deletePrivilege.style.borderBottom = "2px solid pink";
    radioNotActiveDelete.style.borderBottom = "2px solid pink";
    errors += "Please select an option for Delete Privilage.<br>";
  }
  return errors;
};

// function for submit
const buttonPrivilegeSubmit = () => {
  console.log(privilege);
  let formErrors = checkPrivilegeFormErrors();
  if (formErrors == "") {
    // form has not any errors
    // let userConfirm = window.confirm(
    //   "Are you sure to submit following privilege details ? "
    // );
    Swal.fire({
      title: "Confirm Save",
      html: `<p>Are you sure to save this privilege record?</p>`,
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
        let postServiceResponse = getHttpServiceRequest("/privilege/insert", "POST", privilege);
        if (postServiceResponse == "OK") {
          // save successs
          Swal.fire({
            title: "Saved!",
            text: "Privilege record saved successfully.",
            icon: 'success',

          });
          // window.alert("Privilege save successfully");
          // call table refresh function
            refreshPrivilegeTable();
            // call form refresh function
          refreshPrivilegeForm();

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
            html: `<p>Privilege record could not be saved.</p>
                <p>Details: ${postServiceResponse}</p>`,
            confirmButtonText: 'OK'
          });
          // window.alert(
          //   "Employee record could not be saved due to the following errors \n" + postServiceResponse
          // );

        }
      } else {
        //get user confirm for form discard
        // can get user confrimation for form refresh
        Swal.fire({
          title: "Confirm Refresh",
          text: "Do you need to refresh privilege form ?",
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
        //   "do you need to refresh the form?"
        // );
        // if (userConfrimForRefresh) {
        //   window.location.reload();
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

//function for update 
const checkPrivilegeFromUpdates = () => {
  let updates = "";
  if (oldPrivilege != null) {
    if (privilege.role_id.id != oldPrivilege.role_id.id) {
      updates = updates + "Role is changed "  + getRoleName(oldPrivilege) +
          " into " + getRoleName(privilege) +" .</br>";
    }
    if (privilege.module_id.id != oldPrivilege.module_id.id) {
      updates = updates + "Module is changed "+getModuleName(oldPrivilege)+
          " into "+getModuleName(privilege)+" .</br>";
    }
    if (privilege.privi_select != oldPrivilege.privi_select) {
      updates = updates + "Select Privilege is changed "+getSelectPrivi(oldPrivilege)+
      " into "+ getSelectPrivi(privilege)+" .</br>";
    }
    if (privilege.privi_insert != oldPrivilege.privi_insert) {
      updates = updates + "Insert Privilege is changed "+getInsertPrivi(oldPrivilege)+
          " into "+ getInsertPrivi(privilege)+" .</br>";
    }
    if (privilege.privi_update != oldPrivilege.privi_update) {
      updates = updates + "Update Privilege is changed "+getUpdatePrivi(oldPrivilege)+
          " into "+ getUpdatePrivi(privilege)+" .</br>";
    }
    if (privilege.privi_delete != oldPrivilege.privi_delete) {
      updates = updates + "Delete Privilege is changed "+getDeletePrivi(oldPrivilege)+
          " into "+ getDeletePrivi(privilege)+" .</br>";
    }

  }
  return updates;
}

// function for update
const buttonPrivilegeUpdate = () => {
    console.log(privilege);
  // check form errors
  let formErrors = checkPrivilegeFormErrors();
  if (formErrors == "") {
    // check form formErrors
    let formUpdates = checkPrivilegeFromUpdates();
    if (formUpdates == "") {
      Swal.fire({
        title: 'Update Failed',
        text: "Form has not any changes to update.",
        confirmButtonText: 'OK'
      });
      // window.alert("Form has not any changes to update..")
    } else {
      // let userConfirm = window.confirm("Are you sure to update following changes..\n" + formUpdates);
      Swal.fire({
        title: "Confirm Update",
        html: `<p>Are you sure to update this privilege record?</p>
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
          let updateResponse = getHttpServiceRequest("/privilege/update", "PUT", privilege)
          if (updateResponse == "OK") {
            Swal.fire({
            title: "Updated!",
            text: "Privilege record updated successfully.",
            icon: 'success',

          });
            // alert("Updated successfully..");
              // call table referesh function
            refreshPrivilegeTable();
            // call form refresh function
            refreshPrivilegeForm();

            // shift to tab pane table
            tabpaneForm.classList.remove('show', 'active');
            tabPaneTable.classList.add('show', 'active');

            // shift to  table pill tab
            tabPillForm.classList.remove('show', 'active');
            tabPillTable.classList.add('show', 'active');

          }
        } else {
          Swal.fire({
            title: 'Update Failed',
            html: `<p>Privilege record could not be updated.</p>
                <p>${updateResponse}</p>`,
            confirmButtonText: 'OK'
          });
          // window.alert("Fail to update, has following errors..\n" + updateResponse)
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
    // window.alert("Form has following errors..\n" + formErrors);

  }
}

