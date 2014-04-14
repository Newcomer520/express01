/**
 * New node file
 */

//var mongoose = //require('mongoose');
var mongoose = require('./nodeTest');

var todoSchema = mongoose.Schema(
	{
		creator: String,
		date: String,
		content: String,
		confirmed: Boolean
	}		
);

module.exports = mongoose.model('todos', todoSchema);