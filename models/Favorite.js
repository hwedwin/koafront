const Sequelize = require('sequelize');
const Drink = require('./Drink');
const Favorite = sequelize.define('favorite',{
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
});

Favorite.belongsTo(Drink,{
	foreignKey: 'drinkId',
	as: 'drink'
});

module.exports = Favorite;