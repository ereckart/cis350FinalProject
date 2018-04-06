var clientID = '916258004164-3304q68p6dgrhsqdb1b2d00ncg6gs4mc.apps.googleusercontent.com'
var clientSecret = 'M2bVdirEI6D3giseHeZGvRRa';
var redirectUrl = 'http://localhost:8080/tokensignin';
var userDb = require('../db/login');
var clubDb = require('../db/club');

var GoogleAuth = require('google-auth-library');
var auth = new GoogleAuth;
var client = new auth.OAuth2(clientID, clientSecret, redirectUrl);

/* When the user signs in, this function should be called. It either creates a new account or 
 * logs in. This function handles all database interactions.
 */
var postLogin = function(req, res){
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

// Function to handle OAuth interactions. Incomplete.
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

// Function to verify that the user is logged in. Useful for join redirect flow.
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

// Submit a conflict.
var submitConflict = function(req, res) {
    console.log('within submit conflict');
    console.log(req.body);
    console.log("conflict saved");
    res.redirect('/conflict');
};

// Function to create a new club. Handles database interactions and redirects to welcome page when club is added.
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
};

// Function called when a user tries to join a new club.
var joinClubPage = function(req, res) {
	req.session.clubToJoin = req.params.clubname;
	if (req.session.isLoggedIn) {
		res.cookie('clubToJoin', req.params.clubname);
		res.render('join');
	} else {
		res.redirect('/');
	}
};

// Function that adds a user to a club.
var joinClub = function(req, res) {

    //Get the current user id and the club they are joining
	var user = req.session.userid;
    var clubToJoin = req.cookies.clubToJoin;

    //Add the current user as a member in the club
    clubDb.addMember(user, clubToJoin, function(error) {
        if (error) {
            console.log(error);
        }
    });

    //Add the club to the current user's list of clubs
    userDb.addClub(user, clubToJoin, function(error) {
        if (error) {
            console.log(error);
        }
    });

    //Add club to clubs cookie
    var clubsCookie = JSON.parse(req.cookies.clubs);
    clubsCookie.push(clubToJoin);
    res.cookie('clubs', JSON.stringify(clubsCookie));


    //Redirect to the welcome page
    res.redirect('/welcome');

};

// Displays club page for admin.
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

            var memberids = clubs[0].members
            var members = [];

            for(var i = 0; i < memberids.length; i++) {
                console.log(i);
                console.log(memberids[i]);
                var currid = memberids[i];
                var curri = i;
                (function(currmember, icurrent) {
                userDb.getUserOrAdd(currmember, function(error, users) {
                    if (error) {
                        console.log(error);
                    }
                    members.push(users[0].name);
                    if(icurrent === (memberids.length - 1)) {
                        res.cookie('members', JSON.stringify(members));
                        res.cookie('clubName', clubname);
                        res.cookie('blurb', clubs[0].welcomeblurb);
                        res.render('club-admin');
                    }
                });
                })(currid, curri);
            }
        }
    });
};

// Displays clubpage for general member.
var clubPage = function(req, res) {
    clubname = req.params.clubname;

    clubDb.getClubOrAdd(clubname, function(error, clubs) {
        console.log('IN HERE');
        if (error) {
            console.log(error);
        }
        else {
            console.log('CLUB:');
            console.log(clubs[0]);

            res.cookie('clubName', clubname);
            res.cookie('blurb', clubs[0].welcomeblurb);
            res.render('club');
        }
    });
};

// Updates the club description/blurb.
var updateDescription = function(req, res) {
    console.log('inside update');
    console.log(req.body);

    clubDb.changeClubDescription(req.body.clubName, req.body.welcomeBlurb, function(error){
        if (error) {
            console.log(error);
        } else {
            res.send('success');
        }
    });
    res.redirect('/welcome');
}

// Creates a new event.
var createEvent = function(req, res) {
    console.log('within create Event');
    console.log(req.body);

    r = req.body;

    // parse all the things from req.body that contain member and add them to an array
    members = [];
    for (var key in r) {
        if (key.includes('member')) {
            members.push(r[key]);
        }
    }

    // clubDb.createNewEvent(r.clubname, r.eventTitle, r.eventDate, r.eventStart, r.eventEnd, members, function(error) {
    //     if (error) {
    //         console.log(error);
    //     } else {
    //         res.redirect('/clubpage/' + req.body.clubname + '/admin/' + req.session.userid);
    //     }
    // });

    res.send('new event made');
}

var routes = {
	post_login: postLogin,
	verify_token: verifyToken,
	verify_login: verifyLogin,
    submit_conflict: submitConflict,
    new_club: newClub,
    join_club: joinClub,
    join_club_landing_page: joinClubPage,
    club_page_admin: clubPageAdmin,
    update_description: updateDescription,
    club_page: clubPage,
    create_event: createEvent
};

module.exports = routes;