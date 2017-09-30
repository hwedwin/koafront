const Sequelize = require('sequelize');
const MemberBalance = sequelize.define('memberBalance',{
	id: {
		type: Sequelize.UUID,
		primaryKey: true,
		defaultValue: Sequelize.UUIDV1
	},
	memberId: {
		type: Sequelize.STRING(50),
		allowNull: false
	},
	balance: {
		type: Sequelize.DECIMAL(12,2),
		defaultValue: 0
	}
});

module.exports = MemberBalance;