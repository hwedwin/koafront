const router = require('koa-router')();
const FavoriteController = require('../controllers/FavoriteController');

router.post('/api/favorite/add',FavoriteController.create)
		.post('/api/favorite/del',FavoriteController.remove)
		.post('/api/favorite/combine',FavoriteController.combine)
		.post('/api/favorite/state',FavoriteController.state)
		.post('/api/favorite/list',FavoriteController.list)

module.exports = router


