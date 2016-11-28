var ctx = document.getElementById("myChart");
Chart.defaults.global.defaultFontColor = '#FFF';
var data = {
    labels: [
        "James T. Kirk",
        "Jean-Luc Picard",
        "Benjamin Sisko"
    ],
    datasets: [
        {
            data: [30, 20, 1],
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
var myPieChart = new Chart(ctx,{
    type: 'pie',
    data: data,
    options: {title: {
            display: true,
            text: 'Example Poll: Piccard or Kirk?',
        },
    animation:{
        animateScale:true
    }}
});