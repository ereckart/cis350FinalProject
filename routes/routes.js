var clientID = '916258004164-3304q68p6dgrhsqdb1b2d00ncg6gs4mc.apps.googleusercontent.com'
var clientSecret = 'M2bVdirEI6D3giseHeZGvRRa';
var redirectUrl = 'http://localhost:8080/tokensignin';
var userDb = require('../db/login');

var GoogleAuth = require('google-auth-library');
var auth = new GoogleAuth;
var client = new auth.OAuth2(clientID, clientSecret, redirectUrl);

var postLogin = function(req, res){
	console.log(req.body);

	var userid = req.body.userid;
	var email = req.body.email;
	var name = req.body.name;

    var user = {userid: userid, email: email, name: name, clubs:[]};
    userDb.getUser(userid, function (error, users) {
        if (error) {
            console.log(error);
        } else {
            if(users.length == 0) {
                userDb.addUser(user, function(error) {
                    if(error) {
                        console.log(error);
                    }
                    else {
                        console.log('New User Added!');
                    }
                });
            }
        }
    });

// check your terminal's console, but req.body is basically a json object
// with three fields - email, name, and userid.

	res.send('message'); // this is just dummy
}

var verifyToken = function(req, res) {
	console.log('in verification');
	console.log(req.body)
	var token = {idtoken: req.body.idtoken}

	// client.verifyIdToken(
	// 	token,
	// 	clientID,
	// 	function(e, login) {
	// 		if (e) {
	// 			console.log(e);
	// 			return;
	// 		}
	// 		var payload = login.getPayload()
	// 		var userid = payload['sub'];
	// 	});

	res.send('success')
};

var verifyLogin = function(req, res) {

	// once postLogin is complete, add the line below into there
	req.session.isLoggedIn = true;

	if (req.session.isLoggedIn) {
		res.redirect('/welcome');
	};
};

var routes = {
	post_login: postLogin,
	verify_token: verifyToken,
	verify_login: verifyLogin
};

module.exports = routes;