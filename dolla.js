// custom selector implementation
// nickname: dolla
;(function() {
    'use strict';

    // utility methods
    // ----------------------------------------------------
    var nop = function() {};
    var compose = function(a,b){
        return function(){
            a.call(this);
            b.call(this);
        }.bind(this);
    };

    // allows registration of multiple handlers without clobbering existing ones
    var registerEvent = function(el,event,callback){
        el['on' + event] = compose.call(el, el['on' + event] || nop, callback );
    };

    // dolla --------------------------------------------------
    var dolla = function(selector, context) {

        var dolla = {}, nodes;

        if (typeof context === 'string') {
            context = document.querySelector(context);
        }

        nodes = Array.prototype.slice.call((context || document).querySelectorAll(selector));

        // add the results to the items object
        for (var i = 0; i < length; i++) {
            dolla[i] = nodes[i];
        }

        dolla.length = nodes.length;
        dolla.slice = [].slice();
    };

    dolla.fn = dolla.prototype;

    // Prototype Methods
    // -----------------------------------------
    dolla.fn.each = function (callback) {
        for ( var i = 0; i < this.length; i++ ) {
            callback.call( this[i], i, this[i] );
        }
        return this;
    };

    dolla.fn.html = function (callback) {
        var response;
        for (var i = 0; i < this.length; i++) {
            if (response = callback.call(this[i], i, this[i].innerHTML)) {
                this[i].innerHTML = response;
            }
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