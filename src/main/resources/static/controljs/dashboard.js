const membersCountElement= document.getElementById("membersCount")
const booksCountElement= document.getElementById("booksCount")
const borrowingsCountElement= document.getElementById("borrowingsCount")
const reservationsCountElement= document.getElementById("reservationsCount")
const overdueBooksCountElement= document.getElementById("overdueBooksCount")
let tableBody= document.getElementById("tableBodyCurrentBorrowings");

const quickAccessForLibrarianElement= document.getElementById("quickAccessForLibrarian");
const  quickAccessForLibraryAssistantElement= document.getElementById("quickAccessForLibraryAssistant");

window.addEventListener("load",()=>{
    getCountCardsValues();
    refreshCurrentBorrowingsTable()
})

// admin
if(loggedUser.roles.some(role => role.name === "Admin")){
    quickAccessForLibrarianElement.classList.remove("d-none");
    quickAccessForLibraryAssistantElement.classList.add("d-none");

}else {
    //manager
    if(loggedUser.employee_id.designation_id.name==="Manager"){
        quickAccessForLibrarianElement.classList.remove("d-none");
        quickAccessForLibraryAssistantElement.classList.add("d-none");
    }
    //librarian
    if(loggedUser.employee_id.designation_id.name==="Librarian"){
        quickAccessForLibrarianElement.classList.remove("d-none");
        quickAccessForLibraryAssistantElement.classList.add("d-none");
    }
    //library - assistant
    if(loggedUser.employee_id.designation_id.name==="Library Assistant"){
        quickAccessForLibrarianElement.classList.add("d-none");
        quickAccessForLibraryAssistantElement.classList.remove("d-none");
    }
}

const getCountCardsValues=()=>{
    let membersCount= getHttpServiceRequest("/members/count");
    membersCountElement.innerText= membersCount;

    let booksCount= getHttpServiceRequest("/books/count");
    booksCountElement.innerText= booksCount;

    let borrowingsCount= getHttpServiceRequest("/borrowings/count");
    borrowingsCountElement.innerText= borrowingsCount;

    let reservationsCount= getHttpServiceRequest("/reservations/count");
    reservationsCountElement.innerText= reservationsCount;

    let overdueCount= getHttpServiceRequest("/overdues/count");
    overdueBooksCountElement.innerText= overdueCount;

}

const refreshCurrentBorrowingsTable=()=>{

    let currentborrowings = ajaxGetrequest("/currentborrowings");

    // property array
    let displayProperty = [
        { propertyName: getBorrowCode, dataType: "function" },
        { propertyName: getBook, dataType: "function" },
        { propertyName: getMember, dataType: "function" },
        { propertyName: getBorrowDate, dataType: "function" },
        { propertyName: getHandoverDueDate, dataType: "function" },
        { propertyName: "renewdate", dataType: "string" },
        { propertyName: "renewhandoverduedate", dataType: "string" },
        { propertyName: getBorrowHasBookCopyStatus, dataType: "function" }
    ];

    //fill data into table function
    fillDataIntoTableInfo(
        tableBody,
        currentborrowings,
        displayProperty
    );

}

const getBorrowCode=(ob)=>{
    return ob.borrow_id.borrowcode;
}

const getBook=(ob)=>{
    return ob.bookcopy_id.accessionno +" - " + ob.bookcopy_id.book_id.title;
}

const getMember=(ob)=>{
    return ob.borrow_id.member_id.memberno +" - " + ob.borrow_id.member_id.name;
}

const getBorrowDate=(ob)=>{
    return ob.borrow_id.borrowdate;
}

const getHandoverDueDate=(ob)=>{
    return ob.borrow_id.handoverduedate;
}

const getBorrowHasBookCopyStatus=(ob)=>{
    return ob.borrowhasbookcopystatus_id.name;
}