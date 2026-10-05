
let tableBody= document.getElementById("tableBodyOverdueBorrowings");
let tableBodyMarkedAsOverdueBorrowings= document.getElementById("tableBodyMarkedAsOverdueBorrowings")

window.addEventListener("load",()=>{
    refreshOverdueBorrowingsTable()
    refreshMarkedAsOverdueTable()
})

const refreshOverdueBorrowingsTable=()=>{

    // IF table is already DataTable THEN remove it THEN create new DataTable
    if ($.fn.DataTable.isDataTable('#tableOverdueBorrowings')) {
        $('#tableOverdueBorrowings').DataTable().destroy();
    }

    let overdueborrowings = ajaxGetrequest("/overdues");

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
    fillDataIntoTableOnlyUpdate(
        tableBody,
        overdueborrowings,
        displayProperty,
        updateStatusToOverdue
    );

    $("#tableOverdueBorrowings").DataTable({
        responsive: true,
        autoWidth: false
    });

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

const updateStatusToOverdue=(dataOb)=>{
    borrowedbook = getHttpServiceRequest("/borrowhasbookcopy/byid/"+ dataOb.id);
    Swal.fire({
        title: "Confirm Update",
        html: `<p>Are you sure to update this book as overdue?</p>`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ff0000ff",
        cancelButtonColor: "rgb(0, 102, 255)",
        confirmButtonText: "Yes, Update",
        cancelButtonText: "Cancel",
        reverseButtons: true

    }).then((result) => {
        if (result.isConfirmed) {
            let updateServiceResponse = getHttpServiceRequest("/borrowhasbookcopy/updateasoverdue", "PUT", borrowedbook);
            if (updateServiceResponse == "OK") {
                //user confrim update
                Swal.fire({
                    title: "Updated!",
                    text: "Borrowed Book updated as overdue.",
                    icon: 'success',

                });
                //refresh table
                refreshOverdueBorrowingsTable();
            } else {
                // user cancel updates
                Swal.fire({
                    title: 'Update Failed',
                    html: `<p>Borrowed book could not be updated as overdue.</p>
                <p>${updateServiceResponse}</p>`,
                    confirmButtonText: 'OK'
                });

            }
        }
    })
}

const refreshMarkedAsOverdueTable=()=>{
    // IF table is already DataTable THEN remove it THEN create new DataTable
    if ($.fn.DataTable.isDataTable('#tableMarkedAsOverdueBorrowings')) {
        $('#tableMarkedAsOverdueBorrowings').DataTable().destroy();
    }

    let markedasoverdueborrowings = ajaxGetrequest("/borrowedbooks/overdue");

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
        tableBodyMarkedAsOverdueBorrowings,
        markedasoverdueborrowings,
        displayProperty
    );

    $("#tableMarkedAsOverdueBorrowings").DataTable({
        responsive: true,
        autoWidth: false
    });

}