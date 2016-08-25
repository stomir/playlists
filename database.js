const fs = require("fs");

const dbFile = "database.json";

var db = {};
        
fs.readFile(dbFile, function(err, data) {
    if (err)
        console.log("error loading database");
    db = JSON.parse(data);
});

function newUser(user) {
    return {
        playlists : {},
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
    if (user in db)
        ret = db[user].playlists;
    if (ret.length == 0)
        ret = { "favorites" : { name : "favorites", songs : [] } };
    cb(null, ret);
}

exports.getPlaylist = function(user, name, cb) {
    if (user in db && name in db[user].playlists)
        return cb(null, db[user].playlists[name]);
    return cb(null, newPlaylist(name));
}

exports.savePlaylist = function(user, playlist) {
    var userData;
    if (user in db)
        userData = db[user];
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
