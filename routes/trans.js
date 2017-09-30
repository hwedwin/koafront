const router = require('koa-router')();
const MemberTransactionController = require('../controllers/MemberTransactionController')

router.post('/api/trans/expense',MemberTransactionController.getAllExpense)
		.post('/api/trans/sumorder',MemberTransactionController.getAllOrders)

module.exports = router


