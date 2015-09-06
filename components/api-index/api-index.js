/**
 * 首页数据接口
 */
var BaseAPI = require('baseapi');
var runtime = require('runtime');
var basePath = runtime.config.APIBasePath;

var URLS = {
	CHANNEL_LIST:basePath+'/apiDemo'
}

var API = new BaseAPI();

API.getDemoData = function (page, callback) {
    this.request({
        url: URLS.CHANNEL_LIST,
        data: {
            page: page,
            time: new Date().getTime()
        },
        callback: callback
    });
};

module.exports = API;
