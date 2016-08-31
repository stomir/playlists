function saveCookie (cookie) {
	var d = new Date();
	d.setTime(d.getTime() + (365*24*60*60*1000));
	document.cookie = 'data='+cookie+'; expires='+d.toUTCString();
}

function getCookie() {
	var name = "data=";
	var ca = document.cookie.split(';');
	for(var i=0; i<ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1);
		if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
	}
	var ck = generateCookie(16);
    saveCookie(ck);
    return ck;
}

function randomString(n) {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	var randomstring = '';
	for (var i=0; i<n; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars[rnum];
	}
    return randomstring;
}
