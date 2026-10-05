const  selectBookElement  = document.getElementById("selectBook")
const dateStartDateElement = document.getElementById("dateStartDate");
const dateEndDateElement = document.getElementById("dateEndDate");
const selectTypeElement = document.getElementById("selectType");
const thHeaderTypeElement= document.getElementById("thHeaderType")
const tableBodyPurchaseBook= document.getElementById("tableBodyPurchaseBook")

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

let purchaseChart = null;

const generateReport=()=>{
    let type= selectTypeElement.value;
    let sdate= dateStartDateElement.value;
    let edate= dateEndDateElement.value;
    let bookid=JSON.parse(selectBookElement.value).id;

    let reportDataList = ajaxGetrequest("/report/purchasebookdatabysdateedatetype?bookid="+bookid+"&sdate="+sdate+"&edate="+edate+"&type="+type);

    // for table
    // the output format - [ [], [] ]
    // needed format - { {} , {} }

    // for chart
    // labels = [] , data = []
    if(type=="Monthly"){
        thHeaderTypeElement.innerText ="Month"
    }
    if(type=="Weekly"){
        thHeaderTypeElement.innerText ="Week"
    }
    if(type=="Daily"){
        thHeaderTypeElement.innerText ="Date"
    }
    if(type=="Yearly"){
        thHeaderTypeElement.innerText ="Year"
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
        tableBodyPurchaseBook,
        reportData,
        displayProperty
    );

    // chart
    const ctx = document.getElementById('myChart');

    // Destroy previous chart
    if (purchaseChart) {
        purchaseChart.destroy();
    }

    purchaseChart=new Chart(ctx, {
        type: 'bar',
        data: {
            labels: reportChartLabel,
            datasets: [{
                label: 'Count',
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

    document.getElementById("printBook").innerHTML = selectBookElement.options[selectBookElement.selectedIndex].text;

    document.getElementById("printType").innerHTML = selectType.value;

    document.getElementById("printStartDate").innerHTML = dateStartDate.value;

    document.getElementById("printEndDate").innerHTML = dateEndDate.value;

    // Change print table header
    document.getElementById("printThHeaderType").innerText = thHeaderTypeElement.innerText;

    document.getElementById("printTableBody").innerHTML = tableBodyPurchaseBook.innerHTML;

    document.getElementById("chartImage").src = document.getElementById("myChart").toDataURL();

    new bootstrap.Modal(document.getElementById("printModal")).show();

}

const printModalContent = () => {
    let tab = window.open();
    tab.document.write('<html>'
        + '<head><title>Print Book Purchase Report</title>'
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