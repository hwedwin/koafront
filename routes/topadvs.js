const router = require('koa-router')();
const IndexTopAdvController = require('../controllers/IndexTopAdvController')

router.post('/api/topadv/list',IndexTopAdvController.list)

module.exports = router


