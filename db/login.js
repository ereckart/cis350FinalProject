var mongo = require('./mongo');

module.exports = {

  getUserOrAdd: function (id, callback) {
    return mongo.User.find({userid: id}).exec(function (error, users) {
      callback(error, users);
    });
  },

  getUser: function (id) {
    mongo.User.find({userid: id}, function(err, users) {

    });
  },

  addUser: function (userData, callback) {
    console.log('got to add user function!');
    var user = new mongo.User(userData);
    console.log(userData);
    console.log('created user doc');
    user.save(function (error) {
      if(error) {
        callback(error);
      }
      console.log('got to save function');
      //callback(error);
    });
  }
};