/**
 * New node file
 */

// given passport = require('passport')

var User = require('../ORM/User.js')
,	auth = require('../config/auth.js');

module.exports = function(passport)
{
	var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
	
	//session usage
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		User.findOne({id: id}, function(err, user) {
            done(err, user);
        });
	});
	
	
	var gs = 
		new GoogleStrategy(
				{
					clientID: auth.googleAuth.clientID,
					clientSecret    : auth.googleAuth.clientSecret,
			        callbackURL     : auth.googleAuth.callbackURL
				},
				function(accessToken, refreshToken, profile, done) {
					process.nextTick(function() {
						User.findOne({id: profile.id}, function(err, user) {
							if (err)
								return done(err);
							if (!user) {
								var newUser = new User();
								newUser.id = profile.id;
								newUser.token = accessToken;
								newUser.name = profile.displayName;
								newUser.email = profile.emails[0].value;
								
								newUser.save(function(err) {
									if (err)
										return done(err);
									
									return done(null, newUser);
								})
							}
							else
							{
								return done(null, user);
							}
							
						});
						
					});
				}
			);
	passport.use(
		gs
	);	
}

exports.isLoggedIn = function(req, res, next) 
{
	if (req.isAuthenticated)
		return next();
	
	res.redirect('/');
}