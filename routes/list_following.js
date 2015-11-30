
var config = require('../config'),
    lib = require('../lib'),
    request = require('request'),
    cookieParser = require('cookie-parser');

var getFollowing = require('../util/following');

module.exports = function(req, res) {
    
    getFollowing( req, function( error, artists ) {
        
        var json = req.query.json || false;
        
        if (!error ) {
            if ( json ) {
                res.send({
                    artists: artists
                });
            }
            else {
                res.render( 'following', {
                    title: 'All Followed Artists',
                    artists: artists
                });
            }
        }
        else {
            if ( json ) {
                res.send({
                    title: 'following artists (error)',
                    artists: null
                });
            }
            else {
                res.render( 'following', {
                    title: 'All Followed Artists (error)',
                    artists: null
                });
            }
        }
        
    });
    
};