
var postLogin = function(req, res){
	console.log('in here');
	res.send(req.body.username);
}

var routes = {
	post_login: postLogin
};

module.exports = routes;