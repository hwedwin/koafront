const router = require('koa-router')();
const MemberController = require('../controllers/MemberController')

router.post('/api/member/regagent',MemberController.registerAgent)
		.post('/api/member/login',MemberController.login)
		.post('/api/member/logout',MemberController.logout)
		.post('/api/member/resetpwd',MemberController.resetPassword)
		.post('/api/member/data',MemberController.data)
		.post('/api/member/edit',MemberController.edit)
		.post('/api/member/customer',MemberController.getCustomer)

module.exports = router


