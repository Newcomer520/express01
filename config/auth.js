/**
 * New node file
 */


module.exports = {

	'facebookAuth' : {
		'clientID' 		: 'your-secret-clientID-here', // your App ID
		'clientSecret' 	: 'your-client-secret-here', // your App Secret
		'callbackURL' 	: 'http://localhost:8080/auth/facebook/callback'
	},

	'twitterAuth' : {
		'consumerKey' 		: 'your-consumer-key-here',
		'consumerSecret' 	: 'your-client-secret-here',
		'callbackURL' 		: 'http://localhost:8080/auth/twitter/callback'
	},

	'googleAuth' : {
		'clientID' 		: '833157214315.apps.googleusercontent.com',
		'clientSecret' 	: 'gUPApr-6Ol1esEq1gWZ3-HIk',
		//'callbackURL' 	: locals.root + 'auth/google/callback'
		'callbackURL': 'http://127.0.0.1:3000/auth/google/callback'
	}

};