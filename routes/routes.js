var clientID = '916258004164-3304q68p6dgrhsqdb1b2d00ncg6gs4mc.apps.googleusercontent.com'
var clientSecret = 'M2bVdirEI6D3giseHeZGvRRa';
var redirectUrl = 'http://localhost:8080/tokensignin';
var userDb = require('../db/login');
var clubDb = require('../db/club');

var GoogleAuth = require('google-auth-library');
var auth = new GoogleAuth;
var client = new auth.OAuth2(clientID, clientSecret, redirectUrl);

var postLogin = function(req, res){
	//console.log('hi');
    console.log(req.body);

	var userid = req.body.userid;
	var email = req.body.email;
	var name = req.body.name;
    var clubs = ['WiCS'];

    var user = {userid: userid, email: email, name: name, clubs: clubs};
    //res.cookie('clubs', user.clubs);
    var userFile = userDb.getUser(userid, function (error, users) {
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
            else {
                //res.cookie('clubs', users[0].clubs);
                var u = users[0];
                //clubs = ['hi'];
            }
        }
    });

    //console.log(userFile);

    //console.log(clubs);
    res.cookie('clubs', JSON.stringify(clubs));
    req.session.isLoggedIn = true;
    req.session.userid = userid;
    res.cookie('userid', userid);
    res.cookie('email', email);
    res.cookie('name', name);

// check your terminal's console, but req.body is basically a json object
// with three fields - email, name, and userid.

	res.send('message'); // this is just dummy
    //res.redirect('/welcome')
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
    console.log('Name is: ' + req.session.name);
	if (req.session.isLoggedIn) {
		res.redirect('/welcome');
	};
};

var submitConflict = function(req, res) {
    res.redirect('/conflict');
}

var newClub = function(req, res) {
	console.log('new club');
	console.log(req.body);

	clubname = req.body.clubname.replace(/\s/g, '');

	var clubData = {
		adminid: req.session.userid,
		clubname: clubname,
		members: [req.session.userid],
		welcomeblurb: req.body.welcomemessage
	};
	clubDb.addClub(clubData, function(err) {
		if (err) {
			console.log(err);
			res.send('sadness');
		} else {
			res.send('success');
		}
	});
}

var joinClubPage = function(req, res) {
	console.log('inside join club page');
	if (req.session.isLoggedIn) {
		res.render('join');
	} else {
		req.
		res.redirect('/')
	}
}

var joinClub = function(req, res) {
	console.log('inside join club')
}

var routes = {
	post_login: postLogin,
	verify_token: verifyToken,
	verify_login: verifyLogin,
    submit_conflict: submitConflict,
    new_club: newClub,
    join_club: joinClub,
    join_club_landing_page: joinClubPage
};

module.exports = routes;