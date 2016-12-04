var express = require('express');
var router = express.Router();

// Get connect
router.get('/', function(req, res) {
	if (req.isAuthenticated()) {
		res.render('connect', { user: req.user.username });
	} else {
		res.render('connect');
	}
});

module.exports = router;