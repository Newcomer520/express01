/**
 * New node file
 */

var mongoose = require('mongoose');
var todoSchema = mongoose.Schema({
	creator: String,
	date: String,
	content: String,
	confirmed: Boolean
});
var todos = mongoose.model('todos', todoSchema);

exports.getAll = function(cbFindData)
{
	mongoose.connect(global.dbLocation.nodeTest);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function callback () {				
		todos.find({}, {}, function(err, docs) {
			db.close();
			if (err) {				
				return console.error(err);
			}
			
			cbFindData(docs);
		});
	});
}