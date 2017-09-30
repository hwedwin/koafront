const Sequelize = require('sequelize');
const Consignee = sequelize.define('consignee',{
	id: {
		type: Sequelize.UUID,
		primaryKey: true,
		defaultValue: Sequelize.UUIDV1
	},
	memberId: {
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
	isDefault: {
		type: Sequelize.ENUM('0', '1'), //0:非默认，1:默认收货地址
		allowNull: false,
		defaultValueL: '0'
	},
});

module.exports = Consignee;