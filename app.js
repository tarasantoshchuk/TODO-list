
var express  = require('express');
var app      = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash    = require('connect-flash');


var passport = require('passport');
require('./configuration/passport.js')(passport);
app.use(session({ secret: 'secret_converter' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.set('view engine', 'ejs');

var mongoose = require('mongoose');
var config = require('./configuration/config.js');
mongoose.connect(config.database);

require('./api.js')(app, passport);

app.listen(process.env.PORT || 8888, function(){
	console.log("Express server listening on port %d", this.address().port);
});
