/**
 * Template Loader
 */
var $ = require('zepto'),
    config = require('runtime').config;

var TemplateManager = {
    caches: {},
    /**
     * 设置模板缓存
     * @param {int} id 模板id
     * @param {string} tpl 模板内容
     * @param {Array} styles 模板样式
     */
    set: function (id, tpl, styles) {
        var templateCache = {};
        templateCache.id = id;
        templateCache.styles = styles;
        //templateCache.content = tpl.replace(/<link.+?\/>/g, '');
        this.caches[id] = templateCache;
    },
    /**
     *
     *
     */
    get: function (id, type) {
        if (!this.caches[id]) {
            return null;
        }
        var cache = this.caches[id];
        return cache;
        /*if (typeof type === 'undefined') {
            return cache;
        } else {
            return cache[type];
        }*/
    }
    /*load: function (id, callback) {
        var templateCache = this.get[id];
        if (templateCache) {
            callback(templateCache);
        } else {
            TemplateManager.Loader[config.templateMode](id, callback);
        }
    },*/
    /*parseHTMLTemplate: function (tpl) {
        var reg = /<\!--TEMPLATE_START:(\w+?)--\>/g,
            rs, id, content, tag, start, end, styles;
        while (rs = reg.exec(tpl)) {
            id = rs[1];
            tag = rs[0];
            start = tpl.indexOf(tag) + tag.length;
            end = tpl.indexOf('<!--TEMPLATE_END:' + id + '-->');
            content = tpl.substr(start, end - start);
            styles = TemplateManager.parseStyles(content);
            content = content.replace(/<!--TEMPLATE_START:(\w+)[\s\S]*TEMPLATE_END:\1-->/gm, '');
            TemplateManager.set(id, content, styles);
        }
    },*/
    /*parseStyles: function (tpl) {
        var styles = [],
            reg = /href="(.*?\.css)"/g,///http:\/\/.+\.css/g,
            res;
        while (res = reg.exec(tpl)) {
            styles.push(res[1]);
        }
        return styles;
    },*/
    /*useStyle: function (style, callback) {
        require.async(style, function () {
            if (!$.isArray(style)) {
                style = [style];
            }
            $.each(style, function (_, o) {
                if(o.indexOf('http') !== 0){
                    o = 'http://' + location.host + '/' + o.replace(/^\/+?/, '');
                }
                // var dom = $('link[href="' + o + '"]');
                var size = 0, dom;
                $('link[href]').each(function(_, link){
                    if(link.href.indexOf(o) > -1){
                        size ++;
                        dom = $(link);
                    }
//                        console.log(o, link.href, link.href.indexOf(o))    ;
                });
                //console.log(o);
                if (size === 0) {
                    $('head').append('<link type="text/css" rel="stylesheet" href="' + o + '" data-use="1" />'); //fix seajs use style bug
                } else {
                    dom.data('use', (parseInt(dom.data('use'), 10) || 0) + 1);
                }
            });
            if (typeof callback === 'function') {
                callback();
            }
        });
    },*/
    /*removeStyle: function (style) {
        if ($.isArray(style)) {
            $.each(style, function (_, o) {
                TemplateManager.removeStyle(o);
            });
        } else {
            var dom = $('link[href="' + style + '"]');
            if (dom.size() > 0) {
                var count = parseInt(dom.data('use'), 10) || 1;
                if (count <= 1) {
                    dom.remove();
                } else {
                    dom.data('use', count - 1);
                }
            }
        }
    }*/
};

/*TemplateManager.Loader = {};
TemplateManager.Loader[config.TEMPLATE_MODE.HTML] = function (id, callback) {
    require.async(config.HTMLTemplatePath + id + '.tpl', function (tpl) {
        TemplateManager.parseHTMLTemplate(tpl);
        callback();
    });
};

TemplateManager.Loader[config.TEMPLATE_MODE.SCRIPT] = function (id, callback) {
    require.async('app/templates/' + id + '.tpl.html', function (tpl) {
        TemplateManager.parseHTMLTemplate(tpl);
        callback();
    });
};

TemplateManager.Loader[config.TEMPLATE_MODE.SCRIPT_HTML] = function (id, callback) {
    var content = $('#tpl_' + id).html(),
        styles = TemplateManager.parseStyles(content);
    TemplateManager.set(id, content, styles);
    callback();
};*/

module.exports = {
    /*load: function (id, callback) {
        TemplateManager.load(id, function () {
            callback(TemplateManager.get(id));
        });
    },*/
    set: function (id, tpl, styles) {
        TemplateManager.set(id, tpl, styles);
    },
    get: function (id, callback) {
        if (callback) {
            callback(TemplateManager.get(id));
        } else {
            return TemplateManager.get(id);
        }
        
    }/*,
    useStyle: function (style, callback) {
        TemplateManager.useStyle(style, callback);
    },
    removeStyle: function (style) {
        TemplateManager.removeStyle(style);
    }*/
};
