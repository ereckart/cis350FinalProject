var mongoose = require('mongoose');
mongoose.connect('mongodb://team38:cis350@ds147668.mlab.com:47668/club-central', function (err) {
  if (err && err.message.includes('ECONNREFUSED')) {
    console.log('Error connecting to mongodb database: %s.\nIs "mongod" running?', err.message);
    process.exit(0);
  } else if (err) {
    throw err;
  } else {
    console.log('DB successfully connected. Adding seed data...');
  }
});
mongoose.Promise = global.Promise;
var db = mongoose.connection;

var userSchema = new mongoose.Schema({
  userid: {type: String, unique: true, required: true},
  email: String,
  name: String,
  clubs: [String]
});

var clubSchema = new mongoose.Schema({
  clubid: {type: String, unique: true, required: true},
  adminid: String,
  clubname: String,
  members: [String],
  welcomeblurb: String
});

var eventSchema = new mongoose.Schema({
  eventid: {type: String, unique: true, required: true},
  date: Number,
  starttime: Number,
  endtime: Number,
  eventname: String,
  location: String,
  invited: [String]
})

var User = mongoose.model('User', userSchema);
var Club = mongoose.model('Club', clubSchema);
var Event = mongoose.model('Event', eventSchema);

module.exports = {
  User: User,
  Club: Club,
  Event: Event,
  mongoose: mongoose,
  db: db.collection('Accounts')
};
