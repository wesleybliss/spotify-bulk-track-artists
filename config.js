module.exports = {
	
    client_id     : '243b7af46d304cecb8c4d31b541f3365',
    client_secret : '820546e0214f4c4ba8e65d29456846ca',
    redirect_uri  : 'http://localhost:8888/callback',
    
    stateKey: 'spotify_auth_state',
    
    db: {
        un: 'spotifybulkimport',
        pw: 'sp0t!fybu1k!mp0rt',
        uri: 'mongodb://spotifybulkimport:sp0t!fybu1k!mp0rt@ds057934.mongolab.com:57934/spotify-bulk-import'
    }
    
};