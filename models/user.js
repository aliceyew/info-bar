var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var UserSchema = mongoose.Schema({
	username: {
		type: String,
		unique: true,
	},
	password: {
		type: String
	},
	details: {
		type: String
	},
	bctime: {
		type: String
	},
	imgsrc: {
		type: String
	},
	roomUrl: {
		type: String
	}
});

 											// mongoose creates a collection based on this
var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback) {
	bcrypt.genSalt(10, function(err, salt) {
		bcrypt.hash(newUser.password, salt, function(err, hash) {
			newUser.password = hash;
			newUser.save(callback);
   	 	});
	});
}

module.exports.getUserByUsername = function(username, callback) {
	var query = {username: username};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback) {
	User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
		if(err) throw err;
		callback(null, isMatch);
	});
}

module.exports.updateUserDetails = function(id, updatedDetails, callback) {
	User.findByIdAndUpdate(id, updatedDetails, { new: true }, callback);
}

module.exports.getAllUsers = function(callback) {
	User.find({}, callback);
}

module.exports.addRoomUrl = function(username, roomUrl, callback) {
	var query = {username: username};
	var setQuery = {$set: {roomUrl: roomUrl}};
	User.update(query, setQuery, callback);
}

module.exports.deleteRoomUrl = function(username, callback) {
	var query = {username: username};
	var setQuery = {$unset: {roomUrl: ""}};
	User.update(query, setQuery, callback);
}