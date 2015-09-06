'use strict';

module.exports = function () {
	var config = require('app-config');
    var dispatcher = require('dispatcher');
    dispatcher.init(config);

    //document.body.innerHTML = '<h1>Hello world APP!</h1>';

};