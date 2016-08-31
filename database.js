const fs = require("fs");

const dbFile = "database.json";

var db = {users: {}, shared: {}};
        
fs.readFile(dbFile, function(err, data) {
    if (err)
        console.log("error loading database");
    db = JSON.parse(data);
});

function newUser(user) {
    return {
        playlists : {},
        followed : [],
    }
}

function newPlaylist(name) {
    return {
        name : name,
        songs : [],
    }
}

function saveDB() {
    fs.writeFile(dbFile, JSON.stringify(db));
}

exports.getPlaylists = function(user, cb) {
    var ret = [];
    if (user in db.users)
        ret = db.users[user].playlists;
    if ("followed" in db.users[user]) {
        for (var i in db.users[user].followed) {
            var shareCoords = db[user].followed[i];
            if (!(shareCoords.user in db.users) || 
                !(shareCoords.playlist in db.users[shareCoords.user].playlists))
                continue;
            var pl = db.users[shareCoords.user].playlists[shareCoords.playlist];
            var foll = {
                "name" : pl.name,
                "followed" : true,
                "songs" : [],
            };
            for (var j in pl.songs)
                foll.push(pl.songs[j])
        }
    }
    if (ret.length == 0)
        ret = { "favorites" : { name : "favorites", songs : [] } };
    cb(null, ret);
}

exports.getPlaylist = function(user, name, cb) {
    if (user in db.users && name in db.users[user].playlists)
        return cb(null, db[user].playlists[name]);
    return cb(null, newPlaylist(name));
}

exports.savePlaylist = function(user, playlist) {
    var userData;
    if (user in db.users)
        userData = db.users[user];
    else {
        userData = newUser();
        db[user] = userData;
    }
    if (playlist.songs.length == 0)
        delete userData.playlists[playlist.name];
    else
        userData.playlists[playlist.name] = playlist;
    saveDB();
    return true;
}

exports.share = function(user, playlist, shareLink) {
    if (shareLink in db.shared)
        return false;
    db.shared[shareLink] = {user: user, playlist: playlist, time: Date.now()};
    saveDB();
    return true;
}

exports.follow = function(user, shareLink) {
    if (!(user in db.users))
        return false;
    if (!(shareLink in db.shared))
        return false;
    var userData = db.users[user];
    var shareCoords = db.shared[shareLink];
    userData.followed.push(shareCoords);
    saveDB();
}
