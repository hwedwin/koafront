const Sequelize = require('sequelize');
const Order = sequelize.define('order',{
	id: {
		type: Sequelize.UUID,
		primaryKey: true,
		defaultValue: Sequelize.UUIDV1
	},
	memberId: {
		type: Sequelize.STRING(50),
		allowNull: false
	},
	progressState: {
		type: Sequelize.STRING(4),//订单处理状态 ,1待付款,2待配货, 3发货中,4待签收,5待退款,9交易成功,19:已退款,99:交易取消
	},
	progressInfo: {
		type: Sequelize.STRING(100),
	},
	code: {
		type: Sequelize.STRING(100),
		allowNull: false
	},
	payInfo: {
		type: Sequelize.STRING(100)//付款详情
	},
	totalPrice: {
		type: Sequelize.DECIMAL(12,2),
		allowNull: false,
	},
	expressFee: {
		type: Sequelize.INTEGER,
		allowNull: false,
		defaultValue: 0
	},
	orderTotalPrice: {
		type: Sequelize.DECIMAL(12,2),
		allowNull: false
	},
	orderTotalDiscount: {
		type: Sequelize.DECIMAL(12,2),
		allowNull: false
	},
	paidCode: {
		type: Sequelize.STRING(100),//支付方式
	},
	orderImage: {
		type: Sequelize.STRING(200),
	},
	orderFrom: {
		type: Sequelize.STRING(50),
	},
	isDeleted: {
		type: Sequelize.ENUM('0', '1'),
		defaultValue: '0'
	},
	remarks: {
		type: Sequelize.STRING(255),
		allowNull: false
	},
	agentId: {
		type: Sequelize.STRING(50),
	},
	hasChecked: {
		type: Sequelize.DATE
	},
	createdTimestamp: {
		type: Sequelize.INTEGER
	}
});

module.exports = Order;