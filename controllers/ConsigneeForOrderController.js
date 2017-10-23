const ConsigneeForOrderController = {
	create: async function(option,t) {
		// orderId,consigneeName,consigneeMobile,expressTimeType,province,city,county,address
		try{
			return await ConsigneeForOrder.create(option, {transaction: t});
		} catch(e){
			return e;
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

const ConsigneeForOrder = require('../models/ConsigneeForOrder');
