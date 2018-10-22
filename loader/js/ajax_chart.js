/**
 * navbar-ontop.js 1.0.0
 * Add .navbar-ontop class to navbar when the page is scrolled to top
 * Make sure to add this script to the <head> of page to avoid flickering on load
 */

(function loadXMLDoc()
    {
      // Data for line charts
      var lineChartData = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
        {
            label: "My First dataset",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [65, 59, 80, 81, 56, 55, 40],
            spanGaps: false,
        }
        ]
    };

    var ctx = document.getElementById("lines-graph").getContext("2d");
    var LineChart = new Chart(ctx, {
        type: 'line',
        data: lineChartData,
        responsive: true,
        bezierCurve : false
    });


    // Bar Charts
    var barChartData = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
        {
            label: "My First dataset",
            backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1,
            data: [65, 59, 80, 81, 56, 55, 40],
        }
        ]
    };

    var ctx = document.getElementById("bars-graph").getContext("2d");
    var BarChart = new Chart(ctx, {
        type: 'bar',
        data: barChartData,
        responsive : true
    });




    // Data for pie chart
    var pieData = {
        labels: [
        "Red",
        "Blue",
        "Yellow"
        ],
        datasets: [
        {
            data: [300, 50, 100],
            backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56"
            ],
            hoverBackgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56"
            ]
        }]
    };

    var ctx = document.getElementById("pie-graph").getContext("2d");
    var PieChart = new Chart(ctx,{
        type: 'pie',
        data: pieData
    });




    // Data for doughnut chart
    var doughnutData = {
        labels: [
        "Red",
        "Blue",
        "Yellow"
        ],
        datasets: [
        {
            data: [300, 50, 100],
            backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56"
            ],
            hoverBackgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56"
            ]
        }]
    };

    var ctx = document.getElementById("doughnut-graph").getContext("2d");
    var DoughnutChart = new Chart(ctx, {
        type: 'doughnut',
        data: doughnutData,
        responsive : true
    }); 

})();