
var connect = require('connect');
var multipart = require('multiparty');
var bodyparse = require('body-parser');
var http = require('http');
var fs = require('fs');
var queryString = require('querystring');
var util = require('util');
var serveStatic = require('serve-static');
var nodeCouchDB = require('node-couchdb');
var mime = require('mime');
var app = connect();
var path = require('path');
var couch = new nodeCouchDB('localhost', 5984);

function setCustomCacheControl(res, path) {
    res.setHeader('Cache-Control', 'public, max-age=0');
 }

app.use(serveStatic(__dirname + '/public', {
  maxAge: '1d',
  setHeaders: setCustomCacheControl
}));

app.use('/report-incident', function(req, res){

	if (req.method === 'POST') {
	    var form = new multipart.Form(); 

	    form.on('error', function(err) {
	        console.log('Error parsing form: ' + err.stack);
	    });

	    form.on('file', function(name, file) {
	        filePath = file.path;
	    });

	    form.on('part', function(part) {
	    	part.resume();
	    });	    

	    form.on('close', function() {
	    	res.writeHead(301, {Location: '/thanks-reported.html'});
	    	res.end('Incident reported, thanks');
	    }); 


	    form.parse(req, function (err, fields, files) {
	    	var newFileName, 
	    	    exten;
	    	    
	    	exten = path.extname(filePath);
	    	newFileName = fields['firstName'] + '-' + fields['time'] + '-' + fields['rand'] + exten;

	    	if (exten) {
	    		var stats = fs.statSync(filePath),
	    		    fileSizeInBytes = stats["size"],
                    fileSizeInMegabytes = fileSizeInBytes / 1000000.0;

                var mime = require('mime');
                
                if (!(mime.lookup(filePath) === 'image/png' || 
                	mime.lookup(filePath) === 'image/jpeg' ||
                	mime.lookup(filePath) === 'image/gif')) {
                	console.log('incorrect mimetype');
                	return;
                }

                if (fileSizeInMegabytes < 4) {
                	fs.rename(filePath, './public/userUploads/'+ newFileName);
                }
	    	}
	    	
	    	couch.insert("environmental_agency", {
	    	    firstName: fields['firstName'], 
	    	    secondName: fields['secondName'], 
	    	    description: fields['description'],
	    	    longitude: fields['longitude'],
	    	    latitude: fields['latitude'],
	    	    time: fields['time'],
	    	    photo: newFileName
	    	}, function (err, resData) {
	    	    if (err) {
	    	        return console.error(err);
	    	    }
	    	    console.dir(resData)
	    	});
	    });
	   
	}    

});
 
http.createServer(app).listen(3010);