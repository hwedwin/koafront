const Sequelize = require('sequelize');
const Drink = require('./Drink');
const DrinkForOrder = sequelize.define('drinkForOrder',{
	id: {
		type: Sequelize.UUID,
		primaryKey: true,
		defaultValue: Sequelize.UUIDV1
	},
	orderId: {
		type: Sequelize.STRING(50),
		allowNull: false
	},
	drinkId: {
		type: Sequelize.STRING(50),
		allowNull: false
	},
	nums: {
		type: Sequelize.INTEGER,
		defaultValue: 0
	},
	price: {
		type: Sequelize.DECIMAL(12,2),
		defaultValue: 0
	},
	discountTotal: {
		type: Sequelize.DECIMAL(12,2),
		defaultValue: 0
	}
});

DrinkForOrder.belongsTo(Drink,{
	foreignKey: 'drinkId',
	as: 'drink'
});

module.exports = DrinkForOrder;