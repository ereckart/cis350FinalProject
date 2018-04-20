var userDb = require('../db/login');
var clubDb = require('../db/club');
var eventDb = require('../db/event');
var conflictDb = require('../db/conflict');
var randomstring = require('randomstring');

/* When the user signs in, this function should be called. It either creates a new account or
 * logs in. This function handles all database interactions.
 */
var postLogin = function(req, res){

    req.session.token = req.user.token;
    console.log('*******************');
    console.log('user: ' + JSON.stringify(req.user));

	var userid = req.user.profile.id;
	var name = req.user.profile.displayName;
    var clubs = [];
    var adminclubs = [];

    var user = {userid: userid, name: name, clubs: clubs, adminClubs: adminclubs};
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
                        clubs = users[0].clubs;
                        adminclubs = users[0].adminClubs;
                        res.cookie('adminclubs', JSON.stringify(adminclubs));
                        res.cookie('clubs', JSON.stringify(clubs));
                        req.session.isLoggedIn = true;
                        req.session.userid = userid;
                        res.cookie('userid', userid);
                        res.cookie('name', name);
                        console.log("USER:" + users[0]);

                        res.redirect('/welcome');
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
                res.cookie('name', name);
                console.log("USER:" + users[0]);

                res.redirect('/welcome');
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
	if (req.session.clubToJoin && req.session.isLoggedIn ) {
		res.cookie('clubToJoin', req.session.clubToJoin);
		res.redirect('/join/' + req.session.clubToJoin);
	}
	else if (req.session.isLoggedIn) {
		res.redirect('/welcome');
	}
    else {
        res.redirect('/auth/google');
    }
};

// Submit a conflict.
var submitConflict = function(req, res) {
    console.log('within submit conflict');
    console.log(req.body);

    //get event infor from req.body
    var title = req.body.conflictTitle;
    var date = req.body.conflictDate;
    var start = req.body.conflictStart;
    var end = req.body.conflictEnd;
    var ownerid = req.cookies.name;
    r = req.body;
    var id = randomstring.generate(12);

    // parse all the things from req.body that contain club and add them to an array
    clubs = [];
    for (var key in r) {
        if (key.includes('club')) {
            clubs.push(r[key]);
        }
    }
    console.log('array of clubs: ' + clubs);

    var conflict = { conflictid: id,
                    ownerid: ownerid,
                    date: date,
                    starttime: start,
                    endtime: end,
                    reason: title};

    console.log(conflict);

    conflictDb.addConflict(conflict, function(error) {
        if(error) {
            console.log(error);
        }
        for (var clubToAdd in clubs) {
            console.log('trying to add conflict to: ' + clubs[clubToAdd]);
            clubDb.addConflictToClub(id, clubs[clubToAdd], function(error) {
                if(error) {
                    console.log('trying to add conflict to: ' + clubs[clubToAdd]);
                }
            });
        }
        res.redirect('/conflict');
    });
};

// Function to create a new club. Handles database interactions and redirects to welcome
// page when club is added.
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
                res.send('Sorry, this club already exists! Please press the back button and try again with a different club name.');
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
    if (! clubsCookie.includes(clubToJoin)) {
        clubsCookie.push(clubToJoin);
    }
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
            var memberids = clubs[0].members
            var members = [];

            var eventids = clubs[0].events
            var events = [];

            var conflictids = clubs[0].conflicts;
            var conflicts = [];

            for(var i = 0; i < memberids.length; i++) {
                var currid = memberids[i];
                var curri = i;
                (function(currmember, icurrent) {
                userDb.getUserOrAdd(currmember, function(error, users) {
                    if (error) {
                        console.log(error);
                    }
                    members.push(users[0].name);
                    if(icurrent === (memberids.length - 1)) {
                        var eventsvisited = 0;
                        for(var j = 0; j < eventids.length; j++) {
                            var curreventid = eventids[j];
                            var currj = j;
                            (function(currenteventid, jcurr) {
                                eventDb.getEvent(currenteventid, function(error, e) {
                                    if (error) {
                                        console.log(error);
                                    }
                                    events.push(e[0]);
                                    if(eventsvisited == eventids.length - 1) {
                                        conflictsvisited = 0;
                                        for (var k = 0; k < conflictids.length; k++) {
                                            var currconflictid = conflictids[k];
                                            var currk = k;
                                            (function(currentconflictid, kcurr) {
                                                conflictDb.getConflict(currentconflictid, function (error, c) {
                                                    if (error) {
                                                        console.log(error);
                                                    }
                                                    conflicts.push(c[0]);
                                                    if (conflictsvisited == (conflictids.length - 1)) {
                                                        res.cookie('members', JSON.stringify(members));
                                                        res.cookie('events', JSON.stringify(events));
                                                        res.cookie('conflicts', JSON.stringify(conflicts));
                                                        res.cookie('clubName', clubname);
                                                        res.cookie('blurb', clubs[0].welcomeblurb);
                                                        res.render('club-admin');
                                                    } else {
                                                        conflictsvisited++;
                                                    }
                                                })
                                            })(currconflictid, currk);
                                        }
                                        if(conflictids.length == 0) {
                                            res.cookie('members', JSON.stringify(members));
                                            res.cookie('events', JSON.stringify(events));
                                            res.cookie('conflicts', JSON.stringify(conflicts));
                                            res.cookie('clubName', clubname);
                                            res.cookie('blurb', clubs[0].welcomeblurb);
                                            res.render('club-admin');
                                        }

                                    } else {
                                        eventsvisited ++;
                                    }
                                });
                            })(curreventid, currj);
                        }
                        if(eventids.length == 0) {
                            res.cookie('members', JSON.stringify(members));
                            res.cookie('events', JSON.stringify(events));
                            res.cookie('conflicts', JSON.stringify(conflicts));
                            res.cookie('clubName', clubname);
                            res.cookie('blurb', clubs[0].welcomeblurb);
                            res.render('club-admin');
                        }
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
        if (error) {
            console.log(error);
        }
        else {
            console.log('CLUB:');
            console.log(clubs[0]);

            var eventids = clubs[0].events
            var events = [];

            var visited = 0;
            for(var j = 0; j < eventids.length; j++) {
                var curreventid = eventids[j];
                var currj = j;
                (function(currentid, jcurr) {
                    eventDb.getEvent(currentid, function(error, e) {
                        if (error) {
                            console.log(error);
                        }
                        if (e[0].invited.includes(req.cookies.name)) {
                            events.push(e[0]);
                        }
                        if(visited == eventids.length - 1) {
                            res.cookie('events', JSON.stringify(events));
                            res.cookie('clubName', clubname);
                            res.cookie('blurb', clubs[0].welcomeblurb);
                            res.render('club');
                        } else {
                            visited ++;
                        }
                    });
                })(curreventid, currj);
            }
            if(eventids.length == 0) {
                res.cookie('events', JSON.stringify(events));
                res.cookie('clubName', clubname);
                res.cookie('blurb', clubs[0].welcomeblurb);
                res.render('club');
            }
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


    //get event infor from req.body
    var title = req.body.eventTitle;
    var date = req.body.eventDate;
    var start = req.body.eventStart;
    var end = req.body.eventEnd;
    var club = req.body.clubname;
    r = req.body;
    var id = randomstring.generate(12);


    // parse all the things from req.body that contain member and add them to an array
    members = [];
    for (var key in r) {
        if (key.includes('member')) {
            members.push(r[key]);
        }
    }

    console.log(members);

    var event = { eventid: id,
                 clubname: club,
                 date: date,
                 starttime: start,
                 endtime: end,
                 eventname: title,
                 invited: members};
    console.log(event);

    eventDb.getEvent(id, function(error, events) {
        if (error) {
            console.log(error);
        } else {
            if(events.length == 0) {
                eventDb.addEvent(event, function(error) {
                    if(error) {
                        console.log(error);
                    }
                    // console.log('New Event Added!');
                    // var eventsArray = [];
                    // eventsArray.push(event);
                    // console.log(eventsArray);
                    // res.cookie('events', JSON.stringify(eventsArray));
                    clubDb.addEvent(id, club, function(error) {
                        if(error) {
                            console.log(error);
                        }
                        res.redirect('/clubpage/' + club + '/admin/' + req.session.userid);
                    });
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
    //create_conflict: createConflict
};

module.exports = routes;