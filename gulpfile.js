
var gulp         = require('gulp'),
    gutil        = require('gulp-util'),
    supervisor   = require('gulp-supervisor'),
    stylus       = require('gulp-stylus'),
    autoprefixer = require('gulp-autoprefixer'),
    minifyCSS    = require('gulp-minify-css'),
    uglify       = require('gulp-uglify'),
    rename       = require('gulp-rename'),
    concat       = require('gulp-concat'),
    nib          = require('nib'),
    sourcemaps   = require('gulp-sourcemaps')
;

var production = ( gutil.env.type === 'production' );
var externalSourcemaps = true;

var getFileName = function( name, ext ) {
    return production
        ? ( name + '.min.' + ext )
        : ( name + '.' + ext );
};


gulp.task( 'css', function() {
    gulp.src( 'public/stylesheets/style.styl')
        .pipe( stylus({
            use: [ nib() ],
            compress: false,
            paths: ['public/stylesheets']
        }))
        .pipe( autoprefixer() )
        .pipe( sourcemaps.init() )
        .pipe( production ? minifyCSS() : gutil.noop() )
        .pipe( externalSourcemaps ? sourcemaps.write('.') : sourcemaps.write() )
        .pipe( rename( getFileName('style', 'css') ) )
        .pipe( gulp.dest('public/stylesheets') )
});

/**
 * Runs app via Supervisor to automatically reload after crashes.
 */
gulp.task( 'supervisor', [], function() {
    supervisor( './bin/www', {
        args:         [],
        pollInterval: 500,
        exec:         'node',
        debug:        false,
        noRestartOn:  'exit',
        quiet:        false
    });
});

/**
 * Runs the main application (in debug mode).
 */
gulp.task( 'default', ['css', 'supervisor'], function() {
    console.log( 'info', 'Gulp task \'default\' running app under Supervisor as dev.' );
});
