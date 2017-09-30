const Sequelize = require('sequelize');
const ExpressForOrder = sequelize.define('expressForOrder',{
	id: {
		type: Sequelize.UUID,
		primaryKey: true,
		defaultValue: Sequelize.UUIDV1
	},
	orderId: {
		type: Sequelize.STRING(50),
		allowNull: false
	},
	expressName: {
		type: Sequelize.STRING(100),
		allowNull: false
	},
	expressPhone: {
		type: Sequelize.STRING(100),
		allowNull: false
	},
	expressAliasesName: {
		type: Sequelize.STRING(100)
	},
	expressCode: {
		type: Sequelize.STRING(100)
	},
	expressStatus: {
		type: Sequelize.ENUM('0', '1'),
		defaultValue: '0'
	},
	expressInfo: {
		type: Sequelize.TEXT,
	},
});

module.exports = ExpressForOrder;