
var config = require('../config'),
    lib = require('../lib'),
    request = require('request');

module.exports = function(req, res) {
    
    // requesting access token from refresh token
    var refresh_token = req.query.refresh_token;
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'Authorization': 'Basic ' + (new Buffer(config.client_id + ':' + config.client_secret).toString('base64'))
        },
        form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        },
        json: true
    };
    
    console.log( '[DEBUG]', 'Refreshing token', refresh_token );

    request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var access_token = body.access_token;
            console.log( '[DEBUG]', 'Access token received:', access_token );
            res.send({
                'access_token': access_token
            });
        }
        else {
            console.log( '[ERROR]', {
                'Status Code': response.statusCode,
                'Error Message': error
            });
        }
    });
    
};