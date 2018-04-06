//all of the functions for interactions with the database for a club

var mongo = require('./mongo');

module.exports = {

    //gets a club 
    getClubOrAdd: function (id, callback) {
        return mongo.Club.find({clubname: id}).exec(function (error, clubs) {
            callback(error, clubs);
        });
    },

    //adds a club
    /*addClub: function (clubData, callback) {
        var club = new mongo.Club(clubData);
        console.log('inside add Club');
        console.log(clubData);
        club.save(function (error) {
            if(error) {
                callback(error, '');
            }
            console.log('got to save function');
        });
    },*/

    addClubToUser: function (userId, clubname, callback) {

    },

    //get club description
    getClubDescription: function (id, callback) {
        var clubBlurb = mongo.Club.findOne({clubname: id}).toArray(function(err) {
            if(err) {
                callback(err, 'could not change description');
            }    
            console.log('got club description');
        }); 
        var clubDescription = clubBlurb[3];  
        return clubDescription;
    },

    //change club description
    changeClubDescription: function(id, newDescription, callback) {
        var myquery = {clubname: id};
        var newvalues = { $set: {welcomeblurb: newDescription}};
        mongo.Club.updateOne(myquery, newvalues, function(err) {
            if (err) {
                callback(err, '');
                console.log('inside changeClubDescription');
            }
            console.log('changed club description');
        });
    },

    //creates a club and adds it to database
    addClub: function (clubData, callback) {
        var club = new mongo.Club(clubData);
        console.log('inside add Club');
        console.log(clubData);
        club.save(function (error) {
            if(error) {
                console.log(error)
            }
            callback(error);
            console.log('got to save function');
        });
    },

    //adds a member to the club
    addMember: function(user, club, callback) {
        mongo.Club.find({clubname: club}, function(err, clubs){
            if (err) console.log(err);

            var newMembers = clubs[0].members;
            if(! newMembers.includes(user)) {
                newMembers.push(user);
                console.log("new Members:");
                console.log(newMembers);

                mongo.Club.update({clubname: club}, {$set: {members: newMembers}}, callback);
            }

        });
    } 
};

