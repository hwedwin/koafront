const smsVerify = require('../utils/smsVerify')
const MemberController = require('./MemberController')
const respond = require('../utils/respond')

const SmsController = {
	register: async function(ctx) {
		const {mobile} = ctx.request.body
		let mobileEx = await MemberController.mobileExist(mobile);
		if (mobileEx) {
			respond.json(ctx,false,'手机号已被注册')
		}else{
			try{
				let code = await smsVerify.register(ctx,mobile)
				// smsVerify.verifyCode = 2222;
				// smsVerify.mobile = mobile;
				// smsVerify.set(ctx);
				respond.json(ctx,true,'验证码发送成功');
			}catch(e){
				respond.json(ctx,false,'验证码发送失败',null,e);
			}
		}
	},
	resetPwd: async function(ctx) {
		const {mobile} = ctx.request.body
		let mobileEx = await MemberController.mobileExist(mobile)
		if (!mobileEx) {
			respond.json(ctx,false,'此手机号尚未被注册')
		}else{
			try{
				let code = await smsVerify.resetPwd(ctx,mobile)
				respond.json(ctx,true,'验证码发送成功')
			}catch(e){
				respond.json(ctx,false,'验证码发送失败',null,e)
			}
		}
	}
}

module.exports = SmsController