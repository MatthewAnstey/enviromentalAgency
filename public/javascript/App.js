global.jQuery = require('jquery');
require('bootstrap');
require('parsleyjs');
global.$ = jQuery;
global._ = require('underscore');
global.Backbone = require('backbone');
global.Backbone.$ = global.jQuery; 	

var Model = require('./Model.js');
var FormView = require('./FormView.js');
var LocationView = require('./LocationView.js');

if (document.getElementById('map')) {
	require('./MapView.js');
} else {
	global.model = new Model();

	require('./GoogleApi.js');

	model.on('googleapi:loaded', function () {

		var formView = new FormView({ 
	        model : model, 
	       el : jQuery('body')  
	    });

		var locationView = new LocationView({ 
			model : model, 
			el : jQuery('body')  
		});
    });
}