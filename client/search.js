
function searchBody() {
    var qInput;
    var result;
    cr.form(function() {
        qInput = cr.input('text', 'q', '');
        cr.input('submit', 'search', 'search');
    }).onsubmit = function() {
        ajax.get("/search?q=" + qInput.value, function(err, data) {
            result.clear();
            result.inside(function(){
                for (var i in data) {
                    songLi(data[i]);
                }
            });
        });
        return false;
    };		
    result = cr.ul({class : "searchResults"});
}