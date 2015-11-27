
var Client = function() {
    this.access_token = null;
    this.refresh_token = null;
    this.artists = null;
    this.error = null;
    this.oauthSource = null;
    this.oauthTemplate = null;
    this.followingSource = null;
    this.followingTemplate = null;
};

/**
 * Obtains parameters from the hash of the URL
 * @return Object
 */
Client.prototype.getHashParams = function() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
            q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
         hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
};

Client.prototype.setupTokenRefreshButton = function() {
    document.getElementById('obtain-new-token').addEventListener('click', function() {
        alert('hi ' + this.refresh_token);
        $.ajax({
            url: '/refreshtoken',
            data: {
                'refresh_token': this.refresh_token
            }
        }).done(function(data) {
            
            if ( !this.oauthTemplate ) {
                this.oauthSource      = $('#oauth-template').html(),
                this.oauthTemplate    = Handlebars.compile(this.oauthSource);
            }
            access_token = data.access_token;
            $('#oauth').html( this.oauthTemplate({
                access_token: access_token,
                refresh_token: this.refresh_token
            }));
            
        });
    }, false);
};

Client.prototype.setupListFollowedArtistsButton = function() {
    
    console.log('setupListFollowedArtistsButton');
    
    var renderFollowing = this.renderFollowing;
    
    document.getElementById('list-followed-artists').addEventListener('click', function() {
        $.ajax({
            url: '/following',
            data: {}
        }).done(function(data) {
            
            console.log('data', data);
            
            if ( !this.followingTemplate ) {
                this.followingSource   = $('#following-template').html(),
                this.followingTemplate = Handlebars.compile(this.followingSource);
            }
            
            this.artists = data.artists;
            
            console.log('this.artists set to', this.artists);
            
            $('#following').html( this.followingTemplate({
                artists: this.artists
            }));
            
            renderFollowing(this.artists);
            
            /*for ( var i in this.artists.items ) {
                console.log( this.artists.items[i] );
            }*/
            
            
        });
    }, false);
};

Client.prototype.renderInitialScreen = function() {
    $('#login').show();
    $('#loggedin').hide();
    $('#following').hide();
};

Client.prototype.renderOAuthInfo = function() {
    
    var userProfileSource      = $('#user-profile-template').html(),
        userProfileTemplate    = Handlebars.compile(userProfileSource),
        userProfilePlaceholder = $('#user-profile');
    
    this.oauthSource      = $('#oauth-template').html(),
    this.oauthTemplate    = Handlebars.compile(this.oauthSource);
    
    $('#oauth').html( this.oauthTemplate({
        access_token:  this.access_token,
        refresh_token: this.refresh_token
    }));
    
    $.ajax({
        url: 'https://api.spotify.com/v1/me',
        headers: {
            'Authorization': 'Bearer ' + this.access_token
        },
        success: function(response) {
            userProfilePlaceholder.html( userProfileTemplate(response) );
            $('#login').hide();
            $('#loggedin').show();
        }
    });
    
};

Client.prototype.renderFollowing = function( artists ) {
    
    this.followingSource      = $('#following-template').html(),
    this.followingTemplate    = Handlebars.compile(this.followingSource);
    
    console.log('showing #following');
    console.log($('#following'));
    console.log('artists', artists);
    
    $('#following').html( this.followingTemplate({
        artists:  artists
    }));
    
    $('#login').hide();
    $('#loggedin').hide();
    $('#following').show();
    
};

Client.prototype.run = function() {
    
    var params = this.getHashParams();
    this.access_token  = params.access_token,
    this.refresh_token = params.refresh_token,
    this.artists       = params.artists,
    this.error         = params.error;
    
    if ( this.error ) {
        
        // @todo Better error handling
        alert('There was an error during the authentication');
        
    }
    else {
        
        this.setupTokenRefreshButton();
        this.setupListFollowedArtistsButton();
        
        if ( this.access_token ) {
            console.log('renderOAuthInfo');
            this.renderOAuthInfo();
        }
        else if ( this.artists ) {
            console.log('renderFollowing');
            this.renderFollowing();
        }
        else {
            console.log('renderInitialScreen');
            this.renderInitialScreen();
        }
        
        /*this.access_token
            && this.renderOAuthInfo()
            || this.renderInitialScreen();*/
        
    }
    
};