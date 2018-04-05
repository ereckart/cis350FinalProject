var mongo = require('./mongo');

module.exports = {

  //DESCRIPTION OF FUNCTION
  getUserOrAdd: function (id, callback) {
    return mongo.User.find({userid: id}).exec(function (error, users) {
      callback(error, users);
    });
  },

  //DESCRIPTION OF FUNCTION
  getUser: function (id) {
    mongo.User.find({userid: id}, function(err, users) {
      
    });
  },

  //DESCRIPTION OF FUNCTION
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