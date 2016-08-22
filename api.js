var google = require('googleapis');

const API_KEY = "AIzaSyAYgW9g87Meflt8fQ0Iw-fcAmrdcG0xTBY";

var yt = google.youtube('v3');

module.exports.search = function(q, callback) {
	yt.search.list({"auth" : API_KEY, type : "video", part : "id,snippet", q:q, videoEmbeddable : "true", maxResults:32},
		function(err, data) {
			if (err) {
				callback(err, null);
				return;
			}
			var ret = [];
			for (var i in data.items) {
				var item = data.items[i];
				ret.push({ videoId : item.id.videoId, title : item.snippet.title});
			}
			callback(null, ret);
		}
	)
}
