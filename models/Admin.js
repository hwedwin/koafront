const Sequelize = require('sequelize');
const crypto = require('../utils/crypto')
const Admin = sequelize.define('admin',{
	id: {
		type: Sequelize.UUID,
		primaryKey: true,
		defaultValue: Sequelize.UUIDV1
	},
	account: {
		type: Sequelize.STRING(100),
		allowNull: false,
		unique: true
	},
	password: {
		type: Sequelize.STRING(100),
		allowNull: false,
		set(val) { //加密
			this.setDataValue('password',crypto.encrypt(val)) 
		},
		// get() { //解密
		// 	return crypto.decode(this.getDataValue('password'))
		// }
	},
	role: Sequelize.ENUM('0', '1'), //0:超级管理员，1:普通管理员
	state: Sequelize.ENUM('0', '1') //0:冻结，1:正常
});

module.exports = Admin;