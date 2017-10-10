const Sequelize = require('sequelize');
const Drink = require('./Drink');
const ShopCart = sequelize.define('shopCart',{
	id: {
		type: Sequelize.UUID,
		primaryKey: true,
		defaultValue: Sequelize.UUIDV1
	},
	memberId: {
		type: Sequelize.STRING(50),
		allowNull: false
	},
	drinkId: {
		type: Sequelize.STRING(50),
		allowNull: false
	},
	nums: {
		type: Sequelize.INTEGER,
		allowNull: false
	}
});

ShopCart.belongsTo(Drink,{
	foreignKey: 'drinkId',
	as: 'cart'
});

module.exports = ShopCart;