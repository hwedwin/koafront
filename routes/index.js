const router = require('koa-router')();
const IndexController = require('../controllers/IndexController')

router.get('/register',IndexController.index)
		.get('/:id/register',IndexController.index)
		.get('/',IndexController.index)
		.post('/api/beat',IndexController.beat)

module.exports = router


