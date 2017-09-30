const Sequelize = require('sequelize');
const Drink = require('./Drink');
const IndexTopSpecial = sequelize.define('indexTopSpecial',{
	id: {
		type: Sequelize.UUID,
		primaryKey: true,
		defaultValue: Sequelize.UUIDV1
	},
	drinkId: {
		type: Sequelize.STRING(50),
		allowNull: false
	},
	timeChunk: {
		type: Sequelize.STRING(50),
		allowNull: false
	},
	isShow: {
		type: Sequelize.ENUM('0','1'),
		defaultValue: '0'
	},
	isDelete: {
		type: Sequelize.ENUM('0','1'),
		defaultValue: '0'
	},
	specialPrice: {
		type: Sequelize.DECIMAL(12,2),
		defaultValue: 0
	},
	startTime: {
		type: Sequelize.INTEGER
	},
	endTime: {
		type: Sequelize.INTEGER
	},
});

IndexTopSpecial.belongsTo(Drink,{
	foreignKey: 'drinkId',
	as: 'drink'
});

module.exports = IndexTopSpecial;