
let tableBody= document.getElementById("tableBodyExpiredMemberships");
let tableBodyMarkedAsExpired= document.getElementById("tableBodyMarkedAsExpiredMemberships");

window.addEventListener("load",()=>{
    refreshExpiredMembershipsTable()
    refreshMarkedAsExpiredTable()
})

const refreshExpiredMembershipsTable=()=>{

    // IF table is already DataTable THEN remove it THEN create new DataTable
    if ($.fn.DataTable.isDataTable('#tableExpiredMemberships')) {
        $('#tableExpiredMemberships').DataTable().destroy();
    }

    let expiredmemberships = ajaxGetrequest("/expiredmembershipslist");

    // property array
    let displayProperty = [
        { propertyName: "membershipno", dataType: "string" },
        { propertyName: getMember, dataType: "function" },
        { propertyName: getMembershipType, dataType: "function" },
        { propertyName: getMembershipCategory, dataType: "function" },
        { propertyName: "startdate", dataType: "string" },
        { propertyName: "enddate", dataType: "string" },
        { propertyName: getMembershipStatus, dataType: "function" }
    ];

    //fill data into table function
    fillDataIntoTableOnlyUpdate(
        tableBody,
        expiredmemberships,
        displayProperty,
        updateStatusToExpired
    );

    $("#tableExpiredMemberships").DataTable({
        responsive: true,
        autoWidth: false
    });

}


const getMember=(ob)=>{
    return ob.member_id.memberno +" - " + ob.member_id.name;
}
const getMembershipType=(ob)=>{
    return ob.membershiptype_id.name;
}

const getMembershipCategory=(ob)=>{
    return ob.membershipcategory_id.name;
}

const getMembershipStatus=(ob)=>{
    return ob.membershipstatus_id.name;
}

const updateStatusToExpired=(dataOb)=>{
    membership = getHttpServiceRequest("/membership/byid/"+ dataOb.id);
    Swal.fire({
        title: "Confirm Update",
        html: `<p>Are you sure to update this membership as expired?</p>`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ff0000ff",
        cancelButtonColor: "rgb(0, 102, 255)",
        confirmButtonText: "Yes, Update",
        cancelButtonText: "Cancel",
        reverseButtons: true

    }).then((result) => {
        if (result.isConfirmed) {
            let updateServiceResponse = getHttpServiceRequest("/membership/updateasexpired", "PUT", membership);
            if (updateServiceResponse == "OK") {
                //user confrim update
                Swal.fire({
                    title: "Updated!",
                    text: "Membership updated as expired.",
                    icon: 'success',

                });
                //refresh table
                refreshExpiredMembershipsTable();
            } else {
                // user cancel updates
                Swal.fire({
                    title: 'Update Failed',
                    html: `<p>Membership could not be updated as expired.</p>
                <p>${updateServiceResponse}</p>`,
                    confirmButtonText: 'OK'
                });

            }
        }
    })
}

const refreshMarkedAsExpiredTable=()=>{
    // IF table is already DataTable THEN remove it THEN create new DataTable
    if ($.fn.DataTable.isDataTable('#tableMarkedAsExpiredMemberships')) {
        $('#tableMarkedAsExpiredMemberships').DataTable().destroy();
    }

    let markedasexpiredmemberships = ajaxGetrequest("/memberships/expired");

    // property array
    let displayProperty = [
        { propertyName: "membershipno", dataType: "string" },
        { propertyName: getMember, dataType: "function" },
        { propertyName: getMembershipType, dataType: "function" },
        { propertyName: getMembershipCategory, dataType: "function" },
        { propertyName: "startdate", dataType: "string" },
        { propertyName: "enddate", dataType: "string" },
        { propertyName: getMembershipStatus, dataType: "function" }
    ];

    //fill data into table function
    fillDataIntoTableInfo(
        tableBodyMarkedAsExpired,
        markedasexpiredmemberships,
        displayProperty
    );

    $("#tableMarkedAsExpiredMemberships").DataTable({
        responsive: true,
        autoWidth: false
    });

}