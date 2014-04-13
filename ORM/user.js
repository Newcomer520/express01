/**
 * New node file
 */
var mongoose = require('mongoose');
var usersSchema = mongoose.Schema({
	name: String,
	email: String
});
var users = mongoose.model('users', usersSchema);


exports.getAll = function(cbFindData)
{
	mongoose.connect('mongodb://localhost:27017/nodeTest');
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function callback () {				
		users.find({}, {}, function(err, docs) {
			db.close();
			if (err) {				
				return console.error(err);
			}
			
			cbFindData(docs);
		});
	});
};