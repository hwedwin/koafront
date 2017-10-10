//微信支付相关
var wxConfig = require('../config/weixin');
var WXPay = require('weixin-pay');

module.exports = {
	createUniOrder: function(openid,orderId,totalPrice,payInfo,ip,url) {
		ip = ip.match(/\d+.\d+.\d+.\d+/)[0];
		console.log('ip:'+ip)
		// 创建微信支付接口
		var wxpay = WXPay({
			appid: wxConfig.appid,
			mch_id: wxConfig.mch_id
		});

		return new Promise(function(resolve,reject){
			wxpay.getBrandWCPayRequestParams({
				openid: openid,
				body: payInfo,
			    detail: '公众号支付测试',
				out_trade_no: orderId,//内部订单号
				total_fee: totalPrice,
				spbill_create_ip: ip,
				notify_url: url
			}, function(err, result){
				if (err) {
					reject(err);
				}else{
			    	resolve(result);
				}
				// in express
			    // res.render('wxpay/jsapi', { payargs:result })
			});
		});
	}
};
