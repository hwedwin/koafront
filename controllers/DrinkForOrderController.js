const DrinkForOrder = require('../models/DrinkForOrder');
const Drink = require('../models/Drink');

const DrinkForOrderController = {
	create: async function(option,t) {
		// orderId,drinkId,nums,price,discountTotal
		try{
			await DrinkForOrder.create(option, {transaction: t});
		} catch(e){
			throw new Error(e);
		}
	},

	getOne: async function(id) {
		try{
			var result = await DrinkForOrder.findOne({
				where: {
					id
				},
				include: [
					{
						model: Drink,
						as: 'drink'
					}
				]
			});
			return result;
		} catch(e){
			throw new Error(e);
		}
	},

	getByOrderId: async function(orderId,allAttr) {
		var includeModel = {
			attributes: ['id','imgPath','name'],
			model: Drink,
			as: 'drink'
		};
		if (allAttr) {
			delete includeModel.attributes;
		}
		try{
			var result = await DrinkForOrder.findAll({
				where: {
					orderId
				},
				include: [includeModel]
			});
			return result;
		} catch(e){
			throw new Error(e);
		}
	}
}

module.exports = DrinkForOrderController;