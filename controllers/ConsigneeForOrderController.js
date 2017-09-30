const ConsigneeForOrder = require('../models/ConsigneeForOrder')

const ConsigneeForOrderController = {
	create: async function(option,t) {
		// orderId,consigneeName,consigneeMobile,expressTimeType,province,city,county,address
		try{
			await ConsigneeForOrder.create(option, {transaction: t});
		} catch(e){
			throw new Error(e);
		}
	},

	getByOrderId: async function(orderId) {
		try{
			var result = await ConsigneeForOrder.findOne({
				where: {
					orderId
				}
			});
			return result;
		} catch(e){
			throw new Error(e);
		}
	}
}

module.exports = ConsigneeForOrderController;