var refreshView;
var getPlaylists;
var selectPlaylist;

function viewBody() {
    var playlistsUl = cr.ul({class : "playlists"});
    var songsUl = cr.ul({class : "songs"});

    var viewedPlaylist = null;

    var playlists = {};

    selectPlaylist = function (playlist) {
        viewedPlaylist = playlist;
        songsUl.clear();
        songsUl.inside(function() {
            for (var i in playlist.songs)
                songLi(playlist.songs[i], playlist);
        });
    }

    function refreshPlaylists() {
        ajax.get("playlists", function(err, data) {
            playlistsUl.clear();
            playlistsUl.inside(function(){
                if (err) return;
                playlists = data;
                var viewedPlaylistName = (viewedPlaylist ? viewedPlaylist.name : "");
                viewedPlaylist = null;
                for (var name in data) {
                    (function(playlist) {
                        cr.li(function() {
                            console.log(viewedPlaylist);
                            if (viewedPlaylist == null || name == viewedPlaylistName) 
                                selectPlaylist(playlist);
                            cr.a("#", name).onclick = function() {
                                selectPlaylist(playlist);
                            };
                            cr.text(" | ");
                            cr.a("#", "loop").onclick = function() {
                                setCurrentPlaylist(playlist);
                                selectPlaylist(playlist);
                                playNow(playlist.songs[0]);
                                setPlayMode(playmode.loop);
                            }
                            cr.text(" | ");
                            cr.a("#", "random").onclick = function() {
                                setCurrentPlaylist(playlist);
                                selectPlaylist(playlist);
                                playNow(playlist.songs[0])
                                setPlayMode(playmode.randomSong);
                            }
                        })
                    })(data[name]);
                }
            });
        });
    }

    refreshView = function () {
        refreshPlaylists();
    }
    getPlaylists = function() {
        return playlists;
    }

    refreshPlaylists();
}