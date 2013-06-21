// simple xhr implementation for dolla
// nickname: jax
;(function (undefined) {

    /**
    * function letsMakeXhr ()
    *
    * Should get you a XHR object from IE to Chrome.
    */
    function letsMakeXhr () {
        try {
            return new ActiveXObject('Msxml2.XMLHTTP');
        } catch(e) {
            try {
                return new ActiveXObject('Microsoft.XMLHTTP');
            } catch(e) {
              return new XMLHttpRequest();
            }
        }
    };


    /**
    * function letsSerialize (Object args)
    *
    * Don't shoot yourself in the foot by using multi-level objects.
    */
    function letsSerialize (args) {
        var ret = [];
        for (key in args) {
            ret.push(encodeURIComponent(key) + '=' + encodeURIComponent(args[key]));
        }
        return ret.join('&');
    }


    /**
    * function callMeMaybe (String url, Function cb, String method, Object/String args)
    *
    * The magic happens!
    */
    function callMeMaybe (url, cb, method, args) {
        var xhr = letsMakeXhr();
        xhr.open(method, url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                var res = x.response.toString();
                // we can kinda safely assume this is json with this
                if (res[0] === '{' || res[0] === '[') {
                    try {
                        res = JSON.parse(res);
                    } catch (e) {
                        console.log('RES cannot be parsed');
                    }
                }
                if (xhr.status !== 200) {
                    return cb({status: xhr.status, error: res });
                }
                return cb(null, res);
            }
        }
        // I love this trick :-)
        if (~['POST', 'PUT'].indexOf(method)) {
            xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
            if ('string' !== typeof args) {
                args = letsSerialize(args);
            }
        }
        xhr.send(args);
        // useful when used as return value of an onclick function
        return false
    };


    var jax = {
        GET: function (url, cb) {
            return callMeMaybe(url, cb, 'GET', null);
        },
        DELETE: function (url, cb) {
            return callMeMaybe(url, cb, 'DELETE', null);
        },
        PUT: function (url, args, cb) {
            return callMeMaybe(url, cb, 'PUT', args);
        },
        POST: function (url, args, cb) {
            return callMeMaybe(url, cb, 'POST', args);
        }
    };


    // dollajax sounds nice
    window.$jax = jax;

})();
