var google = require('googleapis');

const API_KEY = "AIzaSyAYgW9g87Meflt8fQ0Iw-fcAmrdcG0xTBY";

var yt = google.youtube('v3');
yt.search.list({"auth" : API_KEY, type : "video", part : "id,snippet", videoEmbeddable : "true", maxResults:32, relatedToVideoId : "CNnhhejBkW8"},
	function(err, data) {
		if (err) {
			console.log("err", err);
			return;
		}
		for (var i in data.items) {
			var item = data.items[i];
			console.log("video", item.id.videoId, item.snippet.title);
		}
	}
);
