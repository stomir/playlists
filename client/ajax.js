function ajax(url, jsonInput, callback) {
	var conn = new XMLHttpRequest();
	conn.onreadystatechange = function() {
		if (conn.readyState == 4) {
			var jsonOutput;
			try {
				jsonOutput = JSON.parse(conn.responseText);
			} catch (x) {
				callback(x, null);
			}
			if (jsonOutput)
				callback(null, jsonOutput);
		}
	}
	conn.open("GET", url, true);
	conn.send();
}
