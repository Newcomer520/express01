
/**
 * Module dependencies.
 */
var path = require('path');
global.appDir = path.dirname(require.main.filename);


var express = require('express');
var routes = require('./routes');
var http = require('http');
var engine = require('ejs-locals');


global.dbLocation = {
	nodeTest: "mongodb://localhost:27017/nodeTest"
};

var app = express();

// all environments
app.engine('ejs', engine);
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
global.locals = {
	root: 'http://localhost:3000//',
	dbLocation: {
		nodeTest: 'mongodb://localhost:27017/nodeTest'
	}
};


var mongo = require('./routes/mongo.js')
,	todo = require('./routes/todo.js')
,	working = require('./routes/working.js');
//for google oauth
var passport = require('passport')
,   passGoogle = require('./config/passGoogle.js')
,   auth = require('./config/auth.js')
,	User = require('./ORM/User.js');

//app.use(express.favicon());
app.use(express.favicon("public/images/favicon.ico")); 
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
//app.use(express.cookieParser());
app.use(routes.setCookie);
//app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.configure(function() {
	  //app.use(express.static('public'));
	  app.use(express.cookieParser());
	  //app.use(express.bodyParser());
	  app.use(express.session({ secret: 'keyboard cat' }));
	  app.use(passport.initialize());
	  app.use(passport.session());
	  app.use(app.router);
	}
);



passGoogle(passport);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/V2', routes.index);
app.get('/', routes.portal);
app.get('/sunflower', routes.sunflower);
//app.get('/users', user.list);
app.get('/mongo', mongo.index);
app.get('/mongo/getlist', mongo.getList);
app.get('/jcube', working.jCubeTest);
app.get('/todo', todo.index);
app.get('/api/todo', todo.getAll);
app.post('/api/todo', todo.create);

app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
//after callback
app.get('/auth/google/callback',
        passport.authenticate('google', {
                successRedirect : '/',
                failureRedirect : '/'
        }));
app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

