const router = require('koa-router')();
const IndexTopSpecialController = require('../controllers/IndexTopSpecialController')

router.post('/api/topspe/list',IndexTopSpecialController.list)

module.exports = router


