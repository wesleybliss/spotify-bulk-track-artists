
var getArtist = require('../util/follow');

var matches = [];

var search = function( oname, loop ) {
    console.log( 'info', 'Fetching artist:', oname );
    getArtist( oname, function( err, name ) {
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
    
    if ( !req.body.artists ) {
        return res.render( 'error' );
    }
    
    var queries = req.body.artists.split('\n');
    
    for ( var i in queries ) {
        search( queries[i], function() {
            console.log( 'loop, matches ', matches.length, ', queries ', queries.length );
            if ( matches.length === queries.length ) {
                console.log( 'loop', 'Finished, rendering' );
                res.render( 'index', {
                    title:  'Spotify Bulk Import Artists',
                    action: 'search',
                    artists: matches
                });
            }
        });
    }
    
};