var $ = require('zepto'),
    runtime = require('runtime');

var Clearout = function (config) {
    this.container = $(config.container);
    this.listItem = config.listItem;
    this.lastScrollPosition = 0;
    this.cache = {};
    this.uid = 1;
    this.preRend = config.preRend || 5;

    var _this = this,
        page = runtime.env.page;
    page.bind(window, 'scroll', function (obj) {
        _this.onScroll(obj);
        if (config.lazyload) {
                _scrollTop = scrollTop,
            page.lazyload();
        }
    });
    this.onScroll({
                scrollTop: document.documentElement.scrollTop + document.body.scrollTop,
                documentHeight: $(document).height(),
                windowHeight: $(window).height(),
                scrollHeight: document.body.scrollHeight
            });
}

Clearout.prototype = {
    onScroll: function (obj) {
        var _this = this,
            scrollTop = obj.scrollTop,
            height = obj.windowHeight,
            direction = 0;

        if (scrollTop > this.lastScrollPosition) {
            direction = 1; //down
        } else {
            direction = -1; //up
        }
        this.lastScrollPosition = scrollTop;

        var startItem = this.container.find('.J_clearout_start'),
            endItem = this.container.find('.J_clearout_end');
        if (startItem.size() == 0) {
            startItem = this.container.find(this.listItem).first();
        } else {
            startItem.removeClass('J_clearout_start');
        }
        if (endItem.size() == 0) {
            endItem = this.container.find(this.listItem).last();
        } else {
            endItem.removeClass('J_clearout_end');
        }
        if(direction == 1){
            var nextItem = startItem;
            while (nextItem.size() > 0) {
                if(this.isInView(scrollTop, height, nextItem)){
                    this.restore(nextItem);
                }else{
                    this.clearout(nextItem);
                }
                nextItem = nextItem.next();
            }
        }else if (direction == -1) {
            var prevItem = endItem;
            while (prevItem.size() > 0) {
                if(this.isInView(scrollTop, height, prevItem)){
                    this.restore(prevItem);
                }else{
                    this.clearout(prevItem);
                }
                prevItem = prevItem.prev();
            }
        }
        var firstVisibleItem = this.container.find('.J_restored').first();
        if(firstVisibleItem.prev().size() > 0){
            firstVisibleItem.prev().addClass('J_clearout_start'); 
        }else{
            firstVisibleItem.addClass('J_clearout_start');
        }
        var lastVisibleItem = this.container.find('.J_restored').last();
        if(lastVisibleItem.next().size() > 0){
            lastVisibleItem.next().addClass('J_clearout_end');
        }else{
            lastVisibleItem.addClass('J_clearout_end');    
        }
        
    },
    isInView: function(scrollTop, windowHeight, elm){
        var preRend = this.preRend,
            _scrollTop = scrollTop,
            scrollTop = scrollTop - windowHeight * preRend,
            top = $(elm).offset().top,
            bottom = top + $(elm).height(),
            scrollBottom = _scrollTop + windowHeight * (preRend + 1);
        return top >= scrollTop && top <= scrollBottom || bottom >= scrollTop && bottom <= scrollBottom || top <= scrollTop && bottom >= scrollBottom;
    },
    clearout: function (item) {
        item = $(item);
        item.removeClass('J_restored').addClass('J_cleared');
        if (item.data('clear-uid')) {
            return;
        }
        console.log('clear',item.height());
        item.height(item.get(0).offsetHeight + 'px');
        var uid = ++this.uid;
        item.data('clear-uid', uid);
        this.cache[uid] = item.html();
        item.html('');
    },
    restore: function (item) {
        item = $(item);
        item.removeClass('J_cleared').addClass('J_restored');
        var uid = $(item).data('clear-uid');
        if (!uid) {
            return;
        }
        var cache = this.cache[uid];
        delete this.cache[uid];
        item.html(cache);
        item.get(0).removeAttribute('data-clear-uid');
        item.height('auto');
    },
    destroy: function () {
        this.cache = null;
    }
}

module.exports = Clearout;