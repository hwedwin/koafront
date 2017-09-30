const router = require('koa-router')();
const SmsController = require('../controllers/SmsController')

router.post('/api/sms/register',SmsController.register)
		.post('/api/sms/resetpwd',SmsController.resetPwd)

module.exports = router


