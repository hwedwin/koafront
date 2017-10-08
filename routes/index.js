const router = require('koa-router')();
const IndexController = require('../controllers/IndexController')

router.get('/',IndexController.index)
		.get('/regagent',IndexController.regagent)
		.post('/api/beat',IndexController.beat)

module.exports = router


