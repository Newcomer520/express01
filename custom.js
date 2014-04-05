	
exports.readMetaHtml = function(o)
{
	if (!o.res || ! o.path) {
		throw ('errrrr');
	}
	var fs = require('fs');
	fs.readFile(global.appDir + o.path, onRead);

	function onRead(err, data) {
		if (err) {
			o.res.writeHead(404, {'content-type': 'text/plain'});
			o.res.write('oooooops! something wrong');
			o.res.end();
			return;
		}
		
		if(typeof o.render == 'function') {
			o.render(data);
		}
			
	}
};

exports.ejsData = function(o)
{
	var extend =require('extend');
	
	var ret
	= extend(
			o, 
			{
				scriptSrc: function(script) {
					return '<script src="' + script + '"></script>';
				},
				cssHref: function(css) {
					return '<link rel="stylesheet" type="text/css" href="' + css + '" />';
				}
			}
		);
	return ret;
}


