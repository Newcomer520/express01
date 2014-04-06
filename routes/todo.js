var mongoose = require('mongoose');
var todoSchema = mongoose.Schema({
	creator: String,
	date: String,
	content: String,
	confirmed: Boolean
});
var todo = mongoose.model('todos', todoSchema);



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
					mainBody: data.toString(),
					scripts: ['script/todo/main.js'],
					css: ['stylesheets/mongo.css']
				})
			);
	}
	
	
};

exports.create = function(req, res, next)
{
	if (!req.body.todo || !req.body.todo.content) {
		res.status(403).send('內容無效');
	}
	
	var newTodo = new todo({
		creator: req.cookies.uid,
		content: req.body.todo.content,
		confirmed: false
	});
	mongoose.connect('mongodb://localhost:27017/nodeTest');
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function callback () {
		newTodo.save(function(e, newInstance, count) {
			if (e) 
			{				
				db.close();
				return next( err );
			}
			todo.find({}, {}, function(err, docs) {
				db.close();
				if (err) {				
					return console.error(err);
				}
				res.json(docs);
			});
			//res.status(200).send('ok');
			
		});
	});
};