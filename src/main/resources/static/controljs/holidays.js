// tab panes

const tabpaneForm = document.getElementById("libraryHolidaysTabPillForm");
const tabPaneTable = document.getElementById("libraryHolidaysTabPillTable");
const tabPillForm = document.getElementById("libraryHolidaysFormPill");
const tabPillTable = document.getElementById("libraryHolidaysTablePill");

const radioContainer = document.getElementById("radioHolidayYear");
const selectMonthElement= document.getElementById("selectMonth");
const tableBodyChecking= document.getElementById("tableBodyAddHolidays");

const tableBody= document.getElementById("tableBodyLibraryHolidays")

window.addEventListener("load",()=>{
    // enable tooltip
    $('[data-bs-toggle="tooltip"]').tooltip();

    //get logged user privilege
    userPrivi=getHttpServiceRequest("/userprivilegebymodule?modulename=Library-Holidays")

    // call refresh table function
    refreshLibraryHolidaysTable();

    // call refresh form function
    refreshLibraryHolidaysForm();
})

const refreshLibraryHolidaysTable=()=>{
    // IF table is already DataTable THEN remove it THEN create new DataTable
    if ($.fn.DataTable.isDataTable('#tableLibraryHolidays')) {
        $('#tableLibraryHolidays').DataTable().destroy();
    }
    let holidays = ajaxGetrequest("/holidays/alldata");

    let displayProperty = [
        { propertyName: "title", dataType: "string" },
        { propertyName: "date", dataType: "string" },
        { propertyName: "day", dataType: "string" }
    ];

    fillDataIntoTableInfo(
        tableBody,
        holidays,
        displayProperty
    );
    buttonSubmit.classList.remove("d-none");
    // buttonUpdate.classList.add("d-none");
    // buttonPrint.classList.add("d-none");
    // buttonDelete.classList.add("d-none");

    $("#tableLibraryHolidays").DataTable({
        responsive: true,
        autoWidth: false
    });
}


const refreshLibraryHolidaysForm=()=>{
    holidaysForm.reset();

    if(!userPrivi.privi_insert){
        selectMonthElement.disabled=true;
        buttonSubmit.classList.add("d-none");
        tabpaneForm.classList.remove('show', 'active');
        tabPillForm.classList.remove('show','active')
        tabPaneTable.classList.add('show', 'active');
        tabPillTable.classList.add('show','active')
    }

    holiday= new Object();

    const currentYear= new Date().getFullYear();
    const numberOfYears=2;
    let holidayYears=[];
    for(let i=0; i<numberOfYears; i++){
        holidayYears.push({year:currentYear+i})
    }
    radioContainer.innerHTML="";
    holidayYears.forEach((yearOb, index)=>{
        let radioId= index;
        let radio= document.createElement("input");
        radio.type="radio";
        radio.name="holidayYear";
        radio.id=radioId;

        radio.classList.add("form-check-input");
        radio.value = yearOb.year;
        radio.required = true;

        radio.onchange = () => {
            holiday.year = radio.value;
            // get months and days 365 or 366
        };

        let label = document.createElement("label");
        label.htmlFor = radioId;
        label.innerText = yearOb.year;
        label.classList.add("form-check-label", "me-3");

        let wrapper = document.createElement("div");
        wrapper.classList.add("form-check");
        wrapper.appendChild(radio);
        wrapper.appendChild(label);

        radioContainer.appendChild(wrapper);
    })

    let months= getHttpServiceRequest("/month/alldata");
    fillDataIntoSelect(selectMonthElement,"Select Month",months, "name");

    setInitial([
        selectMonthElement
    ])
    tableBodyChecking.innerHTML = "";


}

const generateDates=()=>{
    const year = document.querySelector('input[name="holidayYear"]:checked')?.value;
    const selectedMonthObject = JSON.parse(selectMonthElement.value);
    const month = selectedMonthObject.id;
    console.log(month)
    if(!year || !month){
        // swal- select year and month
        alert("Select year and month");
        return;
    }
    let dateList=[];

    let addedHolidays= getHttpServiceRequest("/holidays/alldata")
    let holidayDates= addedHolidays.map(holiday=>holiday.date)

   const daysInMonth= new Date(year,month,0).getDate();

   for(let day=1; day<= daysInMonth; day++){

       const fullDate= year+"-"+String(month).padStart(2,'0')+"-"+String(day).padStart(2,'0');

       // skips if already in db
       // continue - skip current loop iteration and go to next day
       if(holidayDates.includes(fullDate)){
           continue;
       }
       let today= new Date();
       let toadyDate= getDateValue(today);
       if(toadyDate>fullDate){
           continue
       }
       const dayname= new Date(fullDate).toLocaleDateString('en-Us',{weekday:'long'})
       let dateObject={
           fullDate:fullDate,
           dayname:dayname
       }
       dateList.push(dateObject);
   }
   console.log(dateList);

    // full data format
    fillDatesDataIntoTable(
        tableBodyChecking,
        dateList
    );

}

// common function for fill dates into table
const fillDatesDataIntoTable = (
    tableBody,
    dataList,
    // displayProperty
) => {
    tableBody.innerHTML = "";
    //selectedBorrowCode = null;

    dataList.forEach((dataOb, index) => {

        //tr
        let tr = document.createElement("tr");

        //checkbox
        let tdCheck= document.createElement("td");
        let checkbox= document.createElement("input");
        checkbox.type="checkbox";
        checkbox.classList.add("form-check-input",  "input-checkbox", "dateCheck");
        tdCheck.appendChild(checkbox);
        tr.appendChild(tdCheck);

        // date
        let tdDate= document.createElement("td");
        tdDate.classList.add("date");
        tdDate.innerText=dataOb.fullDate;
        tr.appendChild(tdDate);

        // day
        let tdDay= document.createElement("td");
        tdDay.classList.add("day");
        tdDay.innerText=dataOb.dayname;
        tr.appendChild(tdDay)


        //title
        let tdTitle= document.createElement("td");
        let inputTitle= document.createElement("input");
        inputTitle.type="text";
        inputTitle.classList.add("form-control", "input-area" , "title" , "normal-text");
        inputTitle.disabled=true;

        tdTitle.appendChild(inputTitle);
        tr.appendChild(tdTitle);

        //tr append into tbody
        tableBody.appendChild(tr);
    });
};

// get full fine amount when checked checkbox
document.addEventListener("change", function(e){

    if(e.target.classList.contains("dateCheck")){
        let row = e.target.closest("tr");

        let inputTitle =row.querySelector(".title");
        let selectHolidayType = row.querySelector(".holidayType");

        if(e.target.checked){
            //  when checkbox is checked
            inputTitle.disabled = false;

            // save to object

        } else {
            //  when checkbox is unchecked
            inputTitle.disabled = true;
        }
    }

});

// get selected dates to push
const getSelectedDates = () => {

    let holidaysList = [];

    document.querySelectorAll("#tableBodyAddHolidays tr").forEach(row => {
        let checked = row.querySelector(".dateCheck").checked;
        if(checked){
            let holidayObj={
                date :  row.querySelector(".date").innerText,
                day :  row.querySelector(".day").innerText,
                title : row.querySelector(".title").value
            }
            holidaysList.push(holidayObj);
        }
    });
    return holidaysList;
};

//check borrow form errors
const checkHolidayFormErrors=(tr)=>{
    let errors="";

    let title = tr.querySelector(".title").value;

    if(title.trim() === ""){
        errors += "Please Enter Holiday Title.<br>";
        tr.querySelector(".title").style.borderBottom = "2px solid pink";
    }

    return errors;
}

// submit button function

const submitHolidayButton = () => {

    let selectedDates = document.querySelectorAll(".dateCheck:checked");

    if(selectedDates.length === 0){
        Swal.fire({
            title: "No Dates Selected",
            text: "Please select holidays.",
            icon: "warning"
        });
        return;
    }
    let tr = document.querySelectorAll("#tableBodyAddHolidays tr");

    let formErrors = "";

    tr.forEach(tr => {

        let checkbox = tr.querySelector(".dateCheck");

        if (checkbox && checkbox.checked) {

            formErrors += checkHolidayFormErrors(tr);

        }
    });
    if(formErrors !=="") {
        Swal.fire({
            title: "Save Failed",
            html: `<p>Form has following errors:</p>${formErrors}`,
            icon: "error"
        });
        return;
    }
    // form has not any errors
    Swal.fire({
        title: "Confirm Save",
        html: `<p>Are you sure to save this Holiday Records?</p>`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ff0000ff",
        cancelButtonColor: "rgb(0, 102, 255)",
        confirmButtonText: "Yes, Save",
        cancelButtonText: "Cancel",
        reverseButtons: true,

    }).then((result) => {
        if (result.isConfirmed) {

           let holidaysList= getSelectedDates();
           console.log(holidaysList);

            let postServiceResponse =getHttpServiceRequest(
                "/holidays/insertall",
                "POST",
                holidaysList
            );
            if (postServiceResponse == "OK") {
                // save successs
                Swal.fire({
                    title: "Saved!",
                    text: "Holiday records saved successfully.",
                    icon: 'success',
                    allowOutsideClick: false,   // block outside click
                    allowEscapeKey: false,

                })
                refreshLibraryHolidaysTable();
                refreshLibraryHolidaysForm();
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
                    html: `<p>Holiday Records could not be saved.</p>
                        <p>Details: ${postServiceResponse}</p>`,
                    confirmButtonText: 'OK'
                });

            }
        } else {
            //get user confirm for form discard
            // can get user confrimation for form refresh
            Swal.fire({
                title: "Confirm Refresh",
                text: "Do you need to refresh holiday form ?",
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
}