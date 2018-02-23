var clientID = '916258004164-3304q68p6dgrhsqdb1b2d00ncg6gs4mc.apps.googleusercontent.com'
var clientSecret = 'M2bVdirEI6D3giseHeZGvRRa';
var redirectUrl = 'http://localhost:8080/tokensignin';

var GoogleAuth = require('google-auth-library');
var auth = new GoogleAuth;
var client = new auth.OAuth2(clientID, clientSecret, redirectUrl);

var postLogin = function(req, res){
	console.log('in here');
	res.send('hey');
}

var verifyToken = function(message) {
	console.log('in verification');
	console.log(message.body)
	var token = {idtoken: message.body.idtoken}

	client.verifyIdToken(
		token, 
		clientID, 
		function(e, login) {
			if (e) {
				console.log(e);
				return;
			}
			var payload = login.getPayload()
			var userid = payload['sub'];
		});
};

var routes = {
	post_login: postLogin,
	verify_token: verifyToken
};

module.exports = routes;