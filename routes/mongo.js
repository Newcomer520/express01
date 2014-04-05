/**
 * New node file
 */

exports.index = function(req, res)
{
	var meta = require(global.appDir + '/custom.js');
	meta.readMetaHtml({path: '/views/mongo/index.html', res: res, render: render});
	function render(data)
	{
		var custom = require(global.appDir + '/custom.js');
		res.render('index', 
			custom.ejsData(
				{
					current:'mongo', 
					title: '芒果', 
					mainBody: data.toString(),
					scripts: ['script/mongo/main.js'],
					css: ['stylesheets/mongo.css']
				})
			);
	}
	
	//res.render('index', { current:'mongo', title: '芒果', mainBody: '' });
};

exports.getList = function(req, res)
{
	var users = require(global.appDir + '/ORM/users.js');
	users.getAll(getAllCallback);
	
	function getAllCallback(docs) {
		var ppl = [];
		docs.forEach(function(doc) {
			ppl.push({name: doc.name, email: doc.email});
		})
		
		res.json(ppl);
	}
};
