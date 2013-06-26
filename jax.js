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
        // What if we got a null?
        if (!args) {
            return '';
        }
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
    function callMeMaybe (url, cb, method, headers, args) {
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
        // we almost forgot them headers!
        for (var i = 0; i < headers.length; ++i) {
            xhr.setRequestHeader(headers[i][0], headers[i][1]);
        }
        xhr.send(args);
        // useful when used as return value of an onclick function
        return false
    };


    var jax = {
        GET: function (url, headers, cb) {
            if ('function' === typeof headers) cb = headers, headers = [];
            return callMeMaybe(url, cb, 'GET', headers, null);
        },
        DELETE: function (url, headers, cb) {
            if ('function' === typeof headers) cb = headers, headers = [];
            return callMeMaybe(url, cb, 'DELETE', headers, null);
        },
        PUT: function (url, args, headers, cb) {
            if ('function' === typeof headers) cb = headers, headers = [];
            return callMeMaybe(url, cb, 'PUT', headers, args);
        },
        POST: function (url, args, headers, cb) {
            if ('function' === typeof headers) cb = headers, headers = [];
            return callMeMaybe(url, cb, 'POST', headers, args);
        }
    };


    // dollajax sounds nice
    window.$jax = jax;

})();
