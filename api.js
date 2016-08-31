var google = require('googleapis');

const API_KEY = "AIzaSyAYgW9g87Meflt8fQ0Iw-fcAmrdcG0xTBY";

var yt = google.youtube('v3');

module.exports.search = function(q, pageToken, callback) {
    var query = {"auth" : API_KEY, type : "video", part : "id,snippet", q:q, videoEmbeddable : "true", maxResults:32};
    if (pageToken)
        query.pageToken = pageToken;
	yt.search.list(query, function(err, data) {
        if (err) {
            callback(err, null);
            return;
        }
        var ret = [];
        for (var i in data.items) {
            var item = data.items[i];
            ret.push({ videoId : item.id.videoId, title : item.snippet.title});
        }
        callback(null, {songs: ret, nextPage : data.nextPageToken});
    });
}

module.exports.suggest = function(song, cb) {
	yt.search.list({"auth" : API_KEY, type : "video", part : "id,snippet", relatedToVideoId : song.videoId, videoEmbeddable : "true", maxResults:1},
		function(err, data) {
			if (err) return cb(err, null);
			var ret = {
				videoId : data.items[0].id.videoId,
				title : data.items[0].snippet.title,
			}
			cb(null, ret);
		});
}
