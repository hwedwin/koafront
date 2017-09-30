const Sequelize = require('sequelize');
const IndexTopAdv = sequelize.define('indexTopAdv',{
	id: {
		type: Sequelize.UUID,
		primaryKey: true,
		defaultValue: Sequelize.UUIDV1
	},
	drinkId: {
		type: Sequelize.STRING(50),
		allowNull: false
	},
	href: {
		type: Sequelize.STRING(200),
	},
	imgPath: {
		type: Sequelize.STRING(200),
	},
	isShow: {
		type: Sequelize.ENUM('0','1'),
		defaultValue: '0'
	},
});

module.exports = IndexTopAdv;