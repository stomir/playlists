var http = require('http');
var fs = require('fs');
var api = require("./api.js");
var url = require("url");
const express = require("express");
const db = require("./database.js");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const PORT=8080; 

const app = express();
app.use(cookieParser());
app.use(bodyParser.json());

function respondFile(fileName, res) {
	fs.readFile(fileName, function(err, data) {
		if (err) {
			writehead(500);
			res.end();
			return;
		}
		res.end(data);
	});
}

app.get("/style.css", function(req, res) {
	res.writeHead(200, {"Content-type" : "text/css"});
	respondFile("style.css", res);
});
app.get("/script.js", function(req,res) {
	res.writeHead(200, {"Content-type": "text/javascript"});
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
});

app.get("/", function(req, res) {
	respondFile("index.html", res);
});

function respondJSON(res) {
	return function(err, data) {
		if (err) {
			res.json(err);
		}
		res.json(data);
	}
}

app.get("/search", function(req, res) {
	if (!("q" in req.query)) {
		res.end(JSON.stringify({"error" : "no query string"}));
		return;
	}
	api.search(req.query.q, respondJSON(res));
});

app.get("/playlists", function(req, res) {
	db.getPlaylists(req.cookies.data, respondJSON(res));
});
app.get("/playlist", function(req, res) {
	db.getPlaylist(req.cookies.data, req.query.pl, respondJSON(res));
});
app.post("/playlist", function(req, res) {
	console.log("saving playlist");
	db.savePlaylist(req.cookies.data, req.body);	
	res.json({"saved" : true});
});
app.post("/suggest", function(req, res) {
	api.suggest(req.body, respondJSON(res));
});

app.listen(PORT, function(){
	console.log("Server listening on: http://localhost:%s", PORT);
});
