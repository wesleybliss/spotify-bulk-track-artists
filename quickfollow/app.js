
var
    express    = require('express'),
    bodyParser = require('body-parser'),
    ejs        = require('ejs'),
    app        = express()
;

app.use( bodyParser.urlencoded() );
app.set( 'views', './views' );
app.engine( 'ejs', ejs.renderFile );
app.set( 'view engine', 'ejs' );

var routes = {};
routes.index  = require('./routes/index');
routes.search = require('./routes/search');

app.get(  '/',       routes.index );
app.post( '/search', routes.search );


module.exports = app;