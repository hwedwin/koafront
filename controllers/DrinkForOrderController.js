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

	getByOrderId: async function(orderId) {
		try{
			var result = await DrinkForOrder.findAll({
				where: {
					orderId
				},
				include: [
					{
						attributes: ['id','imgPath','name'],
						model: Drink,
						as: 'drink'
					}
				]
			});
			return result;
		} catch(e){
			throw new Error(e);
		}
	}
}

module.exports = DrinkForOrderController;