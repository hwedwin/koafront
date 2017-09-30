const router = require('koa-router')();
const FileController = require('../controllers/FileController')

router.post('/api/file/bdbce',FileController.uploadBaiduBCE)
		.post('/api/file/local',FileController.uploadFile)
		.post('/api/file/portrait',FileController.uploadPortrait)

module.exports = router


