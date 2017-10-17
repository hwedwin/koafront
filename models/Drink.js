const Sequelize = require('sequelize');
const Drink = sequelize.define('drink',{
	id: {
		type: Sequelize.UUID,
		primaryKey: true,
		defaultValue: Sequelize.UUIDV1
	},
	brandName: Sequelize.STRING(100),
	categoryName: Sequelize.STRING(100),
	name: Sequelize.STRING(100),
	shortName: Sequelize.STRING(100),
	origin: Sequelize.STRING(100),
	level: Sequelize.STRING(50),
	standard: Sequelize.STRING(50),
	recipe: Sequelize.STRING(200),
	expire: Sequelize.STRING(50),
	taste: Sequelize.STRING(100),
	storage: Sequelize.STRING(100),
	pruduceDate: Sequelize.STRING(50),
	alcoholic: Sequelize.STRING(100),
	factory: Sequelize.STRING(100),
	costPrice: {//成本
		type: Sequelize.DECIMAL(12,2),
		defaultValue: 0
	},
	originPrice: {
		type: Sequelize.DECIMAL(12,2),//原价
		defaultValue: 0
	},
	retailPrice: {
		type: Sequelize.DECIMAL(12,2),//零售价
		defaultValue: 0
	},
	supplyPrice: {
		type: Sequelize.DECIMAL(12,2),//供货价
		defaultValue: 0
	},
	commission: {
		type: Sequelize.DECIMAL(12,2),//佣金
		defaultValue: 0
	},
	maxStorage: {
		type: Sequelize.INTEGER,
		defaultValue: 0
	},
	validStorage: {
		type: Sequelize.INTEGER,
		defaultValue: 0
	},
	limitBuy: {
		type: Sequelize.INTEGER,
		defaultValue: 0
	},
	detail: {
		type: Sequelize.TEXT
	},
	imgPath: Sequelize.STRING(200),
	categoryId: {
		type: Sequelize.ENUM,
		values: ['1','2','3','4']
	},
	brandId: {
		type: Sequelize.STRING(50)
	},
	expressFee: {
		type: Sequelize.INTEGER,
		defaultValue: 0
	},
	saleState: {
		type: Sequelize.ENUM('0','1'),
		defaultValue: '0'
	},
	isDelete: {
		type: Sequelize.ENUM('0','1'),
		defaultValue: '0'
	},
	isRec: {
		type: Sequelize.ENUM('0','1'),
		defaultValue: '0'
	},
	isHot: {
		type: Sequelize.ENUM('0','1'),
		defaultValue: '0'
	},
	isTodaySpecial: {
		type: Sequelize.ENUM('0','1'),
		defaultValue: '0'
	},
	saleCount: {
		type: Sequelize.INTEGER,
		defaultValue: 0
	}
});

module.exports = Drink;