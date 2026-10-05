window.onload=()=>{
    changeUser= new Object();

    let loggedUser= getHttpServiceRequest("/getloggeduser")

    if(loggedUser.userphoto){
        imgUserPhoto.src= atob(loggedUser.userphoto);
    }
    changeUser.oldphoto= loggedUser.userphoto;

    textUserName.value= loggedUser.username;
    changeUser.oldusername= loggedUser.username;
    changeUser.username= loggedUser.username;

    textEmail.value=loggedUser.email;
    changeUser.oldemail= loggedUser.email;

    changeUser.email= loggedUser.email;
    changeUser.userphoto= loggedUser.userphoto;
}
const retypePassword=()=>{
    if (textPassword.value == textReTypePassword.value) {
        // valid
        textPassword.style.borderBottom = "2px solid lightgreen";
        textReTypePassword.style.borderBottom = "2px solid lightgreen";
        changeUser.newpassword = textReTypePassword.value;
    } else {
        textPassword.style.borderBottom = "2px solid pink";
        textReTypePassword.style.borderBottom = "2px solid pink";
        changeUser.newpassword = null;
    }
}

const checkChanges=()=>{
    let changes="";
    if(changeUser.oldphoto != changeUser.userphoto){
        changes= changes+"Photo is changed.<br>"
    }
    if(changeUser.oldusername != changeUser.username){
        changes= changes+"Username is changed.<br>"
    }
    if(changeUser.oldemail != changeUser.email){
        changes= changes+"Email is changed.<br>"
    }
    if(textPassword.value!="" && textReTypePassword.value!="" && textPassword.value==textReTypePassword.value){
        changes= changes+"Password is changed.<br>"
    }
    return changes;
}

const buttonSaveChanges=()=>{
    console.log(changeUser);

    // check form has valid value
    let changes = checkChanges();
    if (changes != "") {
        // form has changes
        Swal.fire({
            title: "Confirm Save",
            html: `<p>Are you sure to save changes in user details</p>`,
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
                let postServiceResponse = getHttpServiceRequest("/savechangeprofile", "POST", changeUser);

                if (postServiceResponse == "OK") {
                    // save successs
                    Swal.fire({
                        title: "Saved!",
                        text: "Changes saved successfully.",
                        icon: 'success',

                    });
                    window.location.replace("/logout")
                } else {
                    // save not completed
                    Swal.fire({
                        title: 'Save Failed',
                        html: `<p>Record could not be saved.</p>
                            <p>Details: ${postServiceResponse}</p>`,
                        confirmButtonText: 'OK'
                    });
                }
            }
        })
    } else {
        // form has errors
        // default / pre-defined library / custom
        Swal.fire({
            title: 'No Changes',
            text: "No changes were made to the profile",
            icon: 'info',
            confirmButtonText: 'OK'
        });
    }
}

