//连接数据库并设为全局常量
const sequelize = require('./utils/dbConnection');
global.sequelize = sequelize;
/*const Member = require('./models/Member');

async function test(){
	const result = await Member.findAll({
		where: {
			account: {
				$eq: '13142124442'
			}
		}
	})

	console.log(result)
}

test()*/

async function test(){
	var MemberBalanceController = require('./controllers/MemberBalanceController');
	var result = await MemberBalanceController.create('top')
	console.log(result)
}

test();

//管理员表
/*const Admin = require('./models/Admin');
(async function() {
	var admin = await Admin.create({
		account: 'admin',
		password: 'admin1234',
		role: '0',
		state: '1'
	})
	console.log(admin)
})();*/

//用户表
/*const Member = require('./models/Member');
(async function() {
	var member = await Member.create({
		account: '13142124443',
		password: 'test123',
		name: 'test',
		nickname: 'test',
		sex: '1',
		headerImage: '',
		birthday: Date.now(),
		phone: '13142124443',
		points: 0,
		useablePoints: 0,
	})
	console.log(member)
})();*/

//用户关系表
/*const MemberRelation = require('./models/MemberRelation');
(async function() {
	var memberRelation = await MemberRelation.create({
		fxLevel: '1',
		pid: 'f1dd8830-54e9-11e7-ae5d-e7c6c1f5bc8c',
		cid: 'c8598580-54ea-11e7-8ddd-47f0e962f82e',
	})
	console.log(memberRelation)
})();*/

//用户余额
/*const MemberBalance = require('./models/MemberBalance');
(async function() {
	var memberBalance = await MemberBalance.create({
		memberId: 'f1dd8830-54e9-11e7-ae5d-e7c6c1f5bc8c',
	})
	console.log(memberBalance)
})();*/

//酒类品牌
/*const DrinkBrand = require('./models/DrinkBrand');
(async function() {
	var drinkBrand = await DrinkBrand.create({
		brandName: '茅台',
		categoryId: '1',
		info: '国窖茅台',
		logo: '1hfjshf',
		state: 1,
	})
	console.log(drinkBrand)
})();*/

//酒类产品
/*const Drink = require('./models/Drink');
(async function() {
	var drink = await Drink.create({
		brandName: '茅台',
		categoryName: '白酒',
		name: '茅台52度迎宾',
		shortName: '茅台52度',
		origin: '贵州',
		level: '4',
		standard: '500ml',
		recipe: '小麦，水',
		expire: '10年',
		taste: '口感醇香',
		storage: '避光，常温储存',
		pruduceDate: '2012年',
		alcoholic: '52度',
		factory: '茅台酒厂',
		originPrice: 300,
		retailPrice: 1000,
		supplyPrice: 300,
		commission: 100,
		maxStorage: 100,
		validStorage: 100,
		limitBuy: 10,
		detail: '口感醇香，入口柔',
		imgPath: 'fsjkf',
		categoryId: '1',
		brandId: 'e2f69550-54ee-11e7-afc8-733cb4a719ac',
		expressFee: 0,
		saleState: '1',
		isDelete: '0',
	})
	console.log(drink)
})();*/

//产品图片
/*const DrinkImage = require('./models/DrinkImage');
(async function() {
	var drinkImage = await DrinkImage.create({
		imgPath: 'jfkj9089',
		drinkId: '55331780-54f2-11e7-ad10-53076d3e1965'
	})
	console.log(drinkImage)
})();*/