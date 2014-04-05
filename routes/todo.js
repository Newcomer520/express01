var mongoose = require('mongoose');
var todoSchema = mongoose.Schema({
	creator: String,
	date: String,
	content: String,
	confirmed: Boolean
});
var todo = mongoose.model('todo', todoSchema);



exports.index = function(req, res)
{
	var meta = require(global.appDir + '/custom.js');
	meta.readMetaHtml({path: '/views/todo/index.html', res: res, render: render});
	function render(data)
	{
		var custom = require(global.appDir + '/custom.js');
		res.render('index', 
			custom.ejsData(
				{
					current:'todo', 
					title: '代辦事項', 
					mainBody: data.toString()
					//scripts: ['script/mongo/main.js'],
					//css: ['stylesheets/mongo.css']
				})
			);
	}
};