const config = require('../config/ucpaas')
const ucpaasClass = require('../core/ucpaasClass')

const smsVerify = {
	verifyCode: '',
	mobile: '',
	timeout: 120,
	timer: null,

	beginTimer: function(ctx) {
		var self = this
		self.timer = setInterval(function(){
			self.timeout--;
			if (self.timeout === 0) {
				clearInterval(self.timer)
				self.destory(ctx);
				self.timeout = 120;
				self.timer = null;
			}
		},1000);
	},

	genCode: function() {
		this.verifyCode = (Math.random()+'').replace(/^0\./,'').substr(0,4)
		return this.verifyCode
	},

	//发送注册验证码注册
	register: async function(ctx,phone) {
		let data = await this.send(ctx,phone,config.templateIdRegister);
		return data;
	},

	//发送密码重置验证码
	resetPwd: async function(ctx,phone) {
		let data = await this.send(ctx,phone,config.templateIdresetPwd);
		return data;
	},

	send: function(ctx,phone,templateId) {
		var self = this;
		self.mobile = phone;
		if (this.timer !== null) {return false;}
		//生成对象
		var ucpaas = new ucpaasClass({
		  accountsid: config.accountsid,
		  token: config.token
		});
		//发送短信
		// var status = 200;
		// var response = '{"resp":{"respCode":"000000","templateSMS":{"createDate":"20170721175043","smsId":"0c56c022a8c3c8112e261b3e0856a268"}}}'
		return new Promise(function(resolve,reject){
			ucpaas.templateSMS(config.appId,phone,templateId,self.genCode(),function(status,response) {
			  if (status === 200 && response.resp.respCode === '000000') {
			  	self.set(ctx);
			  	self.beginTimer(ctx);
			  	resolve(self.verifyCode);
			  }else{
			  	reject(response.resp.respCode);
			  }
			});
		});
	},

	set: function(ctx) {
		ctx.session.smsVerify = this.verifyCode
		ctx.session.smsVerifyMobile = this.mobile
	},

	destory: function(ctx) {
		ctx.session.smsVerify = ''
		ctx.session.smsVerifyMobile = ''
	},

	/**
	 * 获取验证码与验证的电话
	 * @Author   KuangGuanghu
	 * @DateTime 2017-07-21
	 * @param    {object}     ctx 上下文对象
	 * @return   {object}         包含验证码与验证电话对象{vCode,vMobile}
	 */
	get: function(ctx){
		return {
			vCode: ctx.session.smsVerify,
			vMobile: ctx.session.smsVerifyMobile
		}
	}
}

module.exports = smsVerify