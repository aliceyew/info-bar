/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com

// Must use HTTPS for chrome and firefox
var isUseHTTPs = true;

var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');
var fs = require('fs');
var options = {
	key: fs.readFileSync('fake-keys/privatekey.pem'),
	cert: fs.readFileSync('fake-keys/certificate.pem')
};

// create a new express server
http = require("https");
var app = express();
var server = http.createServer(options, app);

//var io = require('socket.io').listen(server);

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

//var io = require("socket.io")(http);
// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();
var host = (process.env.VCAP_APP_HOST || 'localhost');
var port = (process.env.CVAP_APP_PORT || 3001);
// start server on the specified port and binding host
var server = app.listen(port, host, function() {
	console.log("Server starting on" + host + ":" + port);
});

require('./Signaling-Server.js')(server);
//app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
//  console.log("server starting on " + appEnv.url);
//});
