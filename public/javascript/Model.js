module.exports = Backbone.Model.extend({
 	initialize: function () {
        this.listenTo(this, 'data:sent', this.dataSent);
        this.listenTo(this, 'change:takePicture', this.setExtension);
 	}, 
    dataSent: function () { 
        this.set('dataSent', true);
    },
    setExtension : function () {
        this.set('extension', this.sliceExtension());
    },
    sliceExtension : function () {
        var path = this.get('takePicture');

        return path.slice(path.indexOf('.'), path.length);
    },
 	submitQuery : function () {
        var that = this;
 		var columnHeader = ['FirstName', 'SecondName', 'Description', 'Location', 'TimeSent' , 'Photo'];

 		var queryValues = [
 		    this.get('firstName') , 
 			this.get('secondName'), 
 			this.get('description'), 
 			this.get('latitude') + 
            ' , ' + 
            this.get('longitude'),
            this.get('time'), 
            location.origin + 
            '/userUploads/' + 
            this.get('firstName') + 
            '-' + 
            this.get('time') + 
            '-' + 
            this.get('rand') + 
            this.get('extension')];  

        var insertQuery = "INSERT INTO " + Config.fusionTableId  + " ( " + 
        	columnHeader.join(',')  + 
        	" ) VALUES ( " + 
        	"'" +
        	queryValues.join("','") + 
        	"');";				

		jQuery.ajax({
			type: 'POST',
			url: "https://www.googleapis.com/fusiontables/v2/query?sql=" + insertQuery + "&key=" + Config.apiKey, 
			beforeSend: function (xhr) {
                xhr.setRequestHeader ("Authorization", 'Bearer ' + window.access_token); 
            }, 
            success : function () {
                that.trigger('data:sent');
            }
		});
			
 	} 
 	
 });
