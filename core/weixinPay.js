//微信支付相关
var fs = require('fs');
var path = require('path');
var wxConfig = require('../config/weixin');
var util = require('./weixinUtil');
var request = require('request');
var md5 = require('MD5');

function WXPay() {
	
	if (!(this instanceof WXPay)) {
		return new WXPay(arguments[0]);
	};

	this.options = arguments[0];
	console.log(1)
	console.log(fs.readFileSync(path.resolve(__dirname,'../cert/apiclient_cert.p12'));
	console.log(2)
	this.options.pfx = fs.readFileSync(path.resolve(__dirname,'../cert/apiclient_cert.p12'));
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
		if (param[name] != null && param[name] != '') {
			arr.push(name+'='+param[name]);
		}
	}
	arr.sort();
	str = arr.join('&');			
	str = str + '&key=' + wxConfig.mch_key;
	return md5(str).toUpperCase();
});

WXPay.mix('createWCPayOrder', function(order){
	order.spbill_create_ip = order.spbill_create_ip.match(/\d+.\d+.\d+.\d+/)[0];
	order.trade_type = "JSAPI";
	order.nonce_str = order.nonce_str || util.generateNonceString();
	util.mix(order, this.wxpayID);
	order.sign = this.sign(order);
	var self = this;
	return new Promise(function(resolve,reject) {
		self.requestUnifiedOrder(order,function(err,data){
			if (err) {
				reject(err);
			}else{
				if (data.return_code == 'SUCCESS' && data.result_code == 'SUCCESS') {
					var resParam = {
						"appId":data.appid,     //公众号名称，由商户传入     
			           "timeStamp":Math.floor(Date.now()/1000)+"",    //时间戳，自1970年以来的秒数     
			           "nonceStr":data.nonce_str, //随机串     
			           "package":"prepay_id="+data.prepay_id,     
			           "signType":"MD5"         //微信签名方式：     
					};
					resParam.paySign = self.sign(resParam); 
					resolve(resParam);
				}else{
					reject(data);
				}
			}
		},function(err){
			reject(err);
		});
	});
});

WXPay.mix('requestUnifiedOrder',function(order,fn,errFn){
	request({
		url: "https://api.mch.weixin.qq.com/pay/unifiedorder",
		method: 'POST',
		body: util.buildXML(order),
		// agentOptions: {
		// 	pfx: this.options.pfx,
		// 	passphrase: this.options.mch_id
		// }
	}, function(err, response, body){
		if (err) {
			errFn();
		}else{
			console.log('body:'+body);
			util.parseXML(body,fn);
		}
	});	
});

/**
 * order:
 * openid,
 * partner_trade_no,
 * re_user_name,
 * amount,
 * spbill_create_ip
 */
WXPay.mix('createTransferOrder', function(order){
	order.spbill_create_ip = order.spbill_create_ip.match(/\d+.\d+.\d+.\d+/)[0];
	order.trade_type = "JSAPI";
	order.nonce_str = order.nonce_str || util.generateNonceString();
	order.mch_appid = wxConfig.appid;
	order.mchid = wxConfig.mch_id;
	// order.partner_trade_no = 
	order.check_name = 'NO_CHECK';//不强制检验真是姓名
	order.desc = '用户提现';
	order.sign = this.sign(order);
	var self = this;
	return new Promise(function(resolve,reject) {
		self.requestTransferOrder(order,function(err,data) {
			if (err) {
				reject(err);
			}else{
				// if (data.return_code == 'SUCCESS' && data.result_code == 'SUCCESS') {
				// 	resolve(data);
				// }else{
				// 	reject(data);
				// }
				resolve(data);
			}
		},function(err){
			reject(err);
		});
	});
});

WXPay.mix('requestTransferOrder',function(order,fn,errFn){
	console.log(this.options.pfx);
	request({
		url: "https://api.mch.weixin.qq.com/mmpaymkttransfers/promotion/transfers",
		method: 'POST',
		body: util.buildXML(order),
		agentOptions: {
			pfx: this.options.pfx,
			passphrase: wxConfig.mch_id
		}
	}, function(err, response, body){
		if (err) {
			errFn();
		}else{
			console.log('body:'+body);
			util.parseXML(body,fn);
		}
	});		
});

exports = module.exports = WXPay;

