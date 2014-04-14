/**
 * User Schema
 */

var mongoose = require('./nodeTest.js');
//	nodeTest = require('./nodeTest.js');
//nodeTest(mongoose);

//var db = mongoose.connection;



var UserSchema = new mongoose.Schema(
	{
		id: String,
		token: String,
		name: String,
		email: String,
		created_date: {type: Date, default: Date.now}
	}
);

module.exports = mongoose.model('User', UserSchema);
