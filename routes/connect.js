var express = require('express');
var router = express.Router();

var User = require('../models/user');

// Get connect
router.get('/', function(req, res) {
	if (req.isAuthenticated()) {
		res.render('connect', { user: req.user.username });
	} else {
		res.render('connect');
	}
});

router.get('/:company', function(req, res) {
	var companyName = req.params.company;
	
	User.getUserByUsername(companyName, function(err, company) {
		if(err) {
			return res.send({
				sucess: false,
				message: companyName + ' does not exist!'
			})
		}

		if (req.isAuthenticated()) {
			res.render('connect', { 
				user: req.user.username,
				company: company,
				success: true
			});
		} else {
			res.render('connect', { 
				company: company,
				success: true
			});
		}
	});
});


router.get('/:name', function(request, response){
	
});

module.exports = router;