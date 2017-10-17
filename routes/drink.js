const router = require('koa-router')();
const DrinkController = require('../controllers/DrinkController');

router.post('/api/drink/list',DrinkController.list)
		.post('/api/drink/listrec',DrinkController.listRec)
		.post('/api/drink/listhot',DrinkController.listHot)
		.post('/api/drink/listspecial',DrinkController.listTodaySpecial)
		.post('/api/drink/one',DrinkController.getOneById)
		.post('/api/drink/search',DrinkController.findBySearch)
		.post('/api/drink/listcate',DrinkController.getByCate)
		.post('/api/drink/listbrand',DrinkController.getByBrand)

module.exports = router;


