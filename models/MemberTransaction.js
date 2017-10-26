const Sequelize = require('sequelize');
const moment = require('moment');
const MemberTransaction = sequelize.define('memberTransactions',{
	id: {
		type: Sequelize.UUID,
		primaryKey: true,
		defaultValue: Sequelize.UUIDV1
	},
	memberId: {
		type: Sequelize.STRING(50),
		allowNull: false
	},
	money: {
		type: Sequelize.DECIMAL(12,2),
		defaultValue: 0
	},
	type:{
		type: Sequelize.STRING(4)
	},
	orderId:{
		type: Sequelize.STRING(50),
	},
	cId:{
		type: Sequelize.STRING(50)
	},
	createdAt: {
	    type: Sequelize.DATE,
	    get() {
	        return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
	    }
	},
	updatedAt: {
	    type: Sequelize.DATE,
	    get() {
	        return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss');
	    }
	}
});

module.exports = MemberTransaction;