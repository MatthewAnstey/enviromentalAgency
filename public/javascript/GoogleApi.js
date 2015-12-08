(function () {

	    global.apiLoaded = false;

		global.handleAuthResult = function (authResult) {
		    if (authResult && !authResult.error) {
		        window.access_token = authResult.access_token;

	            window.apiLoaded = true;            

		   } else {
		       alert( '[ERROR] Failed to log in.' );
		   }
		};


	    global.initGoogleApi = function () {
	        gapi.client.setApiKey(Config.apiKey);
	         
	        var clientId = Config.clientId; 

	        var SCOPE = "https://www.googleapis.com/auth/fusiontables";

	        var configString = {
	        	client_id: clientId,
				scope: SCOPE,
				immediate: 'true'
			};

			gapi.auth.authorize(configString, handleAuthResult);

			global.model.trigger('googleapi:loaded');

		};

		global.$.getScript('https://apis.google.com/js/client.js?onload=initGoogleApi');

})();


