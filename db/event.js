var mongo = require('./mongo');

module.exports = {

    // Get event by eventname.
    getEvent: function (name, callback) {
        return mongo.ClubEvent.find({eventname: name}).exec(function (error, events) {
            callback(error, events);
        });
    },

    // Add a new event.
    addEvent: function (eventData, callback) {
        var event = new mongo.ClubEvent(eventData);
        console.log('inside add Event');
        console.log(eventData);
        event.save(function (error) {
            if(error) {
                callback(error);
            }
            callback(error);
        });
    }

  //   //get club description
  //   getClubDescription: function (id, callback) {
  //       var clubBlurb = mongo.Club.findOne({clubname: id}).toArray(function(err) {
  //           if(err) {
  //               callback(err, 'could not change description');
  //           }
  //           console.log('got club description');
  //       });
  //       var clubDescription = clubBlurb[3];
  //       return clubDescription;
  //   },

  //   //change club description
  //   changeClubDescription: function(id, newDescription, callback) {
  //       var myquery = {clubname: id};
  //       var newvalues = { $set: {welcomeblurb: newDescription}};
  //       mongo.Club.updateOne(myquery, newvalues, function(err) {
  //           if (err) {
  //               callback(err, '');
  //               console.log('inside changeClubDescription');
  //           }
  //           console.log('changed club description');
  //       });
  //   },

  // addMember: function(user, club, callback) {
  //   mongo.Club.find({clubname: club}, function(err, clubs){
  //     if (err) console.log(err);

  //     var newMembers = clubs[0].members;
  //     if(! newMembers.includes(user)) {
  //       newMembers.push(user);
  //       console.log("new Members:");
  //       console.log(newMembers);

  //       mongo.Club.update({clubname: club}, {$set: {members: newMembers}}, callback);
  //     }

  //   });
  // }
};

