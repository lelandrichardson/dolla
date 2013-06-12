// custom selector implementation
// nickname: dolla
;(function(undefined) {
    'use strict';

    // useful native methods
    // ----------------------------------------------------
    var slice = Array.prototype.slice;
    // returns true if passed in object is a DOM element...
    var isElement = function(o) {
        return (
            typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
                o && typeof o === "object" && o.nodeType === 1 && typeof o.nodeName==="string"
            );
        },
        isString = function(s){ return typeof s === 'string';},
        isFunction = function(f){ return typeof f === 'function';},
        isArray = Array.isArray, //use native version here
        isDolla = function(d) {return d instanceof dolla;},

        //takes two dolla instances, and copies over the elements from one into the other
        joinDolla = function(a,b){
            var startingLength = a.length,
                addingLength = b.length;
            // add the results to the items object
            for (var i = 0; i < addingLength; i++) {
                a[startingLength + i] = b[i];
            }

            a.length = startingLength + addingLength;
            return a;
        };



    // EVENT HANDLING
    var isModel2 = document.addEventListener !== undefined,
        isIELegacy = !isModel2 && document.attachEvent !== undefined;

    function registerEvent(el,event,handler){
        if(isModel2){
            // DOM Level 2 API
            el.addEventListener(event,handler,false);
            return event;
        } else if (isIELegacy) {
            // IE Legacy Model
            var bound = function(){
                return handler.apply(el,arguments);
            };
            el.attachEvent('on' + event, bound);
            return bound;
        }
    }

    function detachEvent(el,event,handler){
        if(isModel2){
            // DOM Level 2 API
            el.removeEventListener(event,handler,false);
            return event;
        } else if (isIELegacy) {
            // IE Legacy Model
            el.detachEvent('on' + event, handler);
        }
    }






    // PRIMARY CONSTRUCTOR
    var dolla = function(selector, context) {
        if(!isDolla(this)){
            //makes sure dolla is called with new operator...
            return new dolla(selector,context);
        }
        var self = this, nodes;
        if(selector === undefined){

            // have empty constructor return empty dolla
            self.length = 0;
            return this;
        }

        if (isString(context)) {
            context = document.querySelector(context);
        }

        nodes = slice.call((context || document).querySelectorAll(selector));

        // add the results to the items object
        for (var i = 0; i < nodes.length; i++) {
            self[i] = nodes[i];
        }

        self.length = nodes.length;

    };

    //empty dolla for utility
    dolla.empty = function(){return dolla()};

    dolla.fn = dolla.prototype;

    dolla.fn.slice = slice;

    // Prototype Methods
    // -----------------------------------------
    dolla.fn.each = function (callback) {
        for ( var i = 0; i < this.length; i++ ) {
            callback.call( this[i], i, this[i] );
        }
        return this;
    };

    // Get the descendants of each element in the current set of matched elements, filtered by a selector
    //TODO: add API for .dolla(dolla object) and .dolla(element)
    dolla.fn.find = function(selector){
        var i,
            ret = dolla.empty(),
            len = this.length;
        if(len === 0){return ret;}
        for ( i = 0; i < len; i++ ) {
            joinDolla(ret,dolla( selector, this[ i ]));
        }
        return ret;
    };

    // get parent node of first element, wrapped in dolla object
    dolla.fn.parent = function() {
        if(this.length === 0){
            return dolla.empty();
        }
        var parent = this[0].parentNode;
        return parent && parent.nodeType !== 11 ? dolla(parent) : dolla.empty();
    };



    // html function
    // GETTER: `.html()` -> returns string representation of the node's inner HTML
    // SETTER:
    //      `.html(String)` -> set's .innerHTML to String
    //      `.html(function(index,currentHtml))` -> pass in an iterator function which returns the text you want to use
    //                                              for the html of the given node.  inside the callback, `this` will
    //                                              will be bound to the element.
    dolla.fn.html = function (stringOrCallback) {
        // if no parameter passed in, simply return innerHTML of first node.
        if(stringOrCallback === undefined){
            return this.length > 0 ? this[0].innerHTML : null;
        }
        // otherwise, we are *setting* the html
        var response;
        if(isString(stringOrCallback)){
            // setting as a simple sting
            this.each(function(){
                this.innerHTML = stringOrCallback;
            });
        } else {
            // using callback function
            this.each(function(i,el){
                // user must return explicit `false` in order to skip updating value
                if ((response = stringOrCallback.call(this, i, this.innerHTML)) !== false) {
                    this.innerHTML = response;
                }
            });

        }
        return this;
    };

    //register event handlers
    dolla.fn.on = function(event, handler) {
        return this.each(function(){
            registerEvent(this, event, handler);
        });
    };

    dolla.fn.off = function(event, handler) {
        return this.each(function(){
            detachEvent(this, event, handler);
        });
    };

    //click event shorthand
    dolla.fn.click = function(callback) {
        return this.on('click',callback);
    };















    // GETTER: `.css("{styleProperty}")
    dolla.fn.css = function(name, value){
        if(this.length === 0){return null;}

        return getStyle(this[0],name,value);
    };

    var getStyle = function(elem,name,value){
        // Don't set styles on text and comment nodes
        if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
            return;
        }

        if(value !== undefined){
            // setting value
            return;
        } else {
            // getting value
            return elem.style[name];
        }
    };

    //export constructors
    window.dolla = dolla;

    //only export to `$` if it is not currently assigned to.
    window.$ = window.$ || dolla;

})();