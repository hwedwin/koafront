const Sequelize = require('sequelize');
const ConsigneeForOrder = sequelize.define('consigneeForOrder',{
	id: {
		type: Sequelize.UUID,
		primaryKey: true,
		defaultValue: Sequelize.UUIDV1
	},
	orderId: {
		type: Sequelize.STRING(50),
		allowNull: false
	},
	consigneeName: {
		type: Sequelize.STRING(100),
		allowNull: false
	},
	consigneeMobile: {
		type: Sequelize.STRING(50),
		allowNull: false
	},
	expressTimeType: {
		type: Sequelize.STRING(100)
	},
	province: {
		type: Sequelize.STRING(100),
		allowNull: false
	},
	city: {
		type: Sequelize.STRING(100),
		allowNull: false
	},
	county: {
		type: Sequelize.STRING(100),
		allowNull: false
	},
	address: {
		type: Sequelize.STRING(500),
		allowNull: false
	},
});

module.exports = ConsigneeForOrder;