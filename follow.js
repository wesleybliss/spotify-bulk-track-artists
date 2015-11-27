
var request = require('request');

var getArtist = function( name, done /*=>(err, name)*/ ) {
    
    var url = 'https://api.spotify.com/v1/search';
    
    url += '?type=artist&q=';
    url += encodeURIComponent(name);
    
    var token = 'BQBeWbqG7O2YsYuy_rrLZ9_D3hCZQYL73l_56RUG_XboNOQ-GDPyONxb-Em4L43x3I7ZkD-E9CAVKQbziIeO-XKtFZKIYhgWuWA-os57KImXBfMYmy5nOj6DgZO9Wks2E9IXDgf7tk5tOGtkY19SkvhTkBlcjVGAK2ROA6iqxH1Q';
    
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
            return done( false, body.artists.items[0].name );
        }
        else {
            return done( '(' + response.statusCode + ') ' + error, null );
        }
    });
    
};

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