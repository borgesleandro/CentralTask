$(function () {
    setTimeout(grf1c, 900);
});

function grf1c(){
$(function () {
    $('.kpi2').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: 0,
            plotShadow: false
        },
        credits: { enabled: false },
		navigation: { buttonOptions: { enabled: false } },
        title: {
            text: '<p style="font-size: 1.6em">91%<br /><span style="font-size: 0.6em">COBERTURA</span></p>',
            align: 'center',
            verticalAlign: 'middle',
            y: 4
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
            enabled: false
        },
        plotOptions: {
            pie: {
                dataLabels: {
                    enabled: true,
                    distance: 0,
                    style: {
                        fontWeight: 'bold',
                        color: 'white',
                        textShadow: '0px 1px 2px black'
                    }
                },
                states: { hover: { enabled: false } },
                borderWidth: 0,
                startAngle: 0,
                endAngle: 360,
                center: ['50%', '50%']
            }
        },
        series: [{
            type: 'pie',
            name: '100%',
            colors: ['#84ff8c','#f5f5f5'],
            innerSize: '90%',
            data: [
                [" " ,90.0],
                 [" " ,10.0],
              
               
            ]
        }]
    });
});
}
