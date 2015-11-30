
var config = require('../config'),
    request = require('request')
;

var limit = 50;
var total = 0;
var totallimit = 200;
var lastid = null;
var results = [];

var checkFollowing = function( req, artists, done ) {
    
    total += artists.length;
    results = results.concat( artists );
    
    // didnt get back a full set, or total reaches max level
    console.log('checkFollowing', 'batch', artists.length, 'total', total);
    if ( artists.length < limit || total >= totallimit ) {
        return done( false, results );
    }
    
    lastid = artists.pop().id;
    console.log('checkFollowing', 'set last id', lastid);
    return getFollowing( req, done );
    
};

var getFollowing = function( req, done /*(err, artists)*/ ) {
    
    var url = 'https://api.spotify.com/v1/me/following?type=artist&limit=' + limit;
    
    if ( lastid != null ) url += '&after=' + lastid;
    
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
            
            //console.log(body);
            console.log( '[DEBUG]', 'followed artists received:', body.artists.items.length, 'bytes' );
            
            total += body.artists.items.length;
            
            //done( false, body.artists.items );
            checkFollowing( req, body.artists.items, done );
            
        }
        else {
            
            console.log( '[ERROR]', {
                'Status Code': response.statusCode,
                'Error Message': error
            });
            
            done( response.statusCode + ' ' + error, null );
            
        }
    });
    
};

module.exports = getFollowing;