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
    var clubs = [];
    var adminclubs = [];

    var user = {userid: userid, email: email, name: name, clubs: clubs, adminClubs: adminclubs};
    var userFile = userDb.getUserOrAdd(userid, function (error, users) {
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
                clubs = users[0].clubs;
                adminclubs = users[0].adminClubs;
                res.cookie('adminclubs', JSON.stringify(adminclubs));
                res.cookie('clubs', JSON.stringify(clubs));
                req.session.isLoggedIn = true;
                req.session.userid = userid;
                res.cookie('userid', userid);
                res.cookie('email', email);
                res.cookie('name', name);
                res.send('message');
                console.log("USER:" + users[0]);
            }
        }
    });
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
	if (req.session.clubToJoin) {
        req.session.isLoggedIn = true;
		res.cookie('clubToJoin', req.session.clubToJoin);
		res.redirect('/join/' + req.session.clubToJoin);
	}
	else if (req.session.isLoggedIn) {
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

	clubDb.getClubOrAdd(clubname, function (error, clubs) {
        if (error) {
            console.log(error);
        } else {
            if(clubs.length == 0) {
                clubDb.addClub(clubData, function(error) {
                    console.log('got to add club callback!!');
                    if(error) {
                        console.log(error);
                    }
                    else {
                        var adminclubsCookie = JSON.parse(req.cookies.adminclubs);
                        adminclubsCookie.push(clubname);
                        res.cookie('adminclubs', JSON.stringify(adminclubsCookie));
                        userDb.addAdminClub(req.session.userid, clubname, function(error) {
                            if(error) {
                                console.log(error);
                            }
                        });
                        res.cookie('blurb', req.body.welcomemessage);
                        console.log('New Club Added!');
                        res.redirect('/welcome');
                    }
                });
            }
            else {
                //res.cookie('clubs', users[0].clubs);
                var u = users[0];
                res.send('Sorry, this club already exists!')
                //clubs = ['hi'];
            }
        }
    });
}

var joinClubPage = function(req, res) {
	console.log('inside join club page');
	req.session.clubToJoin = req.params.clubname;
	if (req.session.isLoggedIn) {
		res.cookie('clubToJoin', req.params.clubname);
		res.render('join');
	} else {
		res.redirect('/');
	}
}

var joinClub = function(req, res) {
	console.log('inside join club')
}

var clubPageAdmin = function(req, res) {
	adminId = req.params.adminid;
	clubname = req.params.clubname;

    clubDb.getClubOrAdd(clubname, function(error, clubs) {
        if (error) {
            console.log(error);
        }
        else {
            console.log('CLUB:');
            console.log(clubs[0]);
            res.cookie('clubName', clubname);
            res.cookie('blurb', clubs[0].welcomeblurb);
            res.render('club-admin');
        }
    });


	// do whatever you want with these two things

	// res.render('club-admin');

}

var routes = {
	post_login: postLogin,
	verify_token: verifyToken,
	verify_login: verifyLogin,
    submit_conflict: submitConflict,
    new_club: newClub,
    join_club: joinClub,
    join_club_landing_page: joinClubPage,
    club_page_admin: clubPageAdmin
};

module.exports = routes;