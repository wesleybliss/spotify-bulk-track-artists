
var config = require('../config'),
    lib = require('../lib'),
    querystring  = require('querystring'),
    session      = require('express-session')
;

module.exports = function( req, res ) {
    
    var state = lib.generateRandomString(16);
    req.cookies[config.stateKey] = state;
    
    session[config.stateKey] = state;
    
    // your application requests authorization
    var scope = 'user-read-private user-read-email user-follow-read user-follow-modify';
    
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: config.client_id,
            scope: scope,
            redirect_uri: config.redirect_uri,
            state: state
        }));
    
};