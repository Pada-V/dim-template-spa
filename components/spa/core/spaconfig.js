var config = {};

//默认页面容器
config.pageContainer = '#page';
//默认入口页面
config.defaultPage = 'index';
//数据缓存过期时间，单位毫秒
config.dataCacheExpires = 300000;
//打包加载Css
config.styleCombine = true;
// 0: 不预加载, > 0: 预加载的屏数
config.imgPreload = 2;
// 是否使用APPCACHE
config.useAppCache = false;

module.exports = config;