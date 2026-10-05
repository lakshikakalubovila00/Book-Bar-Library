const  selectBookElement  = document.getElementById("selectBook")
const dateStartDateElement = document.getElementById("dateStartDate");
const dateEndDateElement = document.getElementById("dateEndDate");
const selectTypeElement = document.getElementById("selectType");
const thHeaderTypeElement= document.getElementById("thHeaderType")
const tableBodyBookBorrowings= document.getElementById("tableBodyBookBorrowings")

window.addEventListener("load",()=>{
    // enable tooltip
    $('[data-bs-toggle="tooltip"]').tooltip();
    userPrivi=getHttpServiceRequest("/userprivilegebymodule?modulename=Report")

})

let allbooks= ajaxGetrequest("/book/list");
fillDataIntoSelect(selectBookElement,"Select Book",allbooks,"title")
dateStartDateElement.value= "";
dateEndDateElement.value= "";
selectTypeElement.value= "";

let today= new Date();
let minDateOb= new Date();

dateStartDateElement.max=getDateValue(minDateOb);
dateEndDateElement.max=getDateValue(minDateOb);

let borrowingChart = null;

const generateReport=()=>{
    let type= selectTypeElement.value;
    let sdate= dateStartDateElement.value;
    let edate= dateEndDateElement.value;
    let bookid=JSON.parse(selectBookElement.value).id;

    let reportDataList = ajaxGetrequest("/report/borrowingbookdatabysdateedatetype?bookid="+bookid+"&sdate="+sdate+"&edate="+edate+"&type="+type);

    // for table
    // the output format - [ [], [] ]
    // needed format - { {} , {} }

    // for chart
    // labels = [] , data = []
    if(type=="Monthly"){
        thHeaderTypeElement.innerText ="Borrowing Month"
    }
    if(type=="Weekly"){
        thHeaderTypeElement.innerText ="Borrowing Week"
    }
    if(type=="Daily"){
        thHeaderTypeElement.innerText ="Borrowing Date"
    }
    if(type=="Yearly"){
        thHeaderTypeElement.innerText ="Borrowing Year"
    }

    let reportData=new Array();

    let reportChartLabel=new Array();
    let reportChartData=new Array();

    for (const dataList of reportDataList){
        let data = new Object();
        data.type=dataList[0];
        data.count=dataList[1];
        reportData.push(data);

        reportChartLabel.push(dataList[0])
        reportChartData.push(dataList[1])
    }
    console.log(reportData)
    console.log(reportChartLabel)
    console.log(reportChartData)

    let displayProperty = [
        { propertyName: "type", dataType: "string" },
        { propertyName: "count", dataType: "string" },
    ];

    fillDataIntoTableInfo(
        tableBodyBookBorrowings,
        reportData,
        displayProperty
    );

    // chart
    const ctx = document.getElementById('myChart');

    // Destroy previous chart
    if (borrowingChart) {
        borrowingChart.destroy();
    }

    borrowingChart=new Chart(ctx, {
        type: 'bar',
        data: {
            labels: reportChartLabel,
            datasets: [{
                label: 'Borrowings',
                data: reportChartData,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

const printReport = () => {

    document.getElementById("printBook").innerHTML = selectBook.options[selectBook.selectedIndex].text;

    document.getElementById("printType").innerHTML = selectType.value;

    document.getElementById("printStartDate").innerHTML = dateStartDate.value;

    document.getElementById("printEndDate").innerHTML = dateEndDate.value;

    // Change print table header
    document.getElementById("printThHeaderType").innerText = thHeaderTypeElement.innerText;

    document.getElementById("printTableBody").innerHTML = tableBodyBookBorrowings.innerHTML;

    document.getElementById("chartImage").src = document.getElementById("myChart").toDataURL();

    new bootstrap.Modal(document.getElementById("printModal")).show();

}

const printModalContent = () => {
    let tab = window.open();
    tab.document.write('<html>'
        + '<head><title>Book Borrowing Report</title>'
        + '<link rel="stylesheet" href="../resources/bootstrap-5.2.3/css/bootstrap.min.css"/>'
        + '</head>'
        + '<body>'
        + divCardPrintReport.outerHTML
        + '</body></html>');

    setInterval(() => {
        tab.stop();
        tab.print();
        tab.close();
    }, 700);
}
