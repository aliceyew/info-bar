var express = require('express');
var router = express.Router();

// Get contact
router.get('/', function(req, res) {
	if (req.isAuthenticated()) {
		res.render('contact', { user: req.user.username });
	} else {
		res.render('contact');
	}
});

module.exports = router;