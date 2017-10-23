const ExpressForOrderController = {
	create: async function(option) {
		var {orderId,expressName,expressPhone,expressCode,expressInfo} = ctx.request.body;
		// orderId,consigneeName,consigneeMobile,expressTimeType,province,city,county,address
		try{
			await ExpressForOrder.create(option);
		} catch(e){
			throw new Error(e);
		}
	},

	getOneByOrderId: async function(ctx) {
		var {orderId} = ctx.request.body;
		try{
			var result = await ExpressForOrder.findOne({
				where: {
					orderId
				}
			});
			if (!result) {
				respond.json(ctx, false, '本订单暂无物流信息');
			}
			respond.json(ctx, true, '获取物流信息成功', result);
		}catch(e){
			respond.json(ctx, false, '获取物流信息失败', null,e);
		}
	}
}
module.exports = ExpressForOrderController;

const ExpressForOrder = require('../models/ExpressForOrder');
const respond = require('../utils/respond');