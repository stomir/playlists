var playButton, pauseButton;
var songNameLi, playModeNameLi, playlistNameLi;

window.onload = function() {
	getCookie();
	with (cr) {
	setContext(document.body);
	var divs = [];

	function showDiv(div) {
		return function() {
			for (var i in divs)
				divs[i].style.display = (i == div) ? 'block' : 'none';
		};
	}

	ul({ class : "menu" }, function() {
		pauseButton = li(function() { a('#', 'pause').onclick = pauseButtonFunction; });
		playButton = li(function() { a('#', 'play').onclick = playButtonFunction; });
		li(function() { a('#', 'next').onclick = nextSong; });
		li(function() { a('#', 'view').onclick = showDiv(2); });
		li(function() { a('#', 'history').onclick = showDiv(3); });
		li(function() { a('#', 'search').onclick = showDiv(1); });
		songNameLi = li({class: "songName"});
		playlistNameLi = li({class:"playlistName"});
		playModeNameLi = li({class:"playModeName"});
		
		pauseButton.style.display = "none";

		li({"style" : "float:right"}, function() {
			var userA = a('#', 'user');
			var userInput;
			userA.onclick = function () {
				userA.style.display = "none";
				userForm.style.display = "list-item";
				userInput.value = getCookie();
			}
			var userForm = form(function() {
				userInput = input();
			});
			userForm.style.display = "none";
			userForm.onsubmit = function() {
				userA.style.display = "list-item";
				userForm.style.display = "none";
				saveCookie(userInput.value);
				refreshView();
				return false;
			}
		});
	});

	divs.push(div({class : "main"}, playBody));
	divs.push(div({class : "main"}, searchBody));
	divs.push(div({class : "main"}, viewBody));
	divs.push(div({class : "main"}, historyBody));
	showDiv(2)();

	}
}

function songLi(song, playlist) {
	cr.li(song.title, function() {
		cr.text(" | ");
		cr.a("#", "play now").onclick = function() {
			playNow(song);
		}
		cr.text(" | ");
		cr.a("#", "repeat").onclick = function() {
			playNow(song);
			setPlayMode(playmode.repeatSingle);
		}
		if (currentPlaylist) {
			cr.text(" | ");
			cr.a("#", "add to " + currentPlaylist.name).onclick = function() {
				currentPlaylist.songs.push(song);
				ajax.post("playlist", currentPlaylist, function(){});
				selectPlaylist(currentPlaylist);
			}
		}
		cr.text(" | ");
		var addToDropdown;
		cr.a("#", "add to...", {class:"dropdown"}, function() {
			addToDropdown = cr.div({class:"dropdown"}, function() {
				cr.ul(function() {
					var pl = getPlaylists();
					for (var name in pl) {
						(function(playlist) {
							cr.li(playlist.name).onclick = function() {
								playlist.songs.push(song);
								ajax.post("/playlist", playlist, refreshView);
							};
						})(pl[name]);
					}
					cr.li(function() {
						var input;
						cr.form(function() {
							input = cr.input({class:"dropped"});
						}).onsubmit = function() {
							ajax.get("/playlist?pl=" + input.value, function(err, data) {
								data.songs.push(song);
								ajax.post("/playlist", data, refreshView);
							});
							return false;
						}
					});
				})
			});
		}).onclick = function() {
			addToDropdown.classList.add("show");
		};
		cr.text(" | ");
		cr.a("#", "follow suggestions").onclick = function() {
			playNow(song);
			setPlayMode(playmode.followSuggestions);
		};
		if (playlist) {
			cr.text(" | ");
			cr.a("#", "remove").onclick = function() {
				for (var i in playlist.songs) {
					if (playlist.songs[i] == song) {
						playlist.songs.splice(i, 1);
						ajax.post("/playlist", playlist, refreshView);
						addToDropdown.class.remove("show");
						break;
					}
				}
			}
		}
	});
}

window.onclick = function(event) {
	if (!event.target.matches('a.dropdown') && !event.target.matches("input.dropped")) {
		var dropdowns = document.getElementsByClassName("dropdown");
		var i;
		for (i = 0; i < dropdowns.length; i++) {
			var openDropdown = dropdowns[i];
			if (openDropdown.classList.contains('show')) {
				openDropdown.classList.remove('show');
			}
		}
	}
}
