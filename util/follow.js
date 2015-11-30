
var config = require('../config'),
    request = require('request')
;

var getArtist = function( token, name, done /*=>(err, name)*/ ) {
    
    console.log( 'getArtist', 'looking up', name );
    
    var url = 'https://api.spotify.com/v1/search';
    
    url += '?type=artist&q=';
    url += encodeURIComponent( name.trim() );
    
    if ( !token ) {
        console.log( 'error', 'missing token/cookie' );
        return done( 'missing token/cookie' );
    }
    
    console.log( 'info', 'req url:', url );
    console.log( 'info', 'req token:', token );
    
    var authOptions = {
        headers: {
            'Authorization': 'Bearer ' + token
        },
        json: true
    };
    
    request.get(url, authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            if ( !body || !body.artists || !body.artists.items ) {
                console.log(body);
                console.log('error', 'invalid response');
                return done( 'invalid response', null );
            }
            if ( body.artists.items.length < 1 || !body.artists.items[0] ) {
                return done( 'no artists found', null );
            }
            if ( !body.artists.items[0].name ) {
                return done( 'artist found, no name', null );
            }
            console.log('follow.js', JSON.stringify(body.artists.items[0]));
            console.log( 'follow.js', body.artists.items[0].name );
            return done( false, body.artists.items[0].name, body.artists.items[0].id );
        }
        else {
            return done( '(' + response.statusCode + ') '
                + error + ' ' + JSON.stringify(body), null );
        }
    });
    
};

var test = function() {
    
    var artists = [
        'A Perfect Circle',
        'Apparat',
        'Beth Orton',
        'Beth Orton Official',
        'Billy Corgan',
        'Björk',
        'Boards of Canada',
        'Bonobo',
        'Brad Mehldau',
        'Cat Power',
        'Charmparticles',
        'Cheap Trick',
        'Chromeo',
        'Coppé',
        'Cut Copy',
        'Daughter Darling',
        'Dead Disco',
        'Delta',
        'DJ Krush',
        'edIT',
        'Element Eighty',
        'Elvis Costello',
        'Flight Facilities',
        'Four Tet',
        'GOTAN PROJECT',
        'Haujobb',
        'Henry Rollins',
        'Hot Chip',
        'Jamie Cullum',
        'Kuroma',
        'Massive Attack',
        'Meiko',
        'Modeselektor',
        'NOFX',
        'PANTyRAiD',
        'Pennywise',
        'Plaid',
        'Puscifer',
        'Radiohead',
        'Sara Bareilles',
        'Sigur Rós',
        'Squarepusher',
        'Stabbing Westward',
        'Tanlines',
        'The Black Ghosts',
        'The Pretty Reckless',
        'The smashing pumpkins',
        'Thievery Corporation',
        'Thom Yorke',
        'Tool',
        'YACHT',
        '劉德華'
    ];

    for ( var i in artists ) {
        (function(oname) {
            getArtist( oname, function( err, name ) {
                console.log( oname, ' --> ', (err ? err : name) );
            });
        })( artists[i] );
    }
    
};

module.exports = getArtist;