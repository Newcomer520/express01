/**
 * New node file
 */
var mongoose = require('mongoose');

mongoose.connect(locals.dbLocation.nodeTest);
var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error: '));
	db.once('open', function callback() {
		console.log('got user schema successfully.');
	});


module.exports = mongoose;