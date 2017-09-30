const Sequelize = require('sequelize');
const DrinkImage = sequelize.define('drinkImage',{
	id: {
		type: Sequelize.UUID,
		primaryKey: true,
		defaultValue: Sequelize.UUIDV1
	},
	imgPath: {
		type: Sequelize.STRING(200)
	},
	drinkId: {
		type: Sequelize.STRING(50)
	},
});

module.exports = DrinkImage;