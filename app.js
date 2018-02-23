var express = require("express");
var app = express();
var path = require('path');
var routes = require('./routes/routes.js');
var uuid = require('node-uuid');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');

app.engine('html', require('ejs').__express);
app.set('view engine', 'html');
app.set('views', path.join(__dirname,'public'));
app.use(express.static(path.join(__dirname,'public')));

var generateCookieSecret = () => 'iamasecret' + uuid.v4();
app.use(cookieSession({secret: generateCookieSecret()}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.get('/', (req, res) => res.render('login'));

app.post('/tokensignin', routes.verify_token)
app.post('/loggedIn', routes.post_login);
app.get('/welcome', (req, res) => res.render('welcome'));

app.listen(8080);
console.log("listening on port " + 8080);

// Client ID: 916258004164-3304q68p6dgrhsqdb1b2d00ncg6gs4mc.apps.googleusercontent.com
// Client secret: M2bVdirEI6D3giseHeZGvRRa