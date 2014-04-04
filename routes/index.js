
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { current:'index', title: 'Express', mainBody: '' });
};

exports.sunflower = function(req, res) {
	var fs = require('fs');
	fs.readFile(global.appDir + '/views/Portal/sunflower.html', onRead);
	
	function onRead(err, data) {
		if (err) {
			res.writeHead(404, {'content-type': 'text/plain'});
			res.write('oooooops! something wrong');
			res.end();
			return;
		}
	
		res.render('index', {current:'sunflower', title: '太陽花學運', mainBody: data.toString()});
		
	}
};