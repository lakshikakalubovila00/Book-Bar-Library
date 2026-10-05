// tab panes

const tabpaneForm = document.getElementById("bookCopiesTabPillForm");
const tabPaneTable = document.getElementById("bookCopiesTabPillTable");
const tabPillForm = document.getElementById("bookCopiesFormPill");
const tabPillTable = document.getElementById("bookCopiesTablePill");

const tableBody= document.getElementById("tableBodyBookCopies");

const selectBookElement= document.getElementById("selectBook")
const selectAcquisitionMethodElement= document.getElementById("selectAcquisitionMethod");
const acquisitionDateElement= document.getElementById("acquisitionDate");
const selectDamageStatusElement= document.getElementById("selectDamageStatus");
const selectBookCopyStatusElement= document.getElementById("selectBookCopyStatus");
const tableBodyAddedBookCopies= document.getElementById("addedBookCopiesTableBody");

const selectedBookElement= document.getElementById("selectedBook");
const addedTextAccessionNoElement= document.getElementById("addedTextAccessionNo");
const selectedAcquisitionMethodElement= document.getElementById("selectedAcquisitionMethod");
const addedAcquisitionDateElement= document.getElementById("addedAcquisitionDate");
const selectedDamageStatusElement= document.getElementById("selectedDamageStatus");
const selectedStatusElement= document.getElementById("selectedStatus");
const radioYesElement= document.getElementById("radioYes");
const radioNoElement= document.getElementById("radioNo");

window.addEventListener("load",()=>{
     // enable tooltip
  $('[data-bs-toggle="tooltip"]').tooltip();
    userPrivi=getHttpServiceRequest("/userprivilegebymodule?modulename=Book-Copies")
    refreshBookCopiesForm()
    refreshBookCopiestable();
    refershBookCopyForm();
})


// define refresh table function
const refreshBookCopiestable = () => {
    // IF table is already DataTable THEN remove it THEN create new DataTable
    if ($.fn.DataTable.isDataTable('#tableBookCopies')) {
        $('#tableBookCopies').DataTable().destroy();
    }
    //data array
    let bookscopies = ajaxGetrequest("/bookcopies/alldata/orderbydesc");

    // property array
    let displayProperty = [
        { propertyName: getBookTitle, dataType: "function" },
        { propertyName: "copyno", dataType: "string" },
        { propertyName: "accessionno", dataType: "string" },
        { propertyName: getAcquisitionMethod, dataType: "function" },
        { propertyName: "acquisitiondate", dataType: "string" },
        { propertyName: getDamageStatus, dataType: "function" },
        { propertyName: getIsReservation, dataType: "function" },
        { propertyName: getBookCopyStatus, dataType: "function" }
    ];

    //fill data into table function
    fillDataIntoTable(
        tableBody,
        bookscopies,
        displayProperty,
        refillBookCopyForm,
        deleteBookCopyRecord,
        printBookCopyRecord
    );

    buttonSubmit.classList.remove("d-none");

    $("#tableBookCopies").DataTable({
        responsive: true,
        autoWidth: false
    });
}

const getBookTitle=(ob)=>{
    return ob.book_id.title;
}
const getAcquisitionMethod=(ob)=>{
    return ob.acquisitionmethod_id.name;
}
const getDamageStatus=(ob)=>{
    return ob.damagestatus_id.name;
}

const getIsReservation=(ob)=>{
    if(ob.isreserved==true){
        return "Yes"
    }else{
        return "No"
    }
}
const getBookCopyStatus = (ob) => {
    if (ob.bookcopystatus_id.name == "Available") {
        return '<i class="fa-solid fa-square-check fa-lg" style="color: rgb(0, 189, 72);"></i>';
    }
    if (ob.bookcopystatus_id.name == "Borrowed") {
        return '<i class="fa-solid fa-download fa-lg" style="color: #4bb1ff;"></i>';
    }
    if (ob.bookcopystatus_id.name == "Reference") {
        return '<i class="fa-solid fa-ban fa-lg " style="color: #525252;"></i>';
    }
    if (ob.bookcopystatus_id.name == "Deleted") {
        return '<i class="fa-solid fa-trash fa-lg" style="color: rgb(255, 0, 0);"></i>';
    }
}

const refershBookCopyForm=()=>{

    bookCopyForm.reset();

    if(!userPrivi.privi_update){
        selectedAcquisitionMethodElement.disabled=true;
        addedAcquisitionDateElement.disabled=true;
        selectedDamageStatusElement.disabled=true;
        selectedStatusElement.disabled=true;
    }

    let books= getHttpServiceRequest("/book/alldata");
    fillDataIntoSelect(
        selectedBookElement,
        "Select Book",
        books,
        "title"
    )

    let acquisitionmethods= getHttpServiceRequest("/acquisitionmethod/alldata")
    fillDataIntoSelect(
        selectedAcquisitionMethodElement,
        "Select Acquisition Method",
        acquisitionmethods,
        "name"
    )

    let damagestatus= getHttpServiceRequest("/damagestatus/alldata")
    fillDataIntoSelect(
        selectedDamageStatusElement,
        "Select Damage Status",
        damagestatus,
        "name"
    )
    let bookcopystatus= getHttpServiceRequest("/bookcopystatus/alldata")
    fillDataIntoSelect(
        selectedStatusElement,
        "Select Book Copy Status",
        bookcopystatus,
        "name"
    )

    setInitial([
        selectedBookElement,
        addedTextAccessionNoElement,
        selectedAcquisitionMethodElement,
        addedAcquisitionDateElement,
        selectedDamageStatusElement,
        selectedStatusElement
    ])

}

const refillBookCopyForm=(dataOb)=>{

    bookcopyUpdate= getHttpServiceRequest("/bookcopy/byid/"+dataOb.id);
    oldBookCopyUpdate= getHttpServiceRequest("/bookcopy/byid/"+dataOb.id);

    // show book copy modal
    $("#modalBookCopyUpdateView").modal("show");

    selectedBookElement.value= JSON.stringify(bookcopyUpdate.book_id) ;
    addedTextAccessionNoElement.value= bookcopyUpdate.accessionno  ;
    selectedAcquisitionMethodElement.value= JSON.stringify(bookcopyUpdate.acquisitionmethod_id)  ;
    addedAcquisitionDateElement.value= bookcopyUpdate.acquisitiondate  ;
    selectedDamageStatusElement.value= JSON.stringify(bookcopyUpdate.damagestatus_id) ;
    selectedStatusElement.value= JSON.stringify(bookcopyUpdate.bookcopystatus_id) ;

    if(bookcopyUpdate.isreserved==true){
        radioYesElement.checked=true
        radioYesElement.disabled=true;
        radioNoElement.disabled=true;
    }else{
        radioNoElement.checked=true
        radioYesElement.disabled=true;
        radioNoElement.disabled=true;
    }

    if(!userPrivi.privi_update){
        buttonUpdate.classList.add("d-none");
    }else {
        buttonUpdate.classList.remove("d-none");
    }
}

//check form errors
const checkBookCopyFormErrors=()=>{
    let errors="";
    if(bookcopyUpdate.acquisitionmethod_id== null){
        errors+="Please Select Acquisition Method.<br>"
    }
    if(bookcopyUpdate.damagestatus_id== null){
        errors+="Please Select Damage Status.<br>"
    }
    if(bookcopyUpdate.bookcopystatus_id== null){
        errors+="Please Select Book Copy Status.<br>"
    }
    return errors;
}

// define check updates function
const checkBookCopyFormUpdates=()=>{
    let updates="";
    if(bookcopyUpdate!=null && oldBookCopyUpdate!=null){

        if (bookcopyUpdate.acquisitionmethod_id.name != oldBookCopyUpdate.acquisitionmethod_id.name) {
            updates += "Acquisition Method is changed " + oldBookCopyUpdate.acquisitionmethod_id.name + " into " + bookcopyUpdate.acquisitionmethod_id.name + ".<br>";
        }
        if (bookcopyUpdate.acquisitiondate != oldBookCopyUpdate.acquisitiondate) {
            updates += "Acquisition Date is changed " + oldBookCopyUpdate.acquisitiondate + " into " + bookcopyUpdate.acquisitiondate + ".<br>";
        }
        if (bookcopyUpdate.damagestatus_id.name != oldBookCopyUpdate.damagestatus_id.name) {
            updates += "Damage Status is changed " + oldBookCopyUpdate.damagestatus_id.name + " into " + bookcopyUpdate.damagestatus_id.name + ".<br>";
        }
        if (bookcopyUpdate.bookcopystatus_id.name != oldBookCopyUpdate.bookcopystatus_id.name) {
            updates += "Book Copy Status is changed " + oldBookCopyUpdate.bookcopystatus_id.name + " into " + bookcopyUpdate.bookcopystatus_id.name + ".<br>";
        }
    }
    return updates;
}

// define function for update record
const updateBookCopy = () => {
    console.log(bookcopyUpdate);
    // need to check  all required feild with valid value
    let formErrors = checkBookCopyFormErrors();
    if (formErrors == "") {
        let formUpdates = checkBookCopyFormUpdates();
        if (formUpdates == "") {
            //no updates
            Swal.fire({
                title: 'Update Failed',
                text: "Form has not any changes to update.",
                confirmButtonText: 'OK'
            });
        } else {
            // has updates
            Swal.fire({
                title: "Confirm Update",
                html: `<p>Are you sure to update this Book Copy record?</p>
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
                    let updateServiceResponse = getHttpServiceRequest("/bookcopy/update", "PUT", bookcopyUpdate);
                    if (updateServiceResponse == "OK") {
                        //user confrim update
                        Swal.fire({
                            title: "Updated!",
                            text: "Book Copy record updated successfully.",
                            icon: 'success',

                        });
                        //refresh form and table
                        refreshBookCopiestable();
                        refershBookCopyForm();

                        $("#modalBookCopyUpdateView").modal("hide");

                    } else {
                        // user cancel updates
                        Swal.fire({
                            title: 'Update Failed',
                            html: `<p>Book Copy record could not be updated.</p>
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

// define function for  delete
const deleteBookCopyRecord = (dataOb) => {
    // confrimation
    bookcopy = getHttpServiceRequest("/bookcopy/byid/"+dataOb.id)
    Swal.fire({
        title: "Confirm Deletion",
        html: `<p>Are you sure to Delete this Book Copy Record ?</p>
          <p>Accession No <strong>${bookcopy.accessionno || ''}</strong><br>
           Book name : <strong>${bookcopy.book_id.title || ''}</strong></p>`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ff0000ff",
        cancelButtonColor: "rgb(0, 102, 255)",
        confirmButtonText: "Yes, Delete",
        cancelButtonText: "Cancel",
        reverseButtons: true

    }).then((result) => {
        if (result.isConfirmed) {
            let deleteServiceResponse = getHttpServiceRequest("/bookcopy/delete", "DELETE", dataOb)
            if (deleteServiceResponse == "OK") {
                Swal.fire({
                    title: "Deleted!",
                    text: "Book Copy Record Deleted Successfully.",
                    icon: 'success',
                });
                //refresh table
                refreshBookCopiestable();
                // refersh form


            } else {
                Swal.fire({
                    title: 'Deletion Failed',
                    html: `<p>Book Copy Record Could not be Deleted.</p>
                <p>Details: ${deleteServiceResponse}</p>`,
                    confirmButtonText: 'OK'
                });
            }
        } else {
            //refresh table
        }
    })
}

// print - fill into the modal
const printBookCopyRecord=(dataOb)=>{

    let bookCopyModal_view = new bootstrap.Modal(
        document.getElementById("modalBookCopyView"), {}
    );

    bookCopyModal_view.show();

    tdAccessionNo.innerText= dataOb.accessionno;
    tdBook.innerText= dataOb.book_id.title ;
    tdAcquisitionMethod.innerText= dataOb.acquisitionmethod_id.name ;
    tdAcquisitionDate.innerText= dataOb.acquisitiondate ;
    tdDamageStatus.innerText= dataOb.damagestatus_id.name ;
    tdBookCopyStatus.innerText= dataOb.bookcopystatus_id.name ;
    if(dataOb.isreserved===true){
        tdIsReserved.innerText= "Yes" ;
    }else{
        tdIsReserved.innerText= "No" ;
    }
}

// print function
const printBookCopy = () => {
    let tab = window.open();
    tab.document.write('<html>'
        + '<head><title>Print Book Copy Record</title>'
        + '<link rel="stylesheet" href="../resources/bootstrap-5.2.3/css/bootstrap.min.css"/>'
        + '</head>'
        + '<body>'
        + divCardPrintBookCopy.outerHTML
        + '</body></html>');

    setInterval(() => {
        tab.stop();
        tab.print();
        tab.close();
    }, 700);
}

// function for disable element
const disableElement=()=>{
    selectBookElement.disabled=true;
    selectAcquisitionMethodElement.disabled=true;
    acquisitionDateElement.disabled=true;
    selectDamageStatusElement.disabled=true;
    selectBookCopyStatusElement.disabled=true;
}

//full form refresh
const refreshBookCopiesForm=()=>{

    bookCopiesForm.reset();

    if(!userPrivi.privi_insert){
        disableElement();
        buttonSubmitBookCopy.classList.add("d-none");
        buttonSubmit.classList.add("d-none");
        tabpaneForm.classList.remove('show', 'active');
        tabPillForm.classList.remove('show','active')
        tabPaneTable.classList.add('show', 'active');
        tabPillTable.classList.add('show','active')
    }

    bookcopies= new Object;
    bookcopies.bookCopyList= new Array();

    refershInnerFormAndTable();

}

// refersh inner form and add into the table
const refershInnerFormAndTable=()=>{

    bookcopy = new Object();

    let books= getHttpServiceRequest("/book/alldata");
    fillDataIntoSelect(
        selectBookElement,
        "Select Book",
        books,
        "title"
    )


    let acquisitionmethods= getHttpServiceRequest("/acquisitionmethod/alldata")
    fillDataIntoSelect(
        selectAcquisitionMethodElement,
        "Select Acquisition Method",
        acquisitionmethods,
        "name"
    )
    let damagestatus= getHttpServiceRequest("/damagestatus/alldata")
    fillDataIntoSelect(
        selectDamageStatusElement,
        "Select Damage Status",
        damagestatus,
        "name"
    )
    let bookcopystatus= getHttpServiceRequest("bookcopystatus/alldata")
    fillDataIntoSelect(
        selectBookCopyStatusElement,
        "Select Book Copy Status",
        bookcopystatus,
        "name"
    )
    acquisitionDateElement.value="";

    setInitial([
        selectBookElement,
        selectAcquisitionMethodElement,
        acquisitionDateElement,
        selectDamageStatusElement,
        selectBookCopyStatusElement
    ])

    // set max value for acquisition date
    //YYYY-MM-DD
    let maxDate= new Date();
    acquisitionDateElement.max=getDateValue(maxDate);
    console.log(acquisitionDateElement.max);

    // refresh table area= fill table
    let innerColumns = [
        { propertyName: getBook, dataType: "function" },
        { propertyName: getAcquisitionMethodInnertable, dataType: "function" },
        { propertyName: "acquisitiondate", dataType: "string" },
        { propertyName: getDamageStatusInnertable, dataType: "function" },
        { propertyName: getBookCopyStatusInnertable, dataType: "function" },

    ];

    fillDataIntoInnerTableWithoutUpdate(
        tableBodyAddedBookCopies,
        bookcopies.bookCopyList,
        innerColumns,
        deleteBookCopy
    )
}

const getBook=(dataOb)=>{
    return dataOb.book_id.title;
}

const getAcquisitionMethodInnertable=(dataOb)=>{
    return dataOb.acquisitionmethod_id.name;
}

const getDamageStatusInnertable=(dataOb)=>{
    return dataOb.damagestatus_id.name;
}

const getBookCopyStatusInnertable=(dataOb)=>{
    return dataOb.bookcopystatus_id.name;
}

// function for remove book copy from inner table
const deleteBookCopy=(dataOb)=>{

    Swal.fire({
        title: "Confirm Remove",
        html: `<p>Are you sure to remove Book Copy?</p>`,
        icon: "warning",
        confirmButtonColor: "#ff0000ff",
        confirmButtonText: "Yes, Remove",

    }).then((result) => {
        if (result.isConfirmed) {
            let extIndex= bookcopies.bookCopyList.map(bookcopy=>bookcopy.id).indexOf(dataOb.id)
            if(extIndex>-1){
                bookcopies.bookCopyList.splice(extIndex,1);
                refershInnerFormAndTable();
                Swal.fire({
                    title: "Removed!",
                    text: "Book Copy Removed successfully.",
                    icon: 'success',

                });
            }
        }
    })
}

// check inner form errors
const checkBookCopyErrors=()=>{
    let errors="";
    if(bookcopy.book_id==null){
        errors += "Please Select Book.<br>";
        selectBookElement.style.borderBottom="2px solid pink";
    }
    if(bookcopy.acquisitionmethod_id==null){
        errors += "Please Select Acquisition Method.<br>";
        selectAcquisitionMethodElement.style.borderBottom="2px solid pink";
    }
    if(bookcopy.damagestatus_id==null){
        errors += "Please Select Damage Status.<br>";
        selectDamageStatusElement.style.borderBottom="2px solid pink";
    }
    if(bookcopy.bookcopystatus_id==null){
        errors += "Please Select Book Copy Status.<br>";
        selectBookCopyStatusElement.style.borderBottom="2px solid pink";
    }

    return errors;
}

// submit inner form function
const bookCopySubmit=()=>{
    console.log(bookcopy);
    let errors = checkBookCopyErrors();
    if (errors === "") {
        // form has not any errors
        Swal.fire({
            title: "Confirm Save",
            html: `<p>Are you sure to add this Book Copy?</p>`,
            icon: "warning",
            confirmButtonColor: "#ff0000ff",
            confirmButtonText: "Yes, Add",

        }).then((result) => {
            if (result.isConfirmed) {

                Swal.fire({
                    title: "Added!",
                    text: "Book Copy Added successfully.",
                    icon: 'success',

                });
                bookcopies.bookCopyList.push(bookcopy);

                refershInnerFormAndTable();
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

// full form submit check errors
const checkBookCopiesErrors=()=>{
    let errors="";

    if(bookcopies.bookCopyList.length == 0){
        errors+="Please Add Book Copies.<br>";
    }
    return errors;
}

// book copies submit function
const buttonSubmitAll=()=>{
    console.log(bookcopies.bookCopyList);
    // check list is not empty
    let formErrors = checkBookCopiesErrors();
    if (formErrors === "") {
        // form has not any errors
        Swal.fire({
            title: "Confirm Save",
            html: `<p>Are you sure to save this Book Copy Records?</p>`,
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
                let postServiceResponse = getHttpServiceRequest("/bookcopies/insertall", "POST", bookcopies.bookCopyList);

                if (postServiceResponse == "OK") {
                    // save successs
                    Swal.fire({
                        title: "Saved!",
                        text: "Book Copy records saved successfully.",
                        icon: 'success',

                    });
                    refreshBookCopiestable();
                    refreshBookCopiesForm();
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
                        html: `<p>Book Copy Records could not be saved.</p>
                <p>Details: ${postServiceResponse}</p>`,
                        confirmButtonText: 'OK'
                    });

                }
            } else {
                //get user confirm for form discard
                // can get user confirmation for form refresh
                Swal.fire({
                    title: "Confirm Refresh",
                    text: "Do you need to refresh Book Copies form ?",
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
