//微信支付相关
var wxConfig = require('../config/weixin');
var util = require('./weixinUtil');
var request = require('request');
var md5 = require('MD5');

function WXPay() {
	
	if (!(this instanceof WXPay)) {
		return new WXPay(arguments[0]);
	};

	this.options = arguments[0];
	this.wxpayID = { appid:wxConfig.appid, mch_id:wxConfig.mch_id };
};

WXPay.mix = function(){
	
	switch (arguments.length) {
		case 1:
			var obj = arguments[0];
			for (var key in obj) {
				if (WXPay.prototype.hasOwnProperty(key)) {
					throw new Error('Prototype method exist. method: '+ key);
				}
				WXPay.prototype[key] = obj[key];
			}
			break;
		case 2:
			var key = arguments[0].toString(), fn = arguments[1];
			if (WXPay.prototype.hasOwnProperty(key)) {
				throw new Error('Prototype method exist. method: '+ key);
			}
			WXPay.prototype[key] = fn;
			break;
	}
};


WXPay.mix('option', function(option){
	for( var k in option ) {
		this.options[k] = option[k];
	}
});

WXPay.mix('sign', function(param){
	var str = '';
	var arr = [];
	for(var name in param) {
		arr.push(name+'='+param[name]);
	}
	arr.sort();
	str = arr.join('&');			
	str = str+'&'+wxConfig.appSecret
	return md5(str).toUpperCase();
});

WXPay.mix('createWCPayOrder', function(order){
	order.spbill_create_ip = order.spbill_create_ip.match(/\d+.\d+.\d+.\d+/)[0];
	order.trade_type = "JSAPI";
	order.nonce_str = order.nonce_str || util.generateNonceString();
	util.mix(order, this.wxpayID);
	order.sign = this.sign(order);
	console.log('order:'+JSON.stringify(order))
	var self = this;
	return new Promise(function(resolve,reject) {
		self.requestUnifiedOrder(order,function(err,data){
			if (err) {
				reject(err);
			}else{
				resolve(JSON.parse(data));
			}
		},function(err){
			reject(err);
		});
	});
});

WXPay.mix('requestUnifiedOrder',function(order,fn,errFn){
	console.log('8')
	request({
		url: "https://api.mch.weixin.qq.com/pay/unifiedorder",
		method: 'POST',
		body: util.buildXML(order),
		// agentOptions: {
		// 	pfx: this.options.pfx,
		// 	passphrase: this.options.mch_id
		// }
	}, function(err, response, body){
		console.log('9')
		if (err) {
			errFn();
		}else{
			console.log('body:'+body);
			util.parseXML(body,fn);
		}
	});	
	console.log('10')
});

exports = module.exports = WXPay;

