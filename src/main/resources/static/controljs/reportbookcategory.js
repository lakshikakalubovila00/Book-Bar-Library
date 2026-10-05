const tableBodyBookCategory= document.getElementById("tableBodyBookCategory")

window.addEventListener("load",()=>{
    // enable tooltip
    $('[data-bs-toggle="tooltip"]').tooltip();
    userPrivi=getHttpServiceRequest("/userprivilegebymodule?modulename=Report")
    generateReport();

})

let bookCategoryChart = null;

const generateReport=()=>{

    let reportDataList = ajaxGetrequest("/report/bookcategorydata");

    // for table
    // the output format - [ [], [] ]
    // needed format - { {} , {} }

    // for chart
    // labels = [] , data = []

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
        tableBodyBookCategory,
        reportData,
        displayProperty
    );

    // chart
    const ctx = document.getElementById('myChart');

    // Destroy previous chart
    if (bookCategoryChart) {
        bookCategoryChart.destroy();
    }

    bookCategoryChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: reportChartLabel,
            datasets: [{
                label: 'Number of Books',
                data: reportChartData,
                radius: '75%',
                backgroundColor: [
                    '#4e79a7',
                    '#f28e2b',
                    '#e15759',
                    '#76b7b2',
                    '#59a14f',
                    '#edc949',
                    '#af7aa1',
                    '#ff9da7',
                    '#9c755f',
                    '#bab0ab'
                ],
                borderColor: '#ffffff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            layout: {
                padding: {
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Books by Category',
                    font: {
                        size: 18
                    }
                },
                legend: {
                    position: 'right'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.raw + ' books';
                        }
                    }
                }
            }
        }
    });
}

const printReport = () => {

    // Copy table
    document.getElementById("printTableBody").innerHTML = tableBodyBookCategory.innerHTML;

    // Convert chart to image
    const chartCanvas = document.getElementById("myChart");

    document.getElementById("chartImage").src = chartCanvas.toDataURL("image/png");

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById("printModal")
    );

    modal.show();
}

const printModalContent = () => {
    let tab = window.open();
    tab.document.write('<html>'
        + '<head><title>Print Book Status Report</title>'
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