"use strict"; 
module.exports = function v2m() {
    // Returns object path
    function getObject(obj,is, value) {
        if (typeof is == 'string')
            return getObject(obj, is.replace(/(\[(\d+)\])/g, '.$2').split('.'), value);
        else if (is.length == 1 && value !== undefined) {
            obj[is[0]] = value;
            return obj[is[0]];
        } else if (is.length == 0)
            return obj;
        else
            return getObject(obj[is[0]], is.slice(1), value);
    }

    // Returns component reference by element
    function getComponentByNode(e) {
        try {
            let key = Object.keys(e).find(key => key.startsWith("__reactInternalInstance$"));
            let internalInstance = e[key];
            return  (internalInstance && internalInstance.return && internalInstance.return.pendingProps && internalInstance.return.pendingProps.children && internalInstance.return.pendingProps.children.length > 0) ? internalInstance.return.pendingProps.children[0]._owner.stateNode : internalInstance.return.pendingProps.children._owner.stateNode;
        } catch(err) {
            return null;
        }
    }
    
    // This method used to Update data from view to model
    function viewToModel(node) {
        try {
            setTimeout(function(){
                 node.addEventListener("input", (e) => {
                    if(e.target.attributes["v2m-model"] && e.target.attributes["v2m-model"]["value"]) {
                        let _this = getComponentByNode(e.target); // Getting component reference
                        if(_this) {
                            getObject(_this.state, e.target.attributes["v2m-model"]["value"], e.target.value);
                            _this.setState(_this.state);
                        }
                    }
                }); 
            }, 0);
        } catch(err) {
            console.error("Unable to update view to model -- " + err);
        }
    }
    
    // This method used to Update data from model to view
    function modelToView(node) {
        try {
            setTimeout(function(){
                let _this = getComponentByNode(node); // Getting component reference
                if(_this) node.value = getObject(_this.state, node.attributes["v2m-model"]["value"]);
            }, 0);
        } catch(err) {
            console.error("Unable to update model to view -- " + err);
        }
    }

    // This method used to initialize v2m on elements
    function initV2M(newDomTree) {
        try {
            let nodes = newDomTree.querySelectorAll("[v2m-model]"); 
            for(let i = 0, len = nodes.length; i < len; i++) {
                modelToView(nodes[i]);
                viewToModel(nodes[i]);
            }
        } catch(err) {
            // Failed to update state
        }
    }

    // This method will listen and fires if there's any change in DOM
    this.init = function (node) {
        setTimeout(function(){
            try {
                MutationObserver = MutationObserver || WebKitMutationObserver;
                let observer = new MutationObserver(function(mutations, observer) {
                    // fired when a mutation occurs
                    setTimeout(function(){
                        for (let i = 0, len = mutations.length; i < len; i++) 
                            for(let j = 0, len2 = mutations[i].addedNodes.length; j < len2; j++)
                                initV2M(mutations[i].addedNodes[j]);
                    }, 0);
                });
    
                // define what element should be observed by the observer and what types of mutations trigger the callback
                observer.observe(node, {
                    childList: true,
                    subtree: true
                });
            } catch(err) {
                console.error("Unable to initialize v2m library -- " + err);
            }
        }, 0);
    };
}