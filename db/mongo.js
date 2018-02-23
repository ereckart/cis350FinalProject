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
  clubs: [Number]
});

var clubSchema = new mongoose.Schema({
  clubid: Number,
  adminid: Number,
  clubname: String,
  members: [String]
});

var User = mongoose.model('User', userSchema);
var Club = mongoose.model('Club', clubSchema);

module.exports = {
  User: User,
  Club: Club,
  mongoose: mongoose,
  db: db.collection('Accounts')
};
