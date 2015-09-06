var HeaderTpl = __inline('../tpls/header.handlebars');

var View = {
	doms: {},
	//视图初始化
	init: function(pageInstance, params) {
		this.doms = {
			headerCon: $('#buy-header', pageInstance.dom)
		};
		this.render();
	},
	//渲染面料求购页面视图
	render: function () {
		var doms = this.doms;
		doms.headerCon.html(HeaderTpl);
		Loading.hide();
	}
}

module.exports = View;

