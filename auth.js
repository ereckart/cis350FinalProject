const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

module.exports = (passport) => {
	passport.serializeUser((user, done) => {
		done(null, user);
	});

	passport.deserializeUser((user, done) => {
		done(null, user);
	});

	passport.use(new GoogleStrategy({
		clientID: '916258004164-3304q68p6dgrhsqdb1b2d00ncg6gs4mc.apps.googleusercontent.com',
		clientSecret: 'M2bVdirEI6D3giseHeZGvRRa',
		callbackURL: 'http://localhost:8080/loggedIn'
	},
	(token, refreshToken, profile, done) => {
		return done(null, {
			profile: profile,
			token: token
		});
	}));
};