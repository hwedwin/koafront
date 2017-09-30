const router = require('koa-router')();
const MemberBalanceController = require('../controllers/MemberBalanceController')

router.post('/api/balance/get',MemberBalanceController.postBanlance)

module.exports = router


