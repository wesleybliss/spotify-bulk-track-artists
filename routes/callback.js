
var config = require('../config'),
    lib = require('../lib')
    request = require('request'),
    querystring  = require('querystring'),
    cookieParser = require('cookie-parser'),
    session      = require('express-session')
;

module.exports = function(req, res) {

    // your application requests refresh and access tokens
    // after checking the state parameter

    var code = req.query.code || null;
    var state = req.query.state || null;
    var storedState = req.cookies ? session[config.stateKey] : null;

    if (state === null || state !== storedState) {
        
        var flash = 'unknown';
        if ( state === null ) flash = 'null state';
        else if ( state !== storedState ) flash = 'stored mismatch';
        
        res.redirect('/#' +
            querystring.stringify({
                error: 'state_mismatch',
                flash: flash + ' -- ' + state + ', ' + storedState
            }));
    } else {
        res.clearCookie(config.stateKey);
        session[config.stateKey] = null;
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: config.redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + (new Buffer(config.client_id + ':' + config.client_secret).toString('base64'))
            },
            json: true
        };

        request.post(authOptions, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                
                req.session.access_token = body.access_token;
                
                config.access_token = body.access_token,
                config.refresh_token = body.refresh_token;
                
                req.cookies.access_token = body.access_token;
                req.cookies.refresh_token = body.refresh_token;

                var options = {
                    url: 'https://api.spotify.com/v1/me',
                    headers: {
                        'Authorization': 'Bearer ' + config.access_token
                    },
                    json: true
                };

                // use the access token to access the Spotify Web API
                request.get(options, function(error, response, body) {
                    console.log(body);
                });

                // we can also pass the token to the browser to make requests from there
                res.redirect('/#' +
                    querystring.stringify({
                        access_token: config.access_token,
                        refresh_token: config.refresh_token
                    }));
            } else {
                res.redirect('/#' +
                    querystring.stringify({
                        error: 'invalid_token'
                    }));
            }
        });
    }
    
};