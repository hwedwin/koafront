const router = require('koa-router')();
const ConsigneeController = require('../controllers/ConsigneeController')

router.post('/api/consignee/list',ConsigneeController.getByMemberId)
		.post('/api/consignee/create',ConsigneeController.createByPost)
		.post('/api/consignee/one',ConsigneeController.getOneById)
		.post('/api/consignee/modify',ConsigneeController.modifyOneById)

module.exports = router


