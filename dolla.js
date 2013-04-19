// custom selector implementation
// nickname: dolla
;(function(undefined) {
    'use strict';

    // useful native methods
    // ----------------------------------------------------
    var slice = Array.prototype.slice;

    // utility functions
    // ----------------------------------------------------
    var nop = function() {};
    var compose = function(a,b){
        return function(){
            var args = slice.call(arguments,0);
            a.apply(this, args);
            b.apply(this, args);
        }.bind(this);
    };
    // returns true if passed in object is a DOM element...
    var isElement = function(o) {
        return (
            typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
                o && typeof o === "object" && o.nodeType === 1 && typeof o.nodeName==="string"
            );
    };
    var isString = function(s){ return typeof s === 'string';},
        isFunction = function(f){ return typeof f === 'function';},
        isArray = Array.isArray, //use native version here
        isDolla = function(d) {return d instanceof dolla;}

    // allows registration of multiple handlers without clobbering existing ones
    var registerEvent = function(el,event,callback){
        el['on' + event] = compose.call(el, el['on' + event] || nop, callback );
    };

    // PRIMARY CONSTRUCTOR
    var dolla = function(selector, context) {

        var self = {}, nodes;

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
    dolla.fn.on = function(event, callback) {
        this.each(function(){
            registerEvent(this, event, callback);
        });
        return this;
    };

    //click event shorthand
    dolla.fn.click = function(callback) {
        return this.on('click',callback);
    };

    //export constructors
    window.dolla = dolla;

    //only export to `$` if it is not currently assigned to.
    window.$ = window.$ || dolla;

})();