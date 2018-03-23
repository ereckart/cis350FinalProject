var mongo = require('./mongo');

module.exports = {
  addClub: function (clubData, callback) {
    var club = new mongo.Club(clubData);
    console.log('inside add Club');
    console.log(clubData);
    club.save(function (error) {
      if(error) {
        callback(error, '');
      }
      console.log('got to save function');
    });
  }
};