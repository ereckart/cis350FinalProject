var mongo = require('./mongo');

module.exports = {

  getUser: function (id, callback) {
    mongo.User.find({userid: id}).exec(function (error, users) {
      callback(error, users);
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