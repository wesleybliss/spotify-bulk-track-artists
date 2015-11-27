var	express      = require('express'),
	request      = require('request'),
	querystring  = require('querystring'),
	cookieParser = require('cookie-parser'),
	session 	 = require('express-session')
;

var app = express();

/*Log = function(){};
Log.prototype._getArgs = function( tag, args ) {
	args.unshift( tag );
	return args;
};
Log.prototype.d = function() {
	console.log.apply( this, this.getArgs('DEBUG', arguments) );
};*/

app.use(cookieParser());
app.use(session({
	/*genid: function(req) {
    	return genuuid() // use UUIDs for session IDs
    },*/
	secret: 'lalala'
}));

var routes = {
	login: 			new require('./routes/login'),
	callback: 		new require('./routes/callback'),
	refreshToken: 	new require('./routes/refresh_token'),
	listFollowing:  new require('./routes/list_following')
};

app.use(express.static(__dirname + '/public'))
   .use(cookieParser());

app.get( '/login',			routes.login );
app.get( '/callback',		routes.callback );
app.get( '/refreshtoken',	routes.refreshToken );
app.get( '/following',	    routes.listFollowing );


console.log('Listening on 8888');
app.listen(8888);