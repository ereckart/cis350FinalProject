var clientID = '916258004164-3304q68p6dgrhsqdb1b2d00ncg6gs4mc.apps.googleusercontent.com'
var clientSecret = 'M2bVdirEI6D3giseHeZGvRRa';
var redirectUrl = 'http://localhost:8080/tokensignin';
var userDb = require('../db/login');
var clubDb = require('../db/club');
var eventDb = require('../db/event');

var GoogleAuth = require('google-auth-library');
var auth = new GoogleAuth;
var client = new auth.OAuth2(clientID, clientSecret, redirectUrl);

//DESCRIPTION OF FUNCTION
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

//DESCRIPTION OF FUNCTION
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

//verifying that login info is correct
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

//user can submit conflict
var submitConflict = function(req, res) {
    console.log('within submit conflict');
    console.log(req.body);
    console.log("conflict saved");
    res.redirect('/conflict');
};

//creates a new club
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

//page display join option
var joinClubPage = function(req, res) {
	req.session.clubToJoin = req.params.clubname;
	if (req.session.isLoggedIn) {
		res.cookie('clubToJoin', req.params.clubname);
		res.render('join');
	} else {
		res.redirect('/');
	}
};

//user can join club
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

//displays club page for admin
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

//displays clubpage for general member
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


//updates the club description
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

//creates a new event
var createEvent = function(req, res) {
    console.log('within create Event');
    console.log(req.body);


    //get event infor from req.body
    var title = req.body.eventTitle;
    var date = req.body.eventDate;
    var start = req.body.eventStart;
    var end = req.body.eventEnd;
    var club = req.body.clubname;
    r = req.body;


    // parse all the things from req.body that contain member and add them to an array
    members = [];
    for (var key in r) {
        if (key.includes('member')) {
            members.push(r[key]);
        }
    }


    var event = {clubname: club, date: date, starttime: start, endtime: end, eventname: title, invited: members};
    eventDb.getEvent(title, function(error, events) {
        if (error) {
            console.log(error);
        } else {
            if(events.length == 0) {
                eventDb.addEvent(event, function(error) {
                    if(error) {
                        console.log(error);
                    }
                    else {
                        console.log('New Event Added!');
                        var eventsArray = [];
                        eventsArray.push(event);
                        res.cookie('events', JSON.stringify(eventsArray));
                        res.redirect('/clubpage/' + club + '/admin/' + req.session.userid);

                    }
                });
            }
        }
    });
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