var express = require('express');
var router = express.Router();

var User = require('../models/user');

router.get('/', function(req, res) {
	if (req.isAuthenticated()) {
		res.render('connect', { user: req.user.username });
	} else {
		res.render('connect');
	}
});

// Dynamic generation of company profile
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
			var isAuthorized = (req.user.username === companyName)
			res.render('connect', { 
				user: req.user.username,
				company: company,
				isAuthorized: isAuthorized,
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

// Save chatroom link to db
router.post('/createChatroom', function(req, res) {
	var username = req.user.username;
	var roomUrl = req.body.roomUrl;

	User.addRoomUrl(username, roomUrl, function(err, user) {
		if (err) {
			console.log(err);
			return res.send({
				success: false,
				message: 'There was an issue creating the chatroom!'
			});
		} else {
			return res.send({
				success: true,
				user: user				
			});
		}
	});
});

// Delete chatroom entry from db
router.post('/deleteChatroom', function(req, res) {
	if (req.user) {
		var chatroomUser = req.user.username;

		User.deleteRoomUrl(chatroomUser, function(err, removed) {
			if (err) {
				return res.send({
					success: false,
					message: 'This user has not created a chatroom!'
				});
			} else {
				return res.send({
					success: true,
					removed: removed				
				});
			}
		});
	}
});

module.exports = router;