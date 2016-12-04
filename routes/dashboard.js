var express = require('express');
var router = express.Router();

var User = require('../models/user');

// Get homepage
router.get('/', function(req, res) {
	if (req.isAuthenticated()) {
		res.render('dashboard', { 
			user: req.user.username,
			helpers: {
            	"angular": function (options) { return options.fn(); }
        	}
        });
	} else {
		res.render('dashboard');
	}
});

router.get('/allUsers', function(req, res) {
	User.getAllUsers(function(err, users) {
		if (err) {
			return res.send({
				success: false,
				message: 'Error accessing the database.'
			});
		} else {
			return res.send({
				success: true,
				users: users
			});
		}
	})
});

module.exports = router;