var mongo = require('./mongo');

module.exports = {

  //gets user if not found adds user
  getUserOrAdd: function (id, callback) {
    return mongo.User.find({userid: id}).exec(function (error, users) {
      callback(error, users);
    });
  },

  //gets user
  getUser: function (id) {
    mongo.User.find({userid: id}, function(err, users) {

    });
  },

  //adds user
  addUser: function (userData, callback) {
    console.log('got to add user function!');
    var user = new mongo.User(userData);
    console.log(userData);
    console.log('created user doc');
    user.save(function (error) {
      if(error) {
        callback(error);
      } else {
            console.log('got to save function');
            callback();
      }
    });
  },

  //adds a club to the admin
  addAdminClub: function(id, adminClub, callback) {
    mongo.User.find({userid: id}, function(err, users){
      if (err) console.log(err);

      var newAdminClubs = users[0].adminClubs;
      newAdminClubs.push(adminClub);
      console.log("new Admin clubs:");
      console.log(newAdminClubs);

      mongo.User.update({userid: id}, {$set: {adminClubs: newAdminClubs}}, callback);

    });
  },

  //adds a club to the user
  addClub: function(id, club, callback) {
    console.log('Adding club to the user doc!');
    mongo.User.find({userid: id}, function(err, users){
      if (err) console.log(err);
      console.log('checkpoint 1');
      var newClubs = users[0].clubs;
      console.log('my clubs:' + newClubs);
      console.log('club to add:' + club);
      if(! newClubs.includes(club)) {
        console.log('checkpoint 2');
        newClubs.push(club);
        console.log("new Clubs:");
        console.log(newClubs);

        mongo.User.update({userid: id}, {$set: {clubs: newClubs}}, callback);
      }

    });
  }
};