$(function () {
    setTimeout(grf1, 500);
});

function grf1(){
    // Build the chart
        $('.kpi1').highcharts({
            chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'Intervalo de Visitas'
        },
		credits: { enabled: false },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        series: [{
            name: "Percentual",
				colors: ['#005A82','#f5f5f5'],
            colorByPoint: true,
            data: [{
                name: "Respeito",
                y: 90.00
            }, {
                name: "Desvio",
                y: 10.00,
                sliced: true,
                selected: true
            }]
        }]
    });

}
