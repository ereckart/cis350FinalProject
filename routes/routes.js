
var postLogin = function(req, res){
	console.log('in here');
	res.send('hey');
}

var routes = {
	post_login: postLogin
};

module.exports = routes;