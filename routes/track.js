
var config = require('../config')
;

var results = [];

var trackArtists = require('../util/track');

module.exports = function( req, res ) {
    
    var artists = req.body.artists || null;
    
    if ( !artists ) {
        //return res.render( 'error' );
        return res.render( 'tracked', {
            title:  'Spotify Bulk Import Artists',
            artists: false,
            error: 'No artists were submitted'
        });
    }
    
    var trackable = [];
    var trackableNames = [];
    
    for ( var i in artists ) {
        
        if ( !artists[i].id || artists[i].id == 'false' ) {
            console.log('track', 'skipping ', artists[i].name);
        }
        else {
            trackable.push( artists[i].id );
            trackableNames.push( artists[i].name );
        }
        
    }
    
    process.nextTick( function() {
        (function(token, names, ids) {
            process.nextTick( function() {
                trackArtists( token, names, ids, function( err ) {
                    
                    results.push({
                        name: names,
                        success: err ? false : true,
                        failReason: err ? err : ''
                    });
                    
                    console.log('track', JSON.stringify(results));
                    
                    res.render( 'tracked', {
                        title:  'Spotify Bulk Import Artists',
                        artists: results
                    });
                    
                });
            });
        })( req.session.access_token, trackableNames, trackable );
    });
    
};