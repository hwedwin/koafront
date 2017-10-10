//微信支付相关
var wxConfig = require('../config/weixin');
var WXPay = require('weixin-pay');

module.exports = {
	createUniOrder: function(openid,orderId,totalPrice,payInfo,url) {
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
				total_fee: 0.01,
				spbill_create_ip: ctx.ip,
				notify_url: url
			}, function(err, result){
				// in express
			    // res.render('wxpay/jsapi', { payargs:result })
			    resolve(result);
			});
		});
	}
};