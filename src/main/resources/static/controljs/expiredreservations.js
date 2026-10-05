
let tableBody= document.getElementById("tableBodyExpiredReservations");
let tableBodyMarkedAsExpiredReservations= document.getElementById("tableBodyMarkedAsExpiredReservations")

window.addEventListener("load",()=>{
    refreshExpiredReservationsTable()
    refreshMarkedAsExpiredReservationsTable()
})

const refreshExpiredReservationsTable=()=>{

    // IF table is already DataTable THEN remove it THEN create new DataTable
    if ($.fn.DataTable.isDataTable('#tableExpiredReservations')) {
        $('#tableExpiredReservations').DataTable().destroy();
    }

    let expiredreservations = ajaxGetrequest("/expiredreservationslist");

    // property array
    let displayProperty = [
        { propertyName: "reservationno", dataType: "string" },
        { propertyName: getBook, dataType: "function" },
        { propertyName: getMember, dataType: "function" },
        { propertyName: "reserveddate", dataType: "string" },
        { propertyName: "borrowdate", dataType: "string" },
        { propertyName: getReservationStatus, dataType: "function" }
    ];

    //fill data into table function
    fillDataIntoTableOnlyUpdate(
        tableBody,
        expiredreservations,
        displayProperty,
        updateStatusToExpired
    );

    $("#tableExpiredReservations").DataTable({
        responsive: true,
        autoWidth: false
    });

}

const getBook=(ob)=>{
    return ob.bookcopy_id.accessionno +" - " + ob.bookcopy_id.book_id.title;
}

const getMember=(ob)=>{
    return ob.member_id.memberno +" - " + ob.member_id.name;
}
const getReservationStatus=(ob)=>{
    return ob.reservationstatus_id.name;
}

const updateStatusToExpired=(dataOb)=>{
    reservation = getHttpServiceRequest("/reservation/byid/"+ dataOb.id);
    Swal.fire({
        title: "Confirm Update",
        html: `<p>Are you sure to update this reservation as expired?</p>`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ff0000ff",
        cancelButtonColor: "rgb(0, 102, 255)",
        confirmButtonText: "Yes, Update",
        cancelButtonText: "Cancel",
        reverseButtons: true

    }).then((result) => {
        if (result.isConfirmed) {
            let updateServiceResponse = getHttpServiceRequest("/reservation/updateasexpired", "PUT", reservation);
            if (updateServiceResponse == "OK") {
                //user confrim update
                Swal.fire({
                    title: "Updated!",
                    text: "Reservation updated as expired.",
                    icon: 'success',

                });
                //refresh table
                refreshExpiredReservationsTable();
            } else {
                // user cancel updates
                Swal.fire({
                    title: 'Update Failed',
                    html: `<p>Reservation could not be updated as expired.</p>
                <p>${updateServiceResponse}</p>`,
                    confirmButtonText: 'OK'
                });

            }
        }
    })
}

const refreshMarkedAsExpiredReservationsTable=()=>{

    // IF table is already DataTable THEN remove it THEN create new DataTable
    if ($.fn.DataTable.isDataTable('#tableMarkedAsExpiredReservations')) {
        $('#tableMarkedAsExpiredReservations').DataTable().destroy();
    }

    let markedasexpiredreservations = ajaxGetrequest("/reservation/expired");

    // property array
    let displayProperty = [
        { propertyName: "reservationno", dataType: "string" },
        { propertyName: getBook, dataType: "function" },
        { propertyName: getMember, dataType: "function" },
        { propertyName: "reserveddate", dataType: "string" },
        { propertyName: "borrowdate", dataType: "string" },
        { propertyName: getReservationStatus, dataType: "function" }
    ];

    //fill data into table function
    fillDataIntoTableInfo(
        tableBodyMarkedAsExpiredReservations,
        markedasexpiredreservations,
        displayProperty,
    );

    $("#tableMarkedAsExpiredReservations").DataTable({
        responsive: true,
        autoWidth: false
    });

}