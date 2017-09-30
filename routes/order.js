const router = require('koa-router')();
const OrderController = require('../controllers/OrderController')

router.post('/api/order/create',OrderController.create)
		.post('/api/order/list',OrderController.list)
		.post('/api/order/detail',OrderController.getOneById)
		.post('/api/order/count',OrderController.getCountByState)
		.post('/api/order/sign',OrderController.signOrder)

module.exports = router


