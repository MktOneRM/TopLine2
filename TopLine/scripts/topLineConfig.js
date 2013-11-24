(function($, undefined) {	
	var domain = "revenue.azurewebsites.net",
	//var domain = "localhost:63504",
	
	serverUrl = "http://" + domain,
	serviceUrl = serverUrl + "/api";
	
	var viewModelUrl = new kendo.data.ObservableObject({
		serviceUrl: serviceUrl
	});
	
	$.extend(window, {
		viewModelUrl: viewModelUrl
	}
	);
})(jQuery);