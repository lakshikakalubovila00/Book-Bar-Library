
const dateStartDateElement = document.getElementById("dateStartDate");
const dateEndDateElement = document.getElementById("dateEndDate");
const selectTypeElement = document.getElementById("selectType");
const thHeaderTypeElement= document.getElementById("thHeaderType")
const tableBodyMostBorrowedBooks= document.getElementById("tableBodyMostBorrowedBooks")

window.addEventListener("load",()=>{
    // enable tooltip
    $('[data-bs-toggle="tooltip"]').tooltip();
    userPrivi=getHttpServiceRequest("/userprivilegebymodule?modulename=Report")

})

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

    let reportDataList = ajaxGetrequest("/report/mostborrowedbooksbysdateedatetype?sdate="+sdate+"&edate="+edate+"&type="+type);

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
        data.title= dataList[0];
        data.type=dataList[1];
        data.count=dataList[2];
        reportData.push(data);

        reportChartLabel.push(dataList[0])
        reportChartData.push(dataList[2])
    }
    console.log(reportData)
    console.log(reportChartLabel)
    console.log(reportChartData)

    let displayProperty = [
        { propertyName: "title", dataType: "string" },
        { propertyName: "type", dataType: "string" },
        { propertyName: "count", dataType: "string" },
    ];

    fillDataIntoTableInfo(
        tableBodyMostBorrowedBooks,
        reportData,
        displayProperty
    );

    if (borrowingChart != null){
        borrowingChart.destroy();
    }

    borrowingChart = new Chart(document.getElementById("myChart"),{

        type:'bar',

        data:{
            labels:reportChartLabel,

            datasets:[{
                label:"Borrow Count",
                data:reportChartData
            }]
        },

        options:{
            responsive:true,
            scales:{
                y:{
                    beginAtZero:true
                }
            }
        }

    });
}

const printReport = () => {

    document.getElementById("printType").innerHTML = selectType.value;

    document.getElementById("printStartDate").innerHTML = dateStartDate.value;

    document.getElementById("printEndDate").innerHTML = dateEndDate.value;

    // Change print table header
    document.getElementById("printThHeaderType").innerText = thHeaderTypeElement.innerText;

    document.getElementById("printTableBody").innerHTML = tableBodyMostBorrowedBooks.innerHTML;

    document.getElementById("chartImage").src = document.getElementById("myChart").toDataURL();

    new bootstrap.Modal(document.getElementById("printModal")).show();

}

const printModalContent = () => {
    let tab = window.open();
    tab.document.write('<html>'
        + '<head><title>Most Borrowed Books Report</title>'
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
