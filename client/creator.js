var cr = (function() {
    var context = null;

    function text(string) {
        context.appendChild(document.createTextNode(string));
    }
    
    function generator(elementName, attrs) {
        if (typeof attrs == 'undefined')
            attrs = [];
        return function() {
            var parent = context;
            var el = document.createElement(elementName);
            context.appendChild(el);
            
            //onload handling
            var unloaded = 0;
            el.addUnloaded = function() { unloaded++; };
            el.loadedOne = function() {
                unloaded--;
                if (unloaded == 0) {
                    if (typeof (parent.loadedOne) == 'function')
                        parent.loadedOne();
                    if (typeof (el.loadEvent) == 'function')
                        el.loadEvent();            
                }
            };
            if (parent != null && elementName == 'script') {
                parent.addUnloaded();
                el.onload = parent.loadedOne;
            }
            
            var skipped = 0;
            for (var i in arguments) {
                if (typeof(arguments[i]) == 'function') {
                    var oldcontext = context;
                    context = el;
                    arguments[i]();
                    context = oldcontext;
                    skipped++;
                } else if (typeof (arguments[i]) == 'object') {
                    var dict = arguments[i];
                    for (var j in dict) {
                        el.setAttribute(j, dict[j]);
                    }
                    skipped++;
                } else if ((i - skipped) in attrs) {
                    el.setAttribute(attrs[i - skipped], arguments[i]);
                } else {
                    el.appendChild(document.createTextNode(arguments[i]));
                }
            }

            el.attr = el.setAttribute;
            el.txt = function(string) {
                el.appendChild(document.createTextNode(string));
            };
            
            return el;
        }
    }
    
    return {
        setContext : function(cntx) { context = cntx; },
        
        text : text,
        a : generator('a', ['href']),
        img : generator('img', ['src', 'alt']),
        b : generator('b'),
        i : generator('i'),
        u : generator('u'),
        button : generator('button', ['name', 'value']),
        div : generator('div'),
        footer : generator('footer'),
        form : generator('form', ['method', 'action']),
        h1 : generator('h1'),
        h2 : generator('h2'),
        h3 : generator('h3'),
        h4 : generator('h4'),
        h5 : generator('h5'),
        h6 : generator('h6'),
        input : generator('input', ['type', 'name', 'value']),
        label : generator('label'),
        li : generator('li'),
        ol : generator('ol'),
        ul : generator('ul'),
        nav : generator('nav'),
        option : generator('option', ['value']),
        p : generator('p'),
        script : generator('script', ['src']),
        section : generator('section'),
        select : generator('select', ['name', 'value']),
        span : generator('span'),
        
    }

})();
