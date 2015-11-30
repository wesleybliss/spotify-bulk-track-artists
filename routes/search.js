
var config = require('../config'),
    getArtist = require('../util/follow')
;

var matches = [];

var search = function( token, oname, loop ) {
    console.log( 'info', 'Fetching artist:', oname );
    getArtist( token, oname, function( err, name ) {
        if ( err ) {
            console.log( 'error', err );
        }
        else {
            console.log( 'info', 'Found artist', oname, '-->', (err ? err : name) );
            matches.push({
                query: oname,
                match: (err ? err : name)
            });
        }
        loop();
    });
};

module.exports = function( req, res, next ) {
    
    var artists = req.body.artists || null;
    
    if ( !artists ) {
        //return res.render( 'error' );
        return res.render( 'matches', {
            title:  'Spotify Bulk Import Artists',
            action: false,
            artists: false
        });
    }
    
    var queries = artists.split('\n');
    
    console.log('info', 'searching artists w/token ', req.session.access_token);
    
    for ( var i in queries ) {
        search( req.session.access_token, queries[i], function() {
            console.log( 'loop, matches ', matches.length, ', queries ', queries.length );
            if ( matches.length === queries.length ) {
                console.log( 'loop', 'Finished, rendering' );
                res.render( 'matches', {
                    title:  'Spotify Bulk Import Artists',
                    action: 'search',
                    artists: matches
                });
            }
        });
    }
    
};