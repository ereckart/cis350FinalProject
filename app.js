/* Imports */
var express = require("express");
var app = express();
var path = require('path');
var routes = require('./routes/routes.js');
var uuid = require('node-uuid');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var auth = require('./auth');

/* Dependency Setup */
app.engine('html', require('ejs').__express);
app.set('view engine', 'html');
app.set('views', path.join(__dirname,'public'));
app.use(express.static(path.join(__dirname,'public')));

var generateCookieSecret = () => 'iamasecret' + uuid.v4();
app.use(cookieSession({secret: generateCookieSecret()}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

auth(passport);
app.use(passport.initialize());

/* Routing */
app.get('/', (req, res) => res.render('login'));

app.get('/loggedIn', 
	passport.authenticate('google', {failureRedirect: '/'}),
	routes.post_login
);
app.post('/verifyLogin', routes.verify_login);

app.get('/auth/google', passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/userinfo.profile']
}));

app.get('/create', (req, res) => res.render('create'));
app.get('/club/:clubname', routes.club_page);
app.get('/clubpage/:clubname/admin/:adminid', routes.club_page_admin);
app.get('/conflict', (req, res) => res.render('conflict'));
app.post('/submitConflict', routes.submit_conflict);
app.get('/welcome', (req, res) => res.render('welcome'));
app.post('/createClub', routes.new_club);
app.post('/createEvent', routes.create_event);
app.post('/editDescription', routes.update_description);
app.get('/join/:clubname', routes.join_club_landing_page);
app.get('/join', routes.join_club);


/* Start App */
app.set('port', process.env.PORT || 8080);

var server = app.listen(app.get('port'), function () {
console.log('Express server listening on port %d', server.address().port);
});

/* To be stored in Config.JSON */
// Client ID: 916258004164-3304q68p6dgrhsqdb1b2d00ncg6gs4mc.apps.googleusercontent.com
// Client secret: M2bVdirEI6D3giseHeZGvRRa