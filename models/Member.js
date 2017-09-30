const Sequelize = require('sequelize');
const crypto = require('../utils/crypto')
const Member = sequelize.define('member',{
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
	phone: {
		type: Sequelize.STRING(50),
		allowNull: false,
		unique: true
	},
	password: {
		type: Sequelize.STRING(100),
		allowNull: false,
		set(val) { //加密
			this.setDataValue('password',crypto.encrypt(val)) 
		}
	},
	name: {
		type: Sequelize.STRING(100),
	},
	nickname: {
		type: Sequelize.STRING(100),
	},
	sex: {
		type: Sequelize.ENUM,
		values: ['0','1','2'],
		defaultValue: '0'
	},
	headerImage: {
		type: Sequelize.STRING(250)
	},
	birthday: {
		type: Sequelize.BIGINT
	},
	points: {
		type: Sequelize.BIGINT,
		defaultValue: 0
	},
	useablePoints: {
		type: Sequelize.BIGINT,
		defaultValue: 0
	},
	wxtoken: {
		type: Sequelize.STRING(100),
		unique: true
	}
});

module.exports = Member;