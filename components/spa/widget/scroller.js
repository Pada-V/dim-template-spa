/**
 * scroller
 * 滚动事件监听器，优化句柄执行
 */
var $ = require('zepto');
var runtime = require('runtime');

var timer, time = new Date(), now;

$(window).scroll(function () {
    if (timer) {
        clearTimeout(timer);
    }
    now = new Date();
    if(now - time > 500){
        Scroller.onScroll();
        time = now;
    }else{
        timer = setTimeout(function () {
            Scroller.onScroll();
        }, 100);
    }
});

runtime.vars.scrollObject = {
    scrollTop: document.documentElement.scrollTop + document.body.scrollTop,
    documentHeight: $(document).height(),
    windowHeight: $(window).height(),
    scrollHeight: document.body.scrollHeight
};

var Scroller = {
    handlers: {},
    bind: function (pageId, handler) {
        if (!this.handlers[pageId]) {
            this.handlers[pageId] = {};
        }
        this.handlers[pageId][handler] = handler;
    },
    unbind: function (pageId, handler) {
        delete this.handlers[pageId][handler];
    },
    unload: function (pageId) {
        this.handlers[pageId] = null;
    },
    onScroll: function () {
        var evtObj = {
                scrollTop: document.documentElement.scrollTop + document.body.scrollTop,
                documentHeight: $(document).height(),
                windowHeight: $(window).height(),
                scrollHeight: document.body.scrollHeight
            },
            pageId = runtime.env.page.id,
            handlers = this.handlers[pageId];
            runtime.vars.scrollObject = evtObj;
        if (!handlers) {
            return;
        }
        $.each(handlers, function (_, handler) {
            handler(evtObj);
        });
    }
}

module.exports = Scroller;