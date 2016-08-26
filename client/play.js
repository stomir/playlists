var ytPlayer;
var historyUl;

var currentSong = null;
var currentPlayMode = null;
var currentPlayModeName = "";
var currentPlayState = null;
var currentPlaylist = null;

function playBody() {
        var div = cr.div({class : "play"});
        ytPlayer = new YT.Player(div, {
            events : {
                onReady : function() {
                },
                onStateChange : function(event) {
                    if (event.data == YT.PlayerState.ENDED) {
                        currentPlayState = currentPlayMode(currentSong, currentPlayState, currentPlaylist);
                    }
                },
            }
        });
}

function historyBody() {
    historyUl = cr.ul({class : "history"});
}

function playNow(song, playlist, number) {
    currentSong = song;
    historyUl.inside(function(){
        songLi(song, playlist);
    });
    ytPlayer.loadVideoById(song.videoId);
    playButtonFunction();
    songNameLi.innerHTML = song.title;
    playModeNameLi.innerHTML = currentPlayModeName;
}

function nextSong() {
    currentPlayState = currentPlayMode(currentSong, currentPlayState, currentPlaylist); 
}

function setPlayMode(playmode) {
    currentPlayMode = playmode;
    currentPlayState = null;
    nextSong();
}

function setCurrentPlaylist(playlist) {
    currentPlaylist = playlist;
    playlistNameLi.innerHTML = playlist.name;
}

var playmode = {
	idle : function(lastSong, innerInfo, playlist) {
        currentPlayModeName = "idle";
		return null;
	},
	repeatSingle : function(lastSong, innerInfo, playlist) {
		playNow(lastSong);
        currentPlayModeName = "repeat single track";
        return null;
	},
    loop : function(lastSong, number, playlist) {
        currentPlayModeName = "loop playlist";
        if (!number)
            number = 0;
        if (!(number in playlist.songs))
            number = 0;
        playNow(playlist.songs[number], playlist);
        number++;
        return number;
    },
    randomSong : function(lastSong, nothing, playlist) {
        currentPlayModeName = "random from playlist";
        var nextSong = lastSong;
        if (playlist.songs.length <= 1)
            return playNow(playlist.songs[0]);
        while (nextSong == lastSong) {
            var idx = Math.floor(Math.random() * playlist.songs.length);
            nextSong = playlist.songs[idx];
        }
        playNow(nextSong, playlist);
        return null;
    },
    followSuggestions : function(lastSong, started, playlist) {
        currentPlayModeName = "follow suggestions";
        if (!started) {
            return true;
        }
        ajax.post("/suggest", lastSong, function(err, data) {
            playNow(data);
        });
        return true;
    },
    randomOrSuggest : function(lastSong, nothing, playlist) {
        currentPlayModeName = "random or suggestion"
        if (Math.random() < 0.4)
            playmode.followSuggestions(lastSong, true, playlist);
        else
            playmode.randomSong(lastSong, null, playlist);
        return null;
    },
};

function playButtonFunction() {
    playButton.style.display = "none";
    pauseButton.style.display = "list-item";
    if (currentSong)
        document.title = "\u25B6 " + currentSong.tetle + " - playlists";
    ytPlayer.playVideo();
}
function pauseButtonFunction() {
    pauseButton.style.display = "none";
    playButton.style.display = "list-item";
    document.title = "\u23f8 " + currentSong.title + " - playlists";
    ytPlayer.pauseVideo();
}

currentPlayMode = playmode.idle;
