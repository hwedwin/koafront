const router = require('koa-router')();
const IndexController = require('../controllers/IndexController')

router.get('/',IndexController.index)
		.get('/home',IndexController.index)
		.get('/pay/?#!',IndexController.index)
		.get('/regagent',IndexController.regagent)
		.get('/wxoauth',IndexController.wxOauth)
		.post('/api/beat',IndexController.beat)
		.post('/api/wxsign',IndexController.getWeixinJSConfig)

module.exports = router


