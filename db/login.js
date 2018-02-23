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
    var user = new mongo.Users(userData);
    user.save(function (error) {
      callback(error);
    });
  }
};