var indexApi = require('api-index');
var itemTpl = __inline('tpl/item.handlebars');

var indexView = {
	doms: {
		recommendShop: null 
	},
	init: function (params) {
		var doms = this.doms;
		doms.recommendShop = $('#J-recommend-shop');

		indexApi.getDemoData(params.page, function (data) {
		    var itemHtml = itemTpl(data);
		    doms.recommendShop.html(itemHtml);
		});
	}
}

module.exports = indexView;

