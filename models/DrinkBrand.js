const Sequelize = require('sequelize');
const Drink = require('./Drink');
const DrinkBrand = sequelize.define('drinkBrand',{
	id: {
		type: Sequelize.UUID,
		primaryKey: true,
		defaultValue: Sequelize.UUIDV1
	},
	brandName: {
		type: Sequelize.STRING(200),
		allowNull: false
	},
	categoryId: {
		type: Sequelize.ENUM,
		values: ['1','2','3','4']
	},
	info: {
		type: Sequelize.STRING(300)
	},
	logo: {
		type: Sequelize.STRING(300)
	},
	state: {
		type: Sequelize.ENUM(0,1),
		defaultValue: 0
	},
});

module.exports = DrinkBrand;