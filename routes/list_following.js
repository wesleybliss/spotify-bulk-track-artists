
var config = require('../config'),
    lib = require('../lib'),
    request = require('request'),
    cookieParser = require('cookie-parser');

module.exports = function(req, res) {
    
    var url = 'https://api.spotify.com/v1/me/following?type=artist';
    
    console.log('[DEBUG]', 'sending auth:', req.session.access_token);
    
    var authOptions = {
        headers: {
            'Authorization': 'Bearer ' + req.session.access_token
        },
        json: true
    };
    
    console.log( '[DEBUG]', 'Getting list of followed artists' );

    request.get(url, authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log(body);
            console.log( '[DEBUG]', 'followed artists received:', body.artists.items.length, 'bytes' );
            res.send({
                'artists': body.artists.items
            });
            /*res.redirect('/#' +
                querystring.stringify({
                    access_token: req.session.access_token,
                    artists: body.artists.items
                }));*/
        }
        else {
            console.log( '[ERROR]', {
                'Status Code': response.statusCode,
                'Error Message': error
            });
        }
    });
    
};