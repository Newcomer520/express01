/**
 * New node file
 */


exports.jCubeTest = function(req, res)
{
	res.render(global.appDir + '/views/misc/jcube.ejs', {current:'jCube', title: 'jCube testing'});
};