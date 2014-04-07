
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', 
	  { 
	  current:'index', 
	  title: 'Express', 
	  mainBody: '' });
};

//bootstrap
exports.portal = function(req, res) {
	res.render('basic', {current: 'main'});	
};
exports.sunflowerV2 = function(req, res) {
	
	
};


exports.sunflower = function(req, res) {
	var meta = require(global.appDir + '/custom.js');
	meta.readMetaHtml({path: '/views/Portal/sunflower.html', res: res, render: render});
	
	function render(data)
	{
		res.render('index', {current:'sunflower', title: '太陽花學運', mainBody: data.toString()});
	}
};

exports.setCookie = function( req, res, next) {
	var uid = req.cookies && req.cookies.uid ?
			req.cookies.uid : undefined;
	if( !uid) {
		res.cookie('uid', guid());		
	}
	next();
	
}

function guid() {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x100000)
					.toString(16)
					.substring(1);
	}
	
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
			s4() + '-' + s4() + s4() + s4();
	
}