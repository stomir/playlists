var http = require('http');
var fs = require('fs');
var api = require("./api.js");
var url = require("url");

const PORT=8080; 

function respondFile(fileName, res) {
	fs.readFile(fileName, function(err, data) {
		res.writeHead(200);
		res.end(data);
	});
}

function respondScripts(res) {
	fs.readdir("client", function(err, files) {
		var tosend = files.length;
		for (var i in files) {
			if (files[i][0] == '.') {
				tosend--;
				continue;
			}
			fs.readFile("client/" + files[i], function(err, data) {
				res.write(data);
				tosend--;
				if (tosend == 0)
					res.end();
			});
		}
	});
}

function handleSearch(req, res) {
	var query = url.parse(req.url, true).query;
	res.writeHead(200, {"Content-Type" : "application/json"});
	if (!query || !("q" in query)) {
		res.end("error");
		return;
	}
	var q = query.q;
	console.log("q", q);
	api.search(q, function(err, data) {
		if (err) {
			console.log("search error", err);
		}
		res.end(JSON.stringify(data));
	});
}

var server = http.createServer(function(req, res) {
	console.log("url", req.url);
	if (req.url == "/")
		respondFile("index.html", res);
	else if (req.url == "/script.js")
		respondScripts(res);
	else if (req.url == "/style.css")
		respondFile("style.css", res);
	else if (req.url.match(/^\/search/))
		handleSearch(req, res);
	else
		res.end();
});

server.listen(PORT, function(){
	console.log("Server listening on: http://localhost:%s", PORT);
});
