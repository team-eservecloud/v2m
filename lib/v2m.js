"use strict"; 
module.exports = function v2m(stateRef, domRef) {
    const blacklistedTags = {"BODY":1, "FRAME":1, "CITE":1,"OPTION":1,"SCRIPT":1,"STYLE":1,"NOSCRIPT":1,"IMG":1,"BR":1};
    
    // This method used to verify TAG(HTML) white listed or not
    var isWhitelistedTags = function isWhitelistedTags(tagName) {
        return (!tagName || !blacklistedTags[tagName]);
    }

    // Returns object path
    function getObject(obj,is, value) {
        if (typeof is == 'string')
            return getObject(obj, is.replace(/(\[(\d+)\])/g, '.$2').split('.'), value);
        else if (is.length == 1 && value !== undefined) 
            return obj[is[0]] = value;
        else if (is.length == 0)
            return obj;
        else
            return getObject(obj[is[0]], is.slice(1), value);
    }

    // This method will listen and fires if there's any change in DOM
    function addDOMListener(stateRef, domRef) {
        window.setTimeout(function(){
            try {
                MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
                var observer = new MutationObserver(function(mutations, observer) {
                    // fired when a mutation occurs
                    window.setTimeout(function(){
                        for (let i = 0, len = mutations.length; i < len; i++) 
                            for(let j = 0, len2 = mutations[i].addedNodes.length; j < len2; j++) 
                                v2m(stateRef, mutations[i].addedNodes[j]);
                    }, 0);
                });
    
                // define what element should be observed by the observer and what types of mutations trigger the callback
                observer.observe(domRef, {
                    childList: true,
                    subtree: true,
                });
            } catch(err) {
                console.error("Exception occurred in ");
            }
        }, 0);
    }

    window.setTimeout(function(){
        try {
            if(domRef && isWhitelistedTags(domRef.tagName) && domRef.nodeType !== 8) {
                addDOMListener(stateRef, domRef); 
                let nodes = domRef.querySelectorAll("[v2m-model]"); 
                for(let i = 0, len = nodes.length; i < len; i++) {
                    nodes[i].value = getObject(stateRef.state, nodes[i].attributes["v2m-model"]["value"]);
                    nodes[i].addEventListener(("text|tel|email|number|url|search|password".includes(nodes[i].type) ? "keyup" : "change"), function(e){
                        if(stateRef) stateRef.setState({[getObject(stateRef.state, e.target.attributes["v2m-model"]["value"], e.target.value)] : e.target.value}); 
                    });
                }
            }
        } catch(err) {
            // Skip this error - Invalid element being passed
        }
    }, 0);
}