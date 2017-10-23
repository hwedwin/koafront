const router = require('koa-router')();
const MemberTransactionController = require('../controllers/MemberTransactionController')

router.post('/api/trans/expense',MemberTransactionController.getAllExpense)
		.post('/api/trans/sumorder',MemberTransactionController.getAllOrders)
		.post('/api/trans/items',MemberTransactionController.getUserBalanceTransItem)
		.post('/api/trans/item',MemberTransactionController.getOneById)
		.post('/api/trans/profit',MemberTransactionController.getProfit)

module.exports = router


