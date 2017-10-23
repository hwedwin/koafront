const router = require('koa-router')();
const ExpressForOrderController = require('../controllers/ExpressForOrderController');

router.post('/api/express/get',ExpressForOrderController.getOneByOrderId)

module.exports = router


