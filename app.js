var express = require("express");
var app = express();

app.engine('html', require('ejs').__express);
app.set('view engine', 'html');
app.set('views', './public');
app.use(express.static(__dirname + 'public'));

app.get('/', (req, res) => res.render('login'));

app.listen(8080);
console.log("listening on port " + 8080);