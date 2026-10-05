const notificationCountElement = document.getElementById("notificationCount");
const notificationListElement = document.getElementById("notificationList");

const administrationListElement= document.getElementById("administrationList");
const memberRegistrationLinkElement= document.getElementById("memberRegistrationLink");
const purchaseListElement= document.getElementById("purchaseList");
const  donationListElement= document.getElementById("donationList");
const newMembershipLinkElement= document.getElementById("newMembershipLink");

console.log("sidebar js loaded");

const loadNotifications=()=>{

    let notifications= getHttpServiceRequest("/notification/byuser/"+loggedUser.id);
    notificationListElement.innerHTML="";
    notifications.forEach(notification=>{
        let li = document.createElement("li");
        li.className="dropdown-item";
        if(notification.isread==false){
            li.style.backgroundColor="#f1f5ff";
        }
        li.innerHTML=`<div><div class="fw-bold">${notification.title} </div><div class="normal-text mt-1">${notification.messagetext}</div><div class="small mt-1">${notification.addeddatetime}</div></div>`;
        li.onclick=()=>{
            if(notification.isread== false){
                getHttpServiceRequest("/notification/markasread", "PUT", notification)
                loadNotifications();
            }
        }
        notificationListElement.appendChild(li);
    })
}
const loadUnreadnotificationCount=()=>{
    let loggedUser= getHttpServiceRequest("/user/loggeduser");
    let notificationCount= getHttpServiceRequest("/notification/unreadcount/"+loggedUser.id);
    notificationCountElement.innerText= notificationCount;
    if(notificationCount == 0){
        notificationCountElement.classList.add("d-none");
    }else{
        notificationCountElement.classList.remove("d-none");
    }
}

window.addEventListener("load", () => {
    loadNotifications();
    loadUnreadnotificationCount();
});

// refresh notification every 30 seconds
setInterval(() => {
    loadNotifications();
    loadUnreadnotificationCount();
}, 30000);

let modulesByLoggedUser= getHttpServiceRequest("/loggedusermodule");
for(const module of modulesByLoggedUser){
    console.log(module);
    $('.'+module.name).css("display","none")
    console.log("")
}

let loggedUser= getHttpServiceRequest("/user/loggeduser");

if(loggedUser.userphoto!=null){
    imgUserImageOffCanvas.src= atob(loggedUser.userphoto);
    imgUserImage.src= atob(loggedUser.userphoto);
}
// admin
// if(loggedUser.roles.some(role => role.name === "Admin")){
//     if (administrationListElement) {
//         administrationListElement.style.display = "block";
//     }
//
//     if (memberRegistrationLinkElement) {
//         memberRegistrationLinkElement.style.display = "block";
//     }
//     if(purchaseListElement){
//         purchaseListElement.style.display = "block";
//     }
//     if(donationListElement){
//         donationListElement.style.display = "block";
//     }
//     if(newMembershipLinkElement){
//         newMembershipLinkElement.style.display = "block";
//     }
//
// }else {
//     //manager
//     if(loggedUser.employee_id.designation_id.name==="Manager"){
//         if (administrationListElement) {
//             administrationListElement.style.display = "block";
//         }
//
//         if (memberRegistrationLinkElement) {
//             memberRegistrationLinkElement.style.display = "block";
//         }
//         if(purchaseListElement){
//             purchaseListElement.style.display = "block";
//         }
//         if(donationListElement){
//             donationListElement.style.display = "block";
//         }
//         if(newMembershipLinkElement){
//             newMembershipLinkElement.style.display = "block";
//         }
//     }
//     //librarian
//     if(loggedUser.employee_id.designation_id.name==="Librarian"){
//         if (administrationListElement) {
//             administrationListElement.style.display = "none";
//         }
//
//         if (memberRegistrationLinkElement) {
//             memberRegistrationLinkElement.style.display = "block";
//         }
//         if(purchaseListElement){
//             purchaseListElement.style.display = "block";
//         }
//         if(donationListElement){
//             donationListElement.style.display = "block";
//         }
//         if(newMembershipLinkElement){
//             newMembershipLinkElement.style.display = "block";
//         }
//     }
//     //library - assistant
//     if(loggedUser.employee_id.designation_id.name==="Library Assistant"){
//         if (administrationListElement) {
//             administrationListElement.style.display = "none";
//         }
//
//         if (memberRegistrationLinkElement) {
//             memberRegistrationLinkElement.style.display = "none";
//         }
//         if(purchaseListElement){
//             purchaseListElement.style.display = "none";
//         }
//         if(donationListElement){
//             donationListElement.style.display = "none";
//         }
//         if(newMembershipLinkElement){
//             newMembershipLinkElement.style.display = "none";
//         }
//     }
// }

const logoutConfirmation=()=>{
    let userConfirmationMsg= "Are you sure to logout ? "
    Swal.fire({
        title: userConfirmationMsg,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#fb73a4",
        cancelButtonColor: "rgb(90,184,230)",
        confirmButtonText: "Yes",
        cancelButtonText: "Cancel",
        reverseButtons :true

    }).then((result)=>{
        if(result.isConfirmed){
            window.location.replace('/logout')
        }
    })
}


