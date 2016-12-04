/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com

// Must use HTTPS for chrome and firefox
var isUseHTTPs = true;
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');

// TODO: Need to verify if this works
mongoose.connect('mongodb://localhost/loginapp');
var db = mongoose.connection;

// cfenv provides access to your Cloud Foundry environment
// For more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');
var fs = require('fs');
var options = {
	key: fs.readFileSync('fake-keys/privatekey.pem'),
	cert: fs.readFileSync('fake-keys/certificate.pem')
};

// INIT APP //
var app = express();

// Set routes
var routeMain = require('./routes/main');
var routeUsers = require('./routes/users'); // login route
var routeDashboard = require('./routes/dashboard');
var routeConnect = require('./routes/connect');
var routeContact = require('./routes/contact');
var routeAbout = require('./routes/about');

// Set view folder & engine
app.set('views', path.join(__dirname, 'views')); 
app.engine('handlebars', exphbs({defaultLayout:'baseLayout'}));
app.set('view engine', 'handlebars');

// BodyParser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// Express session
app.use(session({
	secret: 'secret',
	saveUninitialized: true,
	resave: true
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Express validator
app.use(expressValidator({
	errorFormatter: function(param, msg, value) {
		var namespace = param.split('.')
		, root    = namespace.shift()
		, formParam = root;

		while(namespace.length) {
			formParam += '[' + namespace.shift() + ']';
		}
		return {
			param : formParam,
			msg   : msg,
			value : value
		};
	}
}));

// TODO: Might remove flash. Use flash middleware
app.use(flash());

// TODO: Might remove flash. Global vars for flash messages
app.use(function (req, res, next) {
	// To create global vars/funcs, use 'res.locals'
	res.locals.success_msg = req.flash('success_msg'); 
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	next();
});

// Map routes
app.use('/', routeMain);
app.use('/users', routeUsers);
app.use('/dashboard', routeDashboard);
app.use('/contact', routeContact);
app.use('/connect', routeConnect);
app.use('/about', routeAbout);

// Create a new express server
http = require("https");
var server = http.createServer(options, app);

// Socket IOs
// var io = require('socket.io').listen(server);
// var io = require("socket.io")(http);

// Get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();
var host = (process.env.VCAP_APP_HOST || 'localhost');
var port = (process.env.VCAP_APP_PORT || 3001);
// Start server on the specified port and binding host
var server = app.listen(port, host, function() {
	console.log("Server starting on" + host + ":" + port);
});

require('./Signaling-Server.js')(server);
//app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
//  console.log("server starting on " + appEnv.url);
//});
