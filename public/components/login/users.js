var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

// Get register page
router.get('/register', function(req, res) {
	res.render('register');
});

// Get login page
router.get('/login', function(req, res) {
	res.render('login');
});

// Logout
router.get('/logout', function(req, res) {
	req.logout();
	res.send({
		success: true,
		message: 'User successfully logged out'
	});
})

// Register user
router.post('/register', function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	var details = req.body.details;

	var newUser = new User({
		username: username,
		password: password,
		details: details
	})

	User.createUser(newUser, function(err, user) {
		if (err) {
			return res.send({
				success: false,
				message: 'User already exist!'
			});
		} else {
			return res.send({
				success: true,
				user: user
			});
		}
	});
});


passport.use(new LocalStrategy(
  function(username, password, done) {
  	User.getUserByUsername(username, function(err, user) {
		if (err)
			console.log(err);
		if (!user) {
			// return res.send({
			//  	success: false,
			//  	message: 'User does not exist!'
			// });

  			return done(null, false, {message: 'unknown user!'});
		}

		User.comparePassword(password, user.password, function(err, isMatch) {
			if (err)
				console.log(err);
			if (isMatch)  {
				console.log(isMatch);
				// return res.send({
				// 	success: true,
				// 	data: isMatch
				// })
				return done(null, user);
			} else {
				// return res.send({
				// 	success: false,
				// 	message: 'Invalid password!'
				// });
				return done(null, false, {message: 'Invalid password'});
			}
		});
  })
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

// Login user
router.post('/login', 
	passport.authenticate('local', {
		successRedirect:'/',
		failureRedirect:'/users/login',
		failureFlash: true
	}),
	function(req, res) {
		// res.redirect('/'); // I DOUBT THIS WILL WORK. MAY NEED TO USE ANGULAR.
});

module.exports = router;