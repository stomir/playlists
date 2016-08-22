window.onload = function() {
	with (cr) {
	setContext(document.body);
	var divs = [];

	function showDiv(div) {
		return function() {
			console.log(divs);
			for (var i in divs)
				divs[i].style.display = (i == div) ? 'block' : 'none';
		};
	}

	ul({ class : "menu" }, function() {
		li(function() {
			a('#', 'play').onclick = showDiv(0);
		});
		li(function() {
			a('#', 'view').onclick = showDiv(2);
		});
		li(function() {
			a('#', 'search').onclick = showDiv(1);
		});
	});

	var playDiv = div(function() {
		h1('play div');
	});
	divs.push(playDiv);
	
	divs.push(div(function() {
		//SEARCH
		var qInput;
		form(function() {
			qInput = input('text', 'q', '');
		}).onsubmit = function() {
			ajax("/search?q=" + qInput.value, {}, function(err, data) {
				console.log(data);
			});
			return false;
		};
	}));
	
	divs.push(div(function() {
		//VIEW
	}));

	showDiv(0)();
	}
}
