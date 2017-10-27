const router = require('koa-router')();
const MemberController = require('../controllers/MemberController');
router.post('/api/member/regagent',MemberController.registerAgent)
		.post('/api/member/login',MemberController.login)
		.post('/api/member/logout',MemberController.logout)
		.post('/api/member/resetpwd',MemberController.resetPassword)
		.post('/api/member/data',MemberController.data)
		.post('/api/member/edit',MemberController.edit)
		.post('/api/member/customer',MemberController.getCustomer)
		.post('/api/member/register',MemberController.register)
		.post('/api/member/paynotify',MemberController.payNotify)
		.post('/api/member/databyid',MemberController.getDataById)
		.post('/api/member/withdraw',MemberController.withdraw)
		.post('/api/member/resumepay',MemberController.resumeAgentPay)

module.exports = router;


