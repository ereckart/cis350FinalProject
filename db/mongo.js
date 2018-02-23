var mongoose = require('mongoose');
mongoose.connect('mongodb://<derulker>:<cis350>@ds147668.mlab.com:47668/club-central', function (err) {
  if (err && err.message.includes('ECONNREFUSED')) {
    console.log('Error connecting to mongodb database: %s.\nIs "mongod" running?', err.message);
    process.exit(0);
  } else if (err) {
    throw err;
  } else {
    console.log('DB successfully connected. Adding seed data...');
  }
});

var db = mongoose.connection;

var userSchema = new mongoose.Schema({
  id: Number,
  email: String,
  firstName: String,
  lastName: String,
  clubs: [Number]
});

var clubSchema = new mongoose.Schema({
  clubid: Number,
  clubname: String,
  members: [String]
});

var Users = mongoose.model('Users', userSchema);
var Clubs = mongoose.model('Clubs', clubSchema);

module.exports = {
  Users: Users,
  Clubs: Clubs,
  mongoose: mongoose,
  db: db.collection('Accounts')
};
