
var config = require('../config'),
    request = require('request')
;

var trackArtists = function( token, names, ids, done /*=>(err)*/ ) {
    
    console.log('trackArtist', ids.join(','), names.join(','));
    
    if ( ids.length > 50 ) {
        return done( ids.length + ' exceeds the maximum amount per request', false );
    }
    
    var url = 'https://api.spotify.com/v1/me/following';
    
    url += '?type=artist&ids=';
    url += ids.join(',');
    
    if ( !token ) {
        console.log( 'error', 'missing token/cookie' );
        return done( 'missing token/cookie' );
    }
    
    var authOptions = {
        headers: {
            'Authorization': 'Bearer ' + token
        },
        json: true
    };
    
    request.put(url, authOptions, function(error, response, body) {
        console.log('trackArtists', error, response.statusCode, body);
        if ( !error && (response.statusCode === 200 || response.statusCode === 204) ) {
            console.log( 'trackArtists', JSON.stringify(body) );
            return done( false );
        }
        else {
            return done( '(' + response.statusCode + ') '
                + error + ' ' + JSON.stringify(body) );
        }
    });
    
};

module.exports = trackArtists;