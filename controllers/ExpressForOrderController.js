const ExpressForOrder = require('../models/ExpressForOrder')

const ExpressForOrderController = {
	create: async function(option) {
		var {orderId,expressName,expressPhone,expressCode,expressInfo} = ctx.request.body;
		// orderId,consigneeName,consigneeMobile,expressTimeType,province,city,county,address
		try{
			await ExpressForOrder.create(option);
		} catch(e){
			throw new Error(e);
		}
	}
}

module.exports = ExpressForOrderController;