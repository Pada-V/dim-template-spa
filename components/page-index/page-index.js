var $ = require('zepto');
var BasePage = require('basepage');
var IndexTpl = __inline('page-index.handlebars');
var View = require('js/view.js');

var IndexPage = new BasePage({
    id: 'index',
    title: '首页',
    tpl: {
       tplKey: 'p-index',
       tplValue: IndexTpl
    },
    reloadOnQueryChanged: false,
    cachable: true,
    /*setData: function () {
        var preData = {
            images: {
                addBtn: __uri('images/btn_add.png')
            }
        };
        return preData;
    },*/
    load: function(params, datas){
        location.href = '/#login';
        setTimeout(function() {
            location.reload();
        }, 100);
        //View.init(params);
    }

});

/*IndexPage.actionIndex = new BasePage.Action({
    callback: function(params){
        console.log('params:', params);
        console.log('首页内容加载完成后的处理');
    }
});*/

module.exports = IndexPage;