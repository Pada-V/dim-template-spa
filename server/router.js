'use strict';

var express = require('express'),
	router = express.Router();

router.get('/', function(req, res, next) {
	req.url = router.options.index || '/';
	next();
});

router.get('/apiDemo', function(req, res, next) {
	var data = {
		"items": [{
			"imageUrl": "//gw.alicdn.com/tfscom/T1WDrqXhdeXXci6r3Z_031520.jpg",
			"targetUrl": "//a.m.taobao.com/i15232205805.htm?scm=1007.11767.7448.100200300101001&pvid=d2291334-2680-42fa-bfa2-9159f45f6e4d",
			"price": "69.0",
			"type": "1"
		}, {
			"imageUrl": "//gw.alicdn.com/tfscom/T1TZluFBReXXXXXXXX_!!0-item_pic.jpg",
			"targetUrl": "//a.m.taobao.com/i37031198807.htm?scm=1007.11767.7448.100200300101001&pvid=d2291334-2680-42fa-bfa2-9159f45f6e4d",
			"price": "79.9",
			"type": "1"
		}, {
			"imageUrl": "//gw.alicdn.com/tfscom/TB1KahnHFXXXXbuXXXXXXXXXXXX_!!0-item_pic.jpg",
			"targetUrl": "//a.m.taobao.com/i44788594210.htm?scm=1007.11767.7448.100200300101001&pvid=d2291334-2680-42fa-bfa2-9159f45f6e4d",
			"price": "158.0",
			"type": "1"
		}]
	};
	res.json(data);
});

module.exports = function(options) {
	router.options = options || {};
	return router;
};