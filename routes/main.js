var express = require('express');
var router = express.Router();

// Get contact
router.get('/', function(req, res) {
	res.render('login', {layout: 'loginLayout'});
});


module.exports = router;