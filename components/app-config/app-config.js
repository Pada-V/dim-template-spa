var config = {};


//页面组件命名前缀
config.pageComponents = 'page-';
//视图组件命名前缀
config.viewComponents = 'view-';
//api组件命名前缀
config.apiComponents = 'api-';
//默认使用1、handlebars
config.templateMode = 1;

config.defaultPage = 'index';

config.APIBasePath = 'http://'+window.location.host;

config.dataCacheExpires = 0;


module.exports = config;