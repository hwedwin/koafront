const router = require('koa-router')();
const BrandController = require('../controllers/BrandController')

router.post('/api/brand/list',BrandController.list)

module.exports = router


