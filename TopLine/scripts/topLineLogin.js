(function (global) {
	var LoginViewModel,
	app = global.app = global.app || {};

	LoginViewModel = kendo.data.ObservableObject.extend({
		isLoggedIn: false,
		username: "",
		password: "",

		onLogin: function () {
			var that = this,
			username = that.get("username").trim(),
			password = that.get("password").trim();

			/*      if (username === "" || password === "") {
			navigator.notification.alert("Both fields are required!",
			function () { }, "Login failed", 'OK');

			return;
			}*/

			that.set("isLoggedIn", true);
			app.application.navigate("topLine.html");
		},

		onLogout: function () {
			var that = this;

			that.clearForm();
			that.set("isLoggedIn", false);
		},

		clearForm: function () {
			var that = this;

			that.set("username", "");
			that.set("password", "");
		}
	});

	app.loginService = {
		viewModel: new LoginViewModel()
	};
	
	app.closeErrorModal = {
		closeError: function () {
			$("#error-view").data().kendoMobileModalView.close();
		}
	};
	
	app.error = {
		showError: function (message, error) {
			var errorMessage = message + (error === undefined ? "" : "\n" + error.status + ": " + error.statusText);
			$("#error-view .message").text(errorMessage);
			$("#error-view").show().data().kendoMobileModalView.open();
		}
	};
	
	
})(window);