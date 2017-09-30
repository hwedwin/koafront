const BosClient = require('bce-sdk-js')
const respond = require('../utils/respond')
const CommonUtil = require('../utils/CommonUtil')
const BAIDU = require('../config/baidu')
const uuid = require('node-uuid')

const FileController = {
	uploadBaiduBCE: async function(ctx) {
		const files = ctx.request.body.files.file
		if (!files) {respond.json(ctx,false,'上传数据有误')}
		var imgUrlArr = [], fileArr = []
		console.log(files)
		if (! Array.isArray(files)) {
			fileArr.push(files)
		}else{
			fileArr = files
		}
		console.log(fileArr)
		try {
	        //百度云配置
	        let bucket = BAIDU.BDBCE.bucketName;
	        const config = {
	            credentials: {
	                ak: BAIDU.BDBCE.accessKeyId,
	                sk: BAIDU.BDBCE.secretAccessKey
	            },
	            endpoint: BAIDU.BDBCE.endpoint
	        };
	        let client = new BosClient.BosClient(config);
	        for (let i = 0; i < fileArr.length; i++) {
			    let ext = fileArr[i].type.split('/')[1];
			    let path = fileArr[i].path;
			    if (fileArr[i].type.indexOf('image') > -1) {
			        let currentDate = CommonUtil.dateFormat(new Date(), "yyyy-MM-dd");
			        let key = currentDate + "/" + uuid.v1().replace(/-/ig, "") +'.'+ext;
			        let imgUrl = BAIDU.BDBCE.fileBaseUrl + key;
			        imgUrlArr.push(imgUrl);
			        const res = await client.putObjectFromFile(bucket, key, path);			    }
	        }
	        respond.json(ctx,true,'文件上传成功',imgUrlArr)
	    } catch (err) {		
	        respond.json(ctx,false,'文件上传失败',null,err)
	    }
	},

	uploadPortrait: async function(ctx) {
		if (!ctx.request.body.files) {respond.json(ctx,false,'上传数据有误');return false;}
		const files = ctx.request.body.files.file
		if (!files) {respond.json(ctx,false,'上传数据有误')}
		var imgUrlArr = [], fileArr = []
		console.log(files)
		if (! Array.isArray(files)) {
			fileArr.push(files)
		}else{
			fileArr = files
		}
		console.log(fileArr)
		try {
	        //百度云配置
	        let bucket = BAIDU.BDBCE.bucketName;
	        const config = {
	            credentials: {
	                ak: BAIDU.BDBCE.accessKeyId,
	                sk: BAIDU.BDBCE.secretAccessKey
	            },
	            endpoint: BAIDU.BDBCE.endpoint
	        };
	        let client = new BosClient.BosClient(config);
	        for (let i = 0; i < fileArr.length; i++) {
			    let ext = fileArr[i].type.split('/')[1];
			    let path = fileArr[i].path;
			    if (fileArr[i].type.indexOf('image') > -1) {
			        let currentDate = 'portraits';
			        let key = currentDate + "/" + uuid.v1().replace(/-/ig, "") +'.'+ext;
			        let imgUrl = BAIDU.BDBCE.fileBaseUrl + key;
			        imgUrlArr.push(imgUrl);
			        const res = await client.putObjectFromFile(bucket, key, path);			    
			    }
	        }
	        respond.json(ctx,true,'文件上传成功',imgUrlArr)
	    } catch (err) {		
	        respond.json(ctx,false,'文件上传失败',null,err)
	    }
	},

	uploadFile: async function(ctx) {
		const files = ctx.request.body.files
		/*
		 *{
		 *	uploads: [
		 *		{
		 *			size: 123,
		 *			path: '',
		 *			name: 'test.png',
		 *			type: 'image/png',
		 *			mtime: '2017-06-27TU11:08:816Z'
		 *		}
		 *	]
		 *}
		 */
	}
}

module.exports = FileController