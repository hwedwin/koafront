const Sequelize = require('sequelize');
const crypto = require('../utils/crypto')
const Member = require('./Member');
const MemberRelation = sequelize.define('memberRelation',{
	id: {
		type: Sequelize.UUID,
		primaryKey: true,
		defaultValue: Sequelize.UUIDV1
	},
	fxLevel: {
		type: Sequelize.ENUM('1', '2', '3'),//3为普通会员
		defaultValue: '1'
	},
	pid: {
		type: Sequelize.STRING(50),
	},
	cid: {
		type: Sequelize.STRING(50),
	}
});

MemberRelation.belongsTo(Member,{
	foreignKey: 'cid',
	as: 'member'
});

module.exports = MemberRelation;