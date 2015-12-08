 module.exports = Backbone.View.extend({
	initialize: function () {
        this.staticGoogleMapUrl = global.Config.staticMapUrl;
	},
	events : {
		'click .js-get-location' : 'getLocation'
	}, 
	getLocation : function (evt) {
		evt.preventDefault();
        this.$('.js-map-wrapper').html('Locating');
        navigator.geolocation.getCurrentPosition(
        	_.bind(function(position){ this.locationSuccess(position); }, this),
        	this.locationError);
	}, 
	locationSuccess : function (position) {
        var latitude  = position.coords.latitude, 
            longitude = position.coords.longitude,
            img = new Image();

        this.$('.js-longitude').val(longitude);
        this.$('.js-latitude').val(latitude);
        
        img.src = this.staticGoogleMapUrl + 
        	"?center=" + 
        	latitude + 
        	"," + 
        	longitude + 
        	"&zoom=13&size=200x200&sensor=false&markers=color:red%7C" +  
        	latitude + 
        	"," + 
        	longitude;

        this.$('.js-map-wrapper').html(img);

	}, 
 	locationError : function () {

	}
});

