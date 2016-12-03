var express = require('express');
var router = express.Router();

// Get homepage
router.get('/', ensureAuthenticated, function(req, res) {
	res.render('index');
});

function ensureAuthenticated(req, res, next) {
	if(req.isAuthenticated()) {
		console.log(req.user.username); // To get user information
		return next();
	} else {
		res.send({
			message: "You are not logged in."
		})
	}
}

module.exports = router;