var express = require('express');
var router = express.Router();

// Get homepage
router.get('/', function(req, res) {
	if (req.isAuthenticated()) {
		res.render('dashboard', { user: req.user.username });
	} else {
		res.render('dashboard');
	}
});

module.exports = router;