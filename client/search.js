
function searchBody() {
    var qInput;
    var result;
    var moreResults;
    var nextPage;
    
    function moreResults (){
        if (searchDiv.scrollTop * 1.1 >= searchDiv.scrollTopMax)
            ajax.get("/search?q=" + qInput.value + "&pageToken=" + nextPage, handleResults);
    };

    function handleResults(err, data) {
        result.inside(function(){
            for (var i in data.songs) {
                songLi(data.songs[i]);
            }
        });
        nextPage = data.nextPage;
        moreResults();
    }

    cr.form(function() {
        qInput = cr.input('text', 'q', '');
        cr.input('submit', 'search', 'search');
    }).onsubmit = function() {
        result.clear();
        ajax.get("/search?q=" + qInput.value, handleResults);
        return false;
    };		
    result = cr.ul({class : "searchResults"});
    var searchDiv = this;
    
    searchDiv.onscroll = moreResults;
}
