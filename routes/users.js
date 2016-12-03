var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

// Get login page
router.get('/', function(req, res) {
	res.render('login', {layout: 'loginLayout'});
});

// Get login page
router.get('/login', function(req, res) {
	res.render('login', {layout: 'loginLayout'});
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
  			return done(null, false, {
  				success: false,
  				message: 'Unknown user'
  			});
		}

		User.comparePassword(password, user.password, function(err, isMatch) {
			if (err)
				console.log(err);
			if (isMatch)  {
				return done(null, user);
			} else {
				return done(null, false, {
					success: false,
					message: 'Invalid password'
				});
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

router.post('/login', function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		if (err) { 
			return next(err); 
		}

		if (!user) {
			return res.send(info);
		}

		req.logIn(user, function(err) {
			if (err) {
				return next(err);
			}

			return res.send({
				success: true,
				user: user
			});
		}); 
	})(req, res, next);
},
function(err, req, res, next) {
	return res.send({
		success: false,
		message: err.message
	});
});

module.exports = router;