(function (global) {
	app = global.app = global.app || {};

	document.addEventListener("deviceready", function () {
		app.application = new kendo.mobile.Application(document.body, {
			//transition: "overlay:up reverse",
			loading: '<h1 class="loading-message">Carregando...</h1>', 
			skin:"flat"
		});
		
		kendo.mobile.ui.Drawer.current = null;
		
		
	}, false);
	
	$(window).resize(function() {
		var newHeigth = $(document).height() - 120;
		
		var charts = $("[id^='chtGraf']");

		for (var i = 0; i < charts.length; i = i + 1) {			
			var id = charts[i].id;
			
			var chart = $("#" + id).data("kendoChart"); 
			if (chart != null) {
				chart.options.chartArea.height = newHeigth; 
				chart.refresh(); 
			}
		}
		
	});
})(window)