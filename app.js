
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var mongo = require('./routes/mongo.js')
  ,	todo = require('./routes/todo.js');
var http = require('http');
var path = require('path');


global.appDir = path.dirname(require.main.filename);
global.dbLocation = {
	nodeTest: "mongodb://localhost:27017/nodeTest"
};
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//app.use(express.favicon());
app.use(express.favicon("public/images/favicon.ico")); 
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(routes.setCookie);
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/sunflower', routes.sunflower);
app.get('/users', user.list);
app.get('/mongo', mongo.index);
app.get('/mongo/getlist', mongo.getList);
app.get('/todo', todo.index);
app.post('/todo', todo.create);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
