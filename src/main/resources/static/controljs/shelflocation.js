const tabpaneForm = document.getElementById("shelfLocationTabPillForm");
const tabPaneTable = document.getElementById("shelfLocationTabPillTable");
const tabPillForm = document.getElementById("shelfLocationFormPill");
const tabPillTable = document.getElementById("shelfLocationTablePill");

let tableBody = document.querySelector("#tableBodyShelfLocation");
let tableBodyInnerForm= document.getElementById("tableBodyShelfLocations");

const selectDisplayCategoryElement= document.getElementById("selectDisplayCategory");
const selectBuildingElement= document.getElementById("selectBuilding");
const selectFloorElement= document.getElementById("selectFloor");
const selectRackElement= document.getElementById("selectRack");
const selectRowElement= document.getElementById("selectRow")
const textLocationCodeElement= document.getElementById("textLocationCode");

// browser load event call
window.addEventListener("load", () => {
    // enable tooltip
    $('[data-bs-toggle="tooltip"]').tooltip();

    userPrivi=getHttpServiceRequest("/userprivilegebymodule?modulename=Shelf-Location")
    //call table refresh function
    refreshShelfLocationtable();
    //call form refresh funcion
    refreshShelfLocationForm();
})

const disableElement=()=>{
    selectDisplayCategoryElement.disabled= true;
    selectBuildingElement.disabled= true;
    selectRowElement.disabled= true;
}

const refreshShelfLocationtable=()=>{
    // IF table is already DataTable THEN remove it THEN create new DataTable
    if ($.fn.DataTable.isDataTable('#tableShelfLocation')) {
        $('#tableShelfLocation').DataTable().destroy();
    }

    shelflocations= new Array();
    shelflocations= ajaxGetrequest("/shelflocation/alldata");

    // property array
    let displayProperty = [
        { propertyName: getDisplayCategory, dataType: "function" },
        { propertyName: getShelfLocations, dataType: "function" }
    ];
    fillDataIntoTableEight(
        tableBody,
        shelflocations,
        displayProperty,
        refillShelfLocationForm
    )
    buttonSubmit.classList.remove("d-none");
    buttonUpdate.classList.add("d-none");
    buttonPrint.classList.add("d-none");
    buttonDelete.classList.add("d-none");
    buttonSubmitInnerForm.classList.remove("d-none");
    buttonUpdateInnerForm.classList.add("d-none");

    $("#tableShelfLocation").DataTable({
        responsive: true,
        autoWidth: false
    });

}

//define function for get Display Category
const getDisplayCategory=(ob)=>{
    return ob.displaycategory_id.name;
}

const getShelfLocations=(ob)=>{
    if(!ob.shelfLocationList || ob.shelfLocationList.length===0){
        return "-";
    }
    let shelfLocations= ob.shelfLocationList.map(shlistitem=> shlistitem.locationcode);
    return shelfLocations.join(", ")
}

const refillShelfLocationForm=(dataOb)=>{
    console.log(dataOb);

    // shift to tab pane form
    tabpaneForm.classList.add('show', 'active');
    tabPaneTable.classList.remove('show', 'active');
    // shift to  form pill tab
    tabPillForm.classList.add('show', 'active');
    tabPillTable.classList.remove('show', 'active');

    shelflocation = ajaxGetrequest("/shelflocation/byid/"+ dataOb.id);
    oldShelflocation = ajaxGetrequest("/shelflocation/byid/"+ dataOb.id);

    selectDisplayCategoryElement.value= JSON.stringify(shelflocation.displaycategory_id)

    refreshInnerFormAndTable();

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
    // buttonSubmitInnerForm.classList.add("d-none");
    buttonPrint.classList.remove("d-none")

    // hide update button
    // buttonClearInnerForm

    setInitial([
        selectDisplayCategoryElement
    ])
}

// delete function
const deleteShelfLocationRecord=(dataOb)=>{
    //  confirmation
    // / <p>Shelf Locations : <strong>${ || ''}</strong></p>
    shelflocation = getHttpServiceRequest("/shelflocation/byid/"+ dataOb.id)
    Swal.fire({
        title: "Confirm Deletion",
        html: `<p>Are you sure to Delete this Shelf Location Record ?</p>
          <p>Display Category : <strong>${ shelflocation.displaycategory_id.name|| ''}</strong><br></p>
           
`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ff0000ff",
        cancelButtonColor: "rgb(0, 102, 255)",
        confirmButtonText: "Yes, Delete",
        cancelButtonText: "Cancel",
        reverseButtons: true

    }).then((result) => {
        if (result.isConfirmed) {
            let deleteServiceResponse = getHttpServiceRequest("/shelflocation/delete", "DELETE", dataOb)
            if (deleteServiceResponse == "OK") {
                Swal.fire({
                    title: "Deleted!",
                    text: "Shelf Location Record Deleted Successfully.",
                    icon: 'success',

                });
                //refresh table
                refreshShelfLocationtable();
                refreshShelfLocationForm();

                // shift to tab pane table
                tabpaneForm.classList.remove('show', 'active');
                tabPaneTable.classList.add('show', 'active');

                // shift to  table pill tab
                tabPillForm.classList.remove('show', 'active');
                tabPillTable.classList.add('show', 'active');
            } else {
                Swal.fire({
                    title: 'Deletion Failed',
                    html: `<p>Shelf Location record could not be deleted.</p>
                <p>Details: ${deleteServiceResponse}</p>`,
                    confirmButtonText: 'OK'
                });
            }
        } else {
            //refresh table
        }
    })
}

// print function
const printShelfLocationRecord=(dataOb)=>{
    let shelfLocationModal_view = new bootstrap.Modal(
        document.getElementById("modalShelfLocationView"),
        {}
    );
    shelfLocationModal_view.show();
    shelflocation= getHttpServiceRequest("/shelflocation/byid/"+ dataOb.id);

    tdDisplayCategory.innerText= shelflocation.displaycategory_id.name;
    tdShelfLocations

    if(!dataOb.shelfLocationList || dataOb.shelfLocationList.length===0){
        return "-";
    }
    let shelfLocations= dataOb.shelfLocationList.map(shlocation=>shlocation.locationcode);
    tdShelfLocations.innerText=shelfLocations.join(", ");
}

const printShelfLocations=()=>{
    let tab = window.open();
    tab.document.write('<html>'
        + '<head><title>Print Shelf Locations Record</title>'
        + '<link rel="stylesheet" href="../resources/bootstrap-5.2.3/css/bootstrap.min.css"/>'
        + '</head>'
        + '<body>'
        + divCardPrintShelfLocation.outerHTML
        + '</body></html>');

    setInterval(() => {
        tab.stop();
        tab.print();
        tab.close();
    }, 700);
}

const refreshShelfLocationForm=()=>{
    // no need ?
    shelfLocationForm.reset();

    if(!userPrivi.privi_insert){
        disableElement();
        buttonSubmit.classList.add("d-none");
        buttonSubmitInnerForm.classList.add("d-none");
        tabpaneForm.classList.remove('show', 'active');
        tabPillForm.classList.remove('show','active')
        tabPaneTable.classList.add('show', 'active');
        tabPillTable.classList.add('show','active')
    }
    shelflocation= new Object();
    shelflocation.shelfLocationList= new Array();

    let displaycategories= ajaxGetrequest("/displaycategory/alldata")
    fillDataIntoSelect(selectDisplayCategoryElement,"Please Select Dispaly Category" , displaycategories, "name")

    let buildings= ajaxGetrequest("/building/alldata")
    fillDataIntoSelect(selectBuildingElement, "Select Building", buildings, "name")

    refreshInnerFormAndTable();

    setInitial([
        selectDisplayCategoryElement
    ])
}

//check purchase form errors
const checkShelfLocationFormErrors=()=>{
    let errors="";
    if(shelflocation.displaycategory_id == null){
        errors+="Please Select Display Category.<br>";
        selectDisplayCategoryElement.style.borderBottom="2px solid pink"
    }

    if(shelflocation.shelfLocationList.length == 0){
        errors+="Please Add Locations.<br>";
    }
    return errors;
}

// purchase submit function
const shelfLocationSubmitButton=()=>{
    console.log(shelflocation);
    let formErrors = checkShelfLocationFormErrors();
    if (formErrors === "") {
        // form has not any errors
        Swal.fire({
            title: "Confirm Save",
            html: `<p>Are you sure to save this Shelf Location record?</p>`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ff0000ff",
            cancelButtonColor: "rgb(0, 102, 255)",
            confirmButtonText: "Yes, Save",
            cancelButtonText: "Cancel",
            reverseButtons: true,

        }).then((result) => {
            if (result.isConfirmed) {

                // call post service
                let postServiceResponse = getHttpServiceRequest("/shelflocation/save", "POST", shelflocation);

                if (postServiceResponse == "OK") {
                    // save successs
                    Swal.fire({
                        title: "Saved!",
                        text: "Shelf Location record saved successfully.",
                        icon: 'success',

                    });
                    refreshShelfLocationtable();
                    refreshShelfLocationForm();
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
                        html: `<p>Shelf Location record could not be saved.</p>
                <p>Details: ${postServiceResponse}</p>`,
                        confirmButtonText: 'OK'
                    });

                }
            } else {
                //get user confirm for form discard
                // can get user confirmation for form refresh
                Swal.fire({
                    title: "Confirm Refresh",
                    text: "Do you need to refresh shelf location form ?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#ff0000ff",
                    cancelButtonColor: "rgb(0, 102, 255)",
                    confirmButtonText: "OK",
                    reverseButtons:true,

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

// check purchase form updates
const checkShelfLocationFormUpdates=()=>{
    let updates="";
    if(shelflocation!= null && oldShelflocation!= null){
        if (JSON.stringify(shelflocation.shelfLocationList) !== JSON.stringify(oldShelflocation.shelfLocationList)) {
            updates += "Locations are changed.<br>";
        }
    }return updates;
}

// update form function
const shelfLocationUpdateButton=()=>{
// need to check  all required feild with valid value
    let formErrors = checkShelfLocationFormErrors();
    if (formErrors == "") {
        let formUpdates = checkShelfLocationFormUpdates();
        if (formUpdates == "") {
            //no updates
            Swal.fire({
                title: 'Update Failed',
                text: "Form has not any changes to update.",
                confirmButtonText: 'OK'
            });
        } else {
            //has updates
            Swal.fire({
                title: "Confirm Update",
                html: `<p>Are you sure to update this shelf location record?</p>
            <p>${formUpdates}</p>`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#ff0000ff",
                cancelButtonColor: "rgb(0, 102, 255)",
                confirmButtonText: "Yes, Update",
                cancelButtonText: "Cancel",
                reverseButtons: true,

            }).then((result) => {
                if (result.isConfirmed) {
                    let updateServiceResponse = getHttpServiceRequest("/shelflocation/update", "PUT", shelflocation);


                    if (updateServiceResponse == "OK") {
                        //user confrim update
                        Swal.fire({
                            title: "Updated!",
                            text: "Shelf Location record updated successfully.",
                            icon: 'success',

                        });
                        //refresh form and table
                        refreshShelfLocationtable();
                        refreshShelfLocationForm();

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
                            html: `<p>Shelf Location record could not be updated.</p>
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

const genereteLocationCode=()=>{
    let buildingText =JSON.parse(selectBuildingElement.value).name;
    let  floorText=  JSON.parse(selectFloorElement.value).name;
    let  rackText=  JSON.parse(selectRackElement.value).name;
    let  rowText=  JSON.parse(selectRowElement.value).name;
    // buildingNo- Building 1 - B1
    let buildingNo= buildingText.match(/\d+/)[0];
    // floorNo 1st Floor - F1
    let floorNo= floorText.match(/\d+/)[0];
    // rackNo Rack 1 - R1
    let rackNo= rackText.match(/\d+/)[0];
    // rowNo Row 1 - R1
    let rowNo= rowText.match(/\d+/)[0];

    let locationCode = `B${buildingNo}-F${floorNo}-R${rackNo}-${rowNo}`;
    //let locationCode= "B"+buildingNo+"-"+"F"+floorNo+"-"+"R"+rackNo+"-"+rowNo ;
    textLocationCodeElement.value= locationCode;
    shelflocationItem.locationcode= locationCode
    textLocationCodeElement.style.borderBottom="2px solid lightgreen"
}

const filterFloorByBuilding=()=>{
    let building= JSON.parse(selectBuildingElement.value);
    let floorByBuilding = ajaxGetrequest("/floor/bybuilding/"+building.id);
    fillDataIntoSelect(selectFloorElement,"Select Floor",floorByBuilding,"name")
    selectFloorElement.disabled=false;

}

const filterRackByFloor=()=>{
    let floor= JSON.parse(selectFloorElement.value);
    let rackByFloor = ajaxGetrequest("/rack/byfloor/"+floor.id);
    fillDataIntoSelect(selectRackElement,"Select Rack",rackByFloor,"name")
    selectRackElement.disabled=false;
}

const filterRowByRack=()=>{
    let rack= JSON.parse(selectRackElement.value);
    let rowByRack = ajaxGetrequest("/row/byrack/"+rack.id);
    let filteredRows = rowByRack.filter(row =>
        !shelflocation.shelfLocationList.some(location =>
            location.rackrow_id.id === row.id &&
            location.rackrow_id.rack_id.id === rack.id
        )
    );
    fillDataIntoSelect(selectRowElement,"Select Row",filteredRows,"name")

    selectRowElement.disabled=false;
}

// refresh inner form and table
const refreshInnerFormAndTable=()=>{
    // refresh form area
    shelflocationItem= new Object();

    let buildings= ajaxGetrequest("/building/alldata")
    fillDataIntoSelect(selectBuildingElement, "Select Building", buildings, "name")
    selectFloorElement.value= "";
    selectRackElement.value= "";
    selectRowElement.value= "";
    textLocationCodeElement.value= "";

    selectFloorElement.disabled=true;
    selectRackElement.disabled=true;
    selectRowElement.disabled=true;
    textLocationCodeElement.disabled=true;


    setInitial([
        selectBuildingElement,
        selectFloorElement,
        selectRackElement,
        selectRowElement,
        textLocationCodeElement
    ])

    // refrsh table area= fill table
    let innerColumns = [
        { propertyName: "locationcode", dataType: "string" },
        { propertyName: getBuilding, dataType: "function" },
        { propertyName: getFloor, dataType: "function" },
        { propertyName: getRack, dataType: "function" },
        { propertyName: getRow, dataType: "function" }
    ];

    fillDataIntoInnerTable(
        tableBodyInnerForm,
        shelflocation.shelfLocationList,
        innerColumns,
        editInnerShelfLocationForm,
        deleteInnerShelfLocation
    )

    buttonUpdateInnerForm.classList.add("d-none");
    buttonSubmitInnerForm.classList.remove("d-none");
}

const getBuilding=(dataOb)=>{
 return dataOb.rackrow_id.rack_id.floor_id.building_id.name;
}
const getFloor=(dataOb)=>{
    return dataOb.rackrow_id.rack_id.floor_id.name;
}
const getRack=(dataOb)=>{
    return dataOb.rackrow_id.rack_id.name;
}
const getRow=(dataOb)=>{
    return dataOb.rackrow_id.name;
}

// edit shelflocation form table
const editInnerShelfLocationForm=(dataOb)=>{
    buttonUpdateInnerForm.classList.remove("d-none");
    buttonSubmitInnerForm.classList.add("d-none");

    shelflocationItem= JSON.parse(JSON.stringify(dataOb));
    oldShelflocationItem= JSON.parse(JSON.stringify(dataOb));

    selectBuildingElement.value= JSON.stringify(shelflocationItem.rackrow_id.rack_id.floor_id.building_id)
    filterFloorByBuilding();
    selectFloorElement.value= JSON.stringify(shelflocationItem.rackrow_id.rack_id.floor_id)
    filterRackByFloor();
    selectRackElement.value=JSON.stringify(shelflocationItem.rackrow_id.rack_id)
    filterRowByRack();
    selectRowElement.value= JSON.stringify(shelflocationItem.rackrow_id)

    textLocationCodeElement.value= shelflocationItem.locationcode  ;

}

// delete shelflocation from table
const deleteInnerShelfLocation=(dataOb)=>{

    Swal.fire({
        title: "Confirm Remove",
        html: `<p>Are you sure to remove Shelf Location?</p>`,
        icon: "warning",
        confirmButtonColor: "#ff0000ff",
        confirmButtonText: "Yes, Remove",

    }).then((result) => {
        if (result.isConfirmed) {
            let index = shelflocation.shelfLocationList.map(shlocation=>shlocation.id).indexOf(dataOb.id)

            if (index > -1) {
                shelflocation.shelfLocationList.splice(index, 1);
                refreshInnerFormAndTable();
                Swal.fire({
                    title: "Removed!",
                    text: "Shelf Location Removed successfully.",
                    icon: 'success',

                });
            }
        }
    })
}

// check inner form errors
const checkInnerShelfLocationErrors=()=>{
    let errors="";
    //row
    if(shelflocationItem.rackrow_id==null){
        errors += "Please Select Row.<br>";
        selectRowElement.style.borderBottom="2px solid pink";
    }
    //rack
    if(shelflocationItem.rackrow_id.rack_id==null){
        errors += "Please Select Rack.<br>";
        selectRackElement.style.borderBottom="2px solid pink";
    }
    // floor
    if(shelflocationItem.rackrow_id.rack_id.floor_id==null){
        errors += "Please Select Floor.<br>";
        selectRackElement.style.borderBottom="2px solid pink";
    }
    // building
    if(shelflocationItem.rackrow_id.rack_id.floor_id.building_id==null){
        errors += "Please Select Building.<br>";
        selectRackElement.style.borderBottom="2px solid pink";
    }
    // check shelf location item if added before for any category
    let locations= getHttpServiceRequest("/shelflocation/alldata")

    let foundLocation = locations.find(shl => shl.shelfLocationList && shl.shelfLocationList.some(item => item.locationcode === shelflocationItem.locationcode))
    if (foundLocation != null) {
        errors += "This Location already assigned to "+
            foundLocation.displaycategory_id.name+" Display Category"+".<br>";
            textLocationCodeElement.style.borderBottom = "2px solid pink";
    }
    // if shelflocationItem.locationcode exits give msg telling this location code is already assigned to particular category

    return errors;
}

// submit inner form function
const innerShelfLocationSubmit=()=>{
    console.log(shelflocationItem);
    let errors = checkInnerShelfLocationErrors();
    if (errors === "") {
        // form has not any errors
        Swal.fire({
            title: "Confirm Save",
            html: `<p>Are you sure to add Inner Shelf Location?</p>`,
            icon: "warning",
            confirmButtonColor: "#ff0000ff",
            confirmButtonText: "Yes, Add",

        }).then((result) => {
            if (result.isConfirmed) {

                Swal.fire({
                    title: "Added!",
                    text: "Shelf Location successfully.",
                    icon: 'success',

                });
                // push
                shelflocation.shelfLocationList.push(shelflocationItem)

                refreshInnerFormAndTable();
            }
        })
    } else {
        // form has errors
        Swal.fire({
            title: 'Save Failed',
            html: `<p>Form has Following Errors.</p>
                <p>${errors}</p>`,
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }

}

// check inner form updates
const checkInnerShelfLocationUpdates=()=>{
    let updates="";
    if(shelflocationItem!= null && oldShelflocationItem!=null){
        if(shelflocationItem.rackrow_id!=oldShelflocationItem.rackrow_id){
        updates+="Row is changed " +
            oldShelflocationItem.rackrow_id.name+" into "+
            shelflocationItem.rackrow_id.name+
            ".<br>"
        }
        if(shelflocationItem.rackrow_id.rack_id!=oldShelflocationItem.rackrow_id.rack_id){
        updates+="Rack is changed " +
            oldShelflocationItem.rackrow_id.rack_id.name+" into "+
            shelflocationItem.rackrow_id.rack_id.name+
            ".<br>"
        }
        if(shelflocationItem.rackrow_id.rack_id.floor_id!=oldShelflocationItem.rackrow_id.rack_id.floor_id){
        updates+="Floor is changed " +
            oldShelflocationItem.rackrow_id.rack_id.floor_id.name+" into "+
            shelflocationItem.rackrow_id.rack_id.floor_id.name+
            ".<br>"
        }
        if(shelflocationItem.rackrow_id.rack_id.floor_id.building_id!=oldShelflocationItem.rackrow_id.rack_id.floor_id.building_id){
            updates+="Building is changed " +
                oldShelflocationItem.rackrow_id.rack_id.floor_id.building_id.name+" into "+
                shelflocationItem.rackrow_id.rack_id.floor_id.building_id.name+
                ".<br>"
        }
        if(shelflocationItem.locationcode!=oldShelflocationItem.locationcode){
            updates+="Building is changed " +
                oldShelflocationItem.locationcode+" into "+
                shelflocationItem.locationcode+
                ".<br>"
        }
    }
    return updates;
}

// update inner form function
const innerShelfLocationUpdate=()=>{
    console.log(shelflocationItem);
    let errors = checkInnerShelfLocationErrors();
    if (errors === "") {
        let updates= checkInnerShelfLocationUpdates();
        if(updates===""){
            //no updates
            Swal.fire({
                title: 'Update Failed',
                text: "Form has not any changes to update.",
                confirmButtonText: 'OK'
            });
        }else{
            // form has not any errors
            Swal.fire({
                title: "Confirm Update",
                html: `<p>Are you sure to update this Location?</p>`,
                icon: "warning",
                confirmButtonColor: "#ff0000ff",
                cancelButtonColor: "rgb(0, 102, 255)",
                confirmButtonText: "Yes, Update",
                cancelButtonText: "Cancel",
                reverseButtons: true,

            }).then((result) => {
                if (result.isConfirmed) {
                    let extIndex= shelflocation.shelfLocationList.map(shlocation=>shlocation.id).indexOf(shelflocationItem.id);
                    if(extIndex>-1){
                        shelflocation.shelfLocationList[extIndex].rackrow_id= shelflocationItem.rackrow_id;
                        shelflocation.shelfLocationList[extIndex].locationcode= shelflocationItem.locationcode;
                    }
                    Swal.fire({
                        title: "Updated!",
                        text: "Book Updated successfully.",
                        icon: 'success',

                    });
                    refreshInnerFormAndTable();
                }
            })
        }
    } else {
        // form has errors
        Swal.fire({
            title: 'Save Failed',
            html: `<p>Form has Following Errors.</p>
                <p>${errors}</p>`,
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
}


