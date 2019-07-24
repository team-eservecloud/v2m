"use strict"; 
module.exports = function v2m() {
    const blacklistedTags = {"BODY":1, "FRAME":1, "CITE":1,"OPTION":1,"SCRIPT":1,"STYLE":1,"NOSCRIPT":1,"IMG":1,"BR":1};
    
    // This method used to verify TAG(HTML) white listed or not
    var isWhitelistedTags = function isWhitelistedTags(tagName) {
        return (!tagName || !blacklistedTags[tagName]);
    }

    // Returns object path
    function getObject(obj,is, value) {
        if (typeof is == 'string')
            return getObject(obj, is.replace(/(\[(\d+)\])/g, '.$2').split('.'), value);
        else if (is.length == 1 && value !== undefined) {
            return obj[is[0]] = value;
        } else if (is.length == 0)
            return obj;
        else
            return getObject(obj[is[0]], is.slice(1), value);
    }

    // Returns component reference by element
    function getComponentByElement(e) {
        let key = Object.keys(e).find(key=>key.startsWith("__reactInternalInstance$"));
        let internalInstance = e[key];
        if (internalInstance == null) return null;
    
        if (internalInstance.return) { // react 16+
            return internalInstance._debugOwner
                ? internalInstance._debugOwner.stateNode
                : internalInstance.return.stateNode;
        } else { // react <16
            return internalInstance._currentElement._owner._instance;
        }
    }

    // This method used to update state v2m-model
    function attachDOMListener(newDomTree) {
        try {
            let nodes = newDomTree.querySelectorAll("[v2m-model]"); 
            for(let i = 0, len = nodes.length; i < len; i++) {
                nodes[i].addEventListener("input", (e) => {
                    if(e.target.attributes["v2m-model"] && e.target.attributes["v2m-model"]["value"]) {
                        let _this = getComponentByElement(e.target); // Getting component reference
                        getObject(_this.state, e.target.attributes["v2m-model"]["value"], e.target.value);
                        _this.setState(_this.state);
                    }
                }); 
            }
        } catch(err) {
            // Failed to update state
        }
    }

    // This method will listen and fires if there's any change in DOM
    this.init = function (node) {
        window.setTimeout(function(){
            try {
                MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
                var observer = new MutationObserver(function(mutations, observer) {
                    // fired when a mutation occurs
                    window.setTimeout(function(){
                        for (let i = 0, len = mutations.length; i < len; i++) 
                            for(let j = 0, len2 = mutations[i].addedNodes.length; j < len2; j++)
                                attachDOMListener(mutations[i].addedNodes[j]);
                    }, 0);
                });
    
                // define what element should be observed by the observer and what types of mutations trigger the callback
                observer.observe(node, {
                    childList: true,
                    subtree: true
                });
            } catch(err) {
                console.error("Unable to initialize initV2m");
            }
        }, 0);
    }
}