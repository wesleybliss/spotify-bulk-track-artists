
var config = require('../config'),
    getArtist = require('../util/follow')
;

var matches = [];

var search = function( token, oname, loop ) {
    console.log( 'info', 'Fetching artist:', oname );
    getArtist( token, oname, function( err, name, id ) {
        if ( err ) {
            console.log( 'error', err );
        }
        else {
            console.log( 'info', 'Found artist', oname, '-->', (err ? err : name) );
            matches.push({
                query: oname,
                match: (err ? err : name),
                id:    (err ? null : id)
            });
            console.log(matches);
        }
        loop();
    });
};

var getMissing = function( queries ) {
    var missing = [];
    for ( var i in queries ) {
        for ( var j in matches ) {
            var found = false;
            if ( queries[i] === matches[j].query ) {
                found = true;
            }
        }
        if ( !found ) missing.push( queries[i] );
    }
    return missing;
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
            
            var missing = getMissing(queries);
            if ( missing.length > 0 ) console.log('MISSING', JSON.stringify(missing));
            
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