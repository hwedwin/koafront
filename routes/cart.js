const router = require('koa-router')();
const ShopCartController = require('../controllers/ShopCartController');

router.post('/api/cart/add',ShopCartController.addGoods)
		.post('/api/cart/get',ShopCartController.getByMemberId)
		.post('/api/cart/del',ShopCartController.deleteCartById)
		.post('/api/cart/delbid',ShopCartController.deleteCartByDrinkId)
		.post('/api/cart/nums',ShopCartController.operationNums)

module.exports = router


