const router = require('koa-router')();
const OrderController = require('../controllers/OrderController')

router.post('/api/order/create',OrderController.create)
		.post('/api/order/list',OrderController.list)
		.post('/api/order/detail',OrderController.getOneById)
		.post('/api/order/count',OrderController.getCountByState)
		.post('/api/order/sign',OrderController.signOrder)
		.post('/api/order/delete',OrderController.deleteOrder)
		.post('/api/order/wxpay',OrderController.payOrder)
		.post('/api/order/bpay',OrderController.payByBalance)
		.post('/api/order/paynotify',OrderController.payNotify)

module.exports = router


