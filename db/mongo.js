/* Connect to Database */
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

/* Set up DB Schemas */
var userSchema = new mongoose.Schema({
    userid: {type: String, unique: true, required: true},
    email: {type: String},
    name: {type: String, required: true},
    clubs: [String],
    adminClubs: [String]
});

var clubSchema = new mongoose.Schema({
    clubname: {type: String, unique: true, required: true},
    adminid: {type: String, required: true},
    members: [String],
    events: [String],
    conflicts: [String],
    welcomeblurb: String
});

var eventSchema = new mongoose.Schema({
    eventid: {type: String, unique: true, required: true},
    clubname: {type: String, required: true},
    date: {type: String, required: true},
    starttime: {type: String, required: true},
    endtime: {type: String, required: true},
    eventname: {type: String, required: true},
    invited: [String]
});

var conflictSchema = new mongoose.Schema({
    conflictid: {type: String, unique: true, required: true},
    ownerid: {type: String, required: true},
    date: {type: String, required: true},
    starttime: {type: String, required: true},
    endtime: {type: String, required: true},
    reason: {type: String, required: true}
});

var User = mongoose.model('User', userSchema);
var Club = mongoose.model('Club', clubSchema);
var ClubEvent = mongoose.model('ClubEvent', eventSchema);
var Conflict = mongoose.model('Conflict', conflictSchema);

module.exports = {
    User: User,
    Club: Club,
    ClubEvent: ClubEvent,
    Conflict: Conflict,
    mongoose: mongoose,
    db: db.collection('Accounts')
};
