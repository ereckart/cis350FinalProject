var mongo = require('./mongo');

module.exports = {
  // getAllReviews: function (callback) {
  //   mongo.Reviews.find(function (error, reviews) {
  //     callback(error, reviews);
  //   });
  // },

  getUser: function (id, callback) {
    mongo.Users.find({id: id}).exec(function (error, users) {
      callback(error, users);
    });
  },

  addUser: function (userData, callback) {
    console.log('got to add user function!');
    var user = new mongo.User(userData);
    console.log('created user doc');
    user.save(function (error) {
      if(error) {
        return handleError(error);
      }
      console.log('got to save function');
      //callback(error);
    });
  }
};