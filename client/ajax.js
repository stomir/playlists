function ajaxRequest(method, url, jsonInput, callback) {
	var conn = new XMLHttpRequest();
	conn.onreadystatechange = function() {
		if (conn.readyState == 4) {
			console.log("ajax done");
			var jsonOutput;
			var caught = false;
			try {
				jsonOutput = JSON.parse(conn.responseText);
			} catch (x) {
				caught = true;
				callback(x, null);
			}
			if (!caught)
				callback(null, jsonOutput);
		}
	}
	conn.open(method, url, true);
	conn.setRequestHeader("Content-type", "application/json");
	conn.send(JSON.stringify(jsonInput));
}


var ajax = {
	get : function(a,b,c) {
		if (c)
			ajaxRequest("GET", a, b, c);
		else
			ajaxRequest("GET", a, {}, b); 
	},
	post : function(a,b,c) { ajaxRequest("POST", a, b, c) },
};