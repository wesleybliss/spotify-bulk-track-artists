var	express      = require('express'),
	request      = require('request'),
	querystring  = require('querystring'),
	cookieParser = require('cookie-parser')
;

var app = express();

var routes = {
	login: 			new require('./routes/login'),
	callback: 		new require('./routes/callback'),
	refresh_token: 	new require('./routes/refresh_token')
};

app.use(express.static(__dirname + '/public'))
    .use(cookieParser());

app.get( '/login',			routes.login );
app.get( '/callback',		routes.callback );
app.get(' /refresh_token',	routes.refresh_token );

console.log('Listening on 8888');
app.listen(8888);