var nwHighCharts = function () {
	//internal function
    var internalFunction = function (e) {
        
    };

    return {
        //main function to initiate the module
        initChartAndExport: function ( chart ) {
            // activate Nestable for list 1
            //updateOutput
			console.log( chart );
			
			$( chart.highchart_container_selector ).highcharts( chart.highchart_data );
			var $chart = $( chart.highchart_container_selector ).highcharts();
			var svg = $chart.getSVG();
			
			return 'type=image/jpeg&filename=' + chart.highchart_exported_chart_name + '&width=600&svg='+svg;
        },
        //main function to initiate the module
        initChart: function ( chart ) {
            // activate Nestable for list 1
            //updateOutput
			console.log( chart );
			
			$( chart.highchart_container_selector ).highcharts( chart.highchart_data );
			
        },
        exportChart: function () {
            // activate Nestable for list 1
            //updateOutput
        }
    };

}();
//nwHighCharts.init();