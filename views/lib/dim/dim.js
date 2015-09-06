(function (global) {
    'use strict';

    var slice = Array.prototype.slice,
        localStorage = global.localStorage,
        proto = {},
        dim = create(proto);

    dim.version = '0.3.8-2';
    dim.options = {
        prefix: '__dim__',
        cache: false,
        hash: '',
        timeout: 15, // seconds
        alias: {}, // key - name, value - id
        deps: {}, // key - id, value - name/id
        urlPattern: null, // '/path/to/resources/%s'
        comboPattern: null, // '/path/to/combo-service/%s' or function (ids) { return url; }
        combo: false,
        maxUrlLength: 2000 // approximate value of combo url's max length (recommend 2000)
    };
    dim.cache = {}; // key - id
    dim.traceback = null;

    /**
     * Mix obj to dim.options
     * @param {object} obj
     */
    proto.config = function (obj) {
        var options = dim.options;

        debug('dim.config', obj);
        each(obj, function (value, key) {
            var data = options[key],
                t = type(data);
            if (t === 'object') {
                each(value, function (v, k) {
                    data[k] = v;
                });
            } else {
                if (t === 'array') value = data.concat(value);
                options[key] = value;
            }
        });

        // detect localStorage support and activate cache ability
        try {
            if (options.hash !== localStorage.getItem('__dim_HASH__')) {
                dim.clean();
                localStorage.setItem('__dim_HASH__', options.hash);
            }
            options.cache = options.cache && !!options.hash;
        } catch (e) {
            options.cache = false;
        }

        // detect dim=nocombo,nocache in location.search
        if (/\bdim=([\w,]+)\b/.test(location.search)) {
            each(RegExp.$1.split(','), function (o) {
                switch (o) {
                case 'nocache':
                    dim.clean();
                    options.cache = false;
                    break;
                case 'nocombo':
                    options.combo = false;
                    break;
                }
            });
        }
        return options;
    };

    /**
     * Require modules asynchronously with a callback
     * @param {string|array} names
     * @param {function} onload
     */
    proto.async = function (names, onload) {
        if (type(names) === 'string') names = [names];
        debug('dim.async', 'require [' + names.join(', ') + ']');

        var reactor = new dim.Reactor(names, function () {
            var args = [];
            each(names, function (id) {
                args.push(require(id));
            });
            if (onload) onload.apply(dim, args);
            debug('dim.async', '[' + names.join(', ') + '] callback called');
        });
        reactor.run();
    };

    /**
     * Define a JS module with a factory function
     * @param {string} id
     * @param {function} factory
     */
    proto.define = function (id, factory) {
        debug('dim.define', '[' + id + ']');
        var options = dim.options,
            res = dim.cache[id];
        if (res) {
            res.factory = factory;
        } else {
            dim.cache[id] = {
                id: id,
                loaded: true,
                factory: factory
            };
        }
        if (options.cache) {
            try {
                localStorage.setItem(options.prefix + id, factory.toString());
            } catch (e) {
                options.cache = false;
            }
        }
    };

    /**
     * Define a CSS module
     * @param {string} id
     * @param {string} css
     * @param {boolean} [parsing=true]
     */
    proto.defineCSS = function (id, css, parsing) {
        debug('dim.defineCSS', '[' + id + ']');
        var options = dim.options;
        dim.cache[id] = {
            id: id,
            loaded: true,
            rawCSS: css
        };
        if (parsing !== false) requireCSS(id);
        if (options.cache) {
            try {
                localStorage.setItem(options.prefix + id, css);
            } catch (e) {
                options.cache = false;
            }
        }
    };

    /**
     * Get a defined module
     * @param {string} id
     * @returns {object} module
     */
    proto.get = function (id) {
        /* jshint evil:true */
        debug('dim.get', '[' + id + ']');
        var options = dim.options,
            type = fileType(id),
            res = dim.cache[id],
            raw;
        if (res) {
            return res;
        } else if (options.cache) {
            raw = localStorage.getItem(options.prefix + id);
            if (raw) {
                if (type === 'js') {
                    // Don't use eval or new Function in UC (9.7.6 ~ 9.8.5)
                    // global['eval'].call(global, 'define("' + id + '",' + raw + ')');
                    // new Function('define("' + id + '",' + raw + ')')();
                    var s = document.createElement('script');
                    s.appendChild(document.createTextNode('define("' + id + '",' + raw + ')'));
                    document.head.appendChild(s);
                } else if (type === 'css') {
                    dim.defineCSS(id, raw, false);
                }
                dim.cache[id].loaded = false;
                return dim.cache[id];
            }
        }
        return null;
    };

    /**
     * Clean module cache in localStorage
     */
    proto.clean = function () {
        debug('dim.clean');
        try {
            each(localStorage, function (_, key) {
                if (~key.indexOf(dim.options.prefix)) {
                    localStorage.removeItem(key);
                }
            });
            localStorage.removeItem('__dim_HASH__');
        } catch (e) {}
    };

    /**
     * Get alias from specified name recursively
     * @param {string} name
     * @param {string|function} [alias] - set alias
     * @returns {string} name
     */
    proto.alias = function (name, alias) {
        var aliasMap = dim.options.alias;

        if (arguments.length > 1) {
            aliasMap[name] = alias;
            return dim.alias(name);
        }

        while (aliasMap[name] && name !== aliasMap[name]) {
            switch (type(aliasMap[name])) {
            case 'function':
                name = aliasMap[name](name);
                break;
            case 'string':
                name = aliasMap[name];
                break;
            }
        }
        return name;
    };

    /**
     * Load any types of resources from specified url
     * @param {string} url
     * @param {function|object} [onload|options]
     */
    proto.load = function (url, options) {
        if (type(options) === 'function') {
            options = {onload: options};
            if (type(arguments[2]) === 'function') options.onerror = arguments[2];
        }

        var t = options.type || fileType(url),
            isScript = t === 'js',
            isCss = t === 'css',
            isOldWebKit = +navigator.userAgent
                .replace(/.*AppleWebKit\/(\d+)\..*/, '$1') < 536,

            head = document.head,
            node = document.createElement(isScript ? 'script' : 'link'),
            supportOnload = 'onload' in node,
            tid = setTimeout(onerror, (options.timeout || 15) * 1000),
            intId, intTimer;

        if (isScript) {
            node.type = 'text/javascript';
            node.async = 'async';
            node.src = url;
        } else {
            if (isCss) {
                node.type = 'text/css';
                node.rel = 'stylesheet';
            }
            node.href = url;
        }

        node.onload = node.onreadystatechange = function () {
            if (node && (!node.readyState ||
                /loaded|complete/.test(node.readyState))) {
                clearTimeout(tid);
                node.onload = node.onreadystatechange = null;
                if (isScript && head && node.parentNode) head.removeChild(node);
                if (options.onload) options.onload.call(dim);
                node = null;
            }
        };

        node.onerror = function onerror(e) {
            clearTimeout(tid);
            clearInterval(intId);
            e = (e || {}).error || new Error('load url timeout');
            e.message = 'Error loading url: ' + url + '. ' + e.message;
            if (options.onerror) options.onerror.call(dim, e);
            else throw e;
        };

        debug('dim.load', '[' + url + ']');
        head.appendChild(node);

        // trigger onload immediately after nonscript node insertion
        if (isCss) {
            if (isOldWebKit || !supportOnload) {
                debug('dim.load', 'check css\'s loading status for compatible');
                intTimer = 0;
                intId = setInterval(function () {
                    if ((intTimer += 20) > options.timeout || !node) {
                        clearTimeout(tid);
                        clearInterval(intId);
                        return;
                    }
                    if (node.sheet) {
                        clearTimeout(tid);
                        clearInterval(intId);
                        if (options.onload) options.onload.call(dim);
                        node = null;
                    }
                }, 20);
            }
        } else if (!isScript) {
            if (options.onload) options.onload.call(dim);
        }
    };

    proto.Reactor = function (names, callback) {
        this.length = 0;
        this.depends = {};
        this.depended = {};
        this.push.apply(this, names);
        this.callback = callback;
    };

    var rproto = dim.Reactor.prototype;

    rproto.push = function () {
        var that = this,
            args = slice.call(arguments);

        function onload() {
            if (--that.length === 0) that.callback();
        }

        each(args, function (arg) {
            var id = dim.alias(arg),
                type = fileType(id),
                res = dim.get(id);

            if (!res) {
                res = dim.cache[id] = {
                    id: id,
                    loaded: false
                };
            } else if (that.depended[id] || res.loaded) return;
            if (!res.onload) res.onload = [];

            that.depended[id] = 1;
            that.push.apply(that, dim.options.deps[id]);

            if ((type === 'css' && !res.rawCSS && !res.parsed) ||
                (type === 'js' && !res.factory && !res.exports)) {
                (that.depends[type] || (that.depends[type] = [])).push(res);
                ++that.length;
                res.onload.push(onload);
            } else if (res.rawCSS) {
                requireCSS(id);
            }
        });
    };

    function makeOnload(deps) {
        deps = deps.slice();
        return function (e) {
            if (e) error(e);
            each(deps, function (res) {
                if (!e) res.loaded = true;
                while (res.onload && res.onload.length) {
                    var onload = res.onload.shift();
                    onload.call(res);
                }
            });
        };
    }

    rproto.run = function () {
        var that = this,
            options = dim.options,
            combo = options.combo,
            depends = this.depends;

        if (this.length === 0) return this.callback();
        debug('reactor.run', depends);

        each(depends.unknown, function (res) {
            dim.load(that.genUrl(res.id), function () {
                res.loaded = true;
            });
        });

        debug('reactor.run', 'combo: ' + combo);
        if (combo) {
            each(['css', 'js'], function (type) {
                var urlLength = 0,
                    ids = [],
                    deps = [];

                each(depends[type], function (res, i) {
                    var onload;
                    if (urlLength + res.id.length < options.maxUrlLength) {
                        urlLength += res.id.length;
                        ids.push(res.id);
                        deps.push(res);
                    } else {
                        onload = makeOnload(deps);
                        dim.load(that.genUrl(ids), onload, onload);
                        urlLength = res.id.length;
                        ids = [res.id];
                        deps = [res];
                    }
                    if (i === depends[type].length - 1) {
                        onload = makeOnload(deps);
                        dim.load(that.genUrl(ids), onload, onload);
                    }
                });
            });
        } else {
            each((depends.css || []).concat(depends.js || []), function (res) {
                var onload = makeOnload([res]);
                dim.load(that.genUrl(res.id), onload);
            });
        }
    };

    rproto.genUrl = function (ids) {
        if (type(ids) === 'string') ids = [ids];

        var options = dim.options,
            url = options.combo && options.comboPattern || options.urlPattern;

        if (options.cache && fileType(ids[0]) === 'css') {
            each(ids, function (id, i) {
                ids[i] = id + '.js';
            });
        }

        switch (type(url)) {
        case 'string':
            url = url.replace('%s', ids.join(','));
            break;
        case 'function':
            url = url(ids);
            break;
        default:
            url = ids.join(',');
        }

        // The omission of `_hash=` might cause problem in wechat's webview
        return url + (~url.indexOf('?') ? '&' : '?') + '_hash=' + options.hash;
    };

    /**
     * Require another module in factory
     * @param {string} name
     * @returns {*} module.exports
     */
    function require(name) {
        var id = dim.alias(name),
            module = dim.get(id);

        if (fileType(id) !== 'js') return;
        if (!module) {
            error(new Error('failed to require "' + name + '"'));
            return null;
        }
        if (!module.exports) {
            if (type(module.factory) !== 'function') {
                throw new Error('failed to require "' + name + '"');
            }
            try {
                module.factory.call(dim, require, module.exports = {}, module);
            } catch (e) {
                e.id = id;
                throw (dim.traceback = e);
            }
            delete module.factory;
            debug('require', '[' + id + '] factory called');
        }
        return module.exports;
    }

    // Mix dim's prototype to require
    each(proto, function (m, k) { require[k] = m; });

    /**
     * Parse CSS module
     * @param {string} name
     */
    function requireCSS(name) {
        var id = dim.alias(name),
            module = dim.get(id);

        if (fileType(id) !== 'css') return;
        if (!module) throw new Error('failed to require "' + name + '"');
        if (!module.parsed) {
            if (type(module.rawCSS) !== 'string') {
                throw new Error('failed to require "' + name + '"');
            }
            var styleEl = document.createElement('style');
            document.head.appendChild(styleEl);
            styleEl.appendChild(document.createTextNode(module.rawCSS));
            delete module.rawCSS;
            module.parsed = true;
        }
    }

    function type(obj) {
        var t;
        if (obj == null) {
            t = String(obj);
        } else {
            t = Object.prototype.toString.call(obj).toLowerCase();
            t = t.substring(8, t.length - 1);
        }
        return t;
    }

    function each(obj, iterator, context) {
        if (typeof obj !== 'object') return;

        var i, l, t = type(obj);
        context = context || obj;
        if (t === 'array' || t === 'arguments' || t === 'nodelist') {
            for (i = 0, l = obj.length; i < l; i++) {
                if (iterator.call(context, obj[i], i, obj) === false) return;
            }
        } else {
            for (i in obj) {
                if (obj.hasOwnProperty(i)) {
                    if (iterator.call(context, obj[i], i, obj) === false) return;
                }
            }
        }
    }

    function create(proto) {
        function Dummy() {}
        Dummy.prototype = proto;
        return new Dummy();
    }

    var TYPE_RE = /\.(js|css)(?=[?&,]|$)/i;
    function fileType(str) {
        var ext = 'js';
        str.replace(TYPE_RE, function (m, $1) {
            ext = $1;
        });
        if (ext !== 'js' && ext !== 'css') ext = 'unknown';
        return ext;
    }

    var _modCache;
    function debug() {
        var flag = (global.localStorage || {}).debug,
            args = slice.call(arguments),
            style = 'color: #bada55',
            mod = args.shift(),
            re = new RegExp(mod.replace(/[.\/\\]/g, function (m) {
                return '\\' + m;
            }));
        mod = '%c' + mod;
        if (flag && flag === '*' || re.test(flag)) {
            if (_modCache !== mod) {
                console.groupEnd(_modCache, style);
                console.group(_modCache = mod, style);
            }
            if (/string|number|boolean/.test(type(args[0]))) {
                args[0] = '%c' + args[0];
                args.splice(1, 0, style);
            }
            console.log.apply(console, args);
        }
    }

    function error() {
        if (console && type(console.error) === 'function') {
            console.error.apply(console, arguments);
        }
    }

    global.require = dim;
    global.define = dim.define;
    global.defineCSS = dim.defineCSS;
    if (global.module && global.module.exports) global.module.exports = dim;
})(this);