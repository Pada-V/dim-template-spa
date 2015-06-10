var $ = require('zepto');
var basePage = require('basepage');
var indexTpl = __inline('page-index.handlebars');
var indexView = require('view-index');

var indexPage = new basePage({
    id: 'index',
    title: '首页',
    tpl: {
       tplKey: 'p-index',
       tplValue: indexTpl
    },
    reloadOnQueryChanged: false,
    cachable: true,
    load: function(params, datas){
        indexView.init(params);
    }

});

/*IndexPage.actionIndex = new BasePage.Action({
	callback: function(params){
		console.log('params:', params);
	    console.log('首页内容加载完成后的处理');
	}
});*/

module.exports = indexPage;