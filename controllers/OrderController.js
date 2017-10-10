const CommonUtil = require('../utils/CommonUtil');
const respond = require('../utils/respond');
const paramsVerify = require('../utils/paramsVerify');
const Order = require('../models/Order');
const Drink = require('../models/Drink');
const IndexTopSpecialController = require('./IndexTopSpecialController');
const MemberRelationController = require('./MemberRelationController');
const DrinkForOrderController = require('./DrinkForOrderController');
const ConsigneeForOrderController = require('./ConsigneeForOrderController');
const ExpressForOrderController = require('./ExpressForOrderController');
//微信支付相关
const weixinPay = require('../core/weixinPay');

const OrderController = {
	// 用于创建注册为代理商的礼品订单
	createRegisterOrder: async function(memberId,agentId,consignee,t) {
		try{
        	//创建订单
			var order = await Order.create({
				memberId: memberId,
				progressState: 2,
				progressInfo: '待配货',
				code: CommonUtil.guid(),
				totalPrice: 400,
				orderTotalPrice: 400,
				orderTotalDiscount: 0,
				orderFrom: 'register',
				remarks: '用户注册订单',
				agentId: agentId,
				createdTimestamp: Date.now(),
				payInfo: '注册代理订单'
			}, {transaction: t});

			//创建订单收货人
			await ConsigneeForOrderController.create({
            	orderId: order.id,
            	consigneeName: consignee.consigneeName,
            	consigneeMobile: consignee.consigneeMobile,
            	province: consignee.province,
            	city: consignee.city,
            	county: consignee.county,
            	address: consignee.address
            },t);

			return order
		}catch(e) {
			throw new Error(e);
		}
	},

	create: async function(ctx) {
		var {totalPrice,agentId,remarks,goods,consignee} = ctx.request.body;
		/*var verifyData = [
			{
				name: 'memberId',
				type: paramsVerify.STRING,
				value: memberId,

			}
		]*/
		if (typeof consignee === 'string') {
			consignee = JSON.parse(consignee);
		}
		if (typeof goods === 'string') {
			goods = JSON.parse(goods)
		}
		var memberId = ctx.session.memberId;
		if (!memberId) {
			respond.json(ctx, false, '用户未登录或登录已过期，请重新登录');
			return false;
		}
		var drinkIds = [];
		for (var i = 0; i < goods.length; i++) {
			drinkIds.push(goods[i].id);
		}

		try{
			var totalPriceRetail = 0,totalPriceSupply = 0;
			//获取用户等级
			var memberLevel = await MemberRelationController.getMemberLevelById(memberId);
			// 获取店铺代理人等级
			var agentLevel = await MemberRelationController.getMemberLevelById(agentId);
			// 获取商品结果
			var drinkResult = await Drink.findAll({
				attributes: ['id','retailPrice','supplyPrice'],
				where: {
					id: {
						$in: drinkIds
					}
				}
			});
			// 处理特价商品
			for (var i = 0; i < drinkResult.length; i++) {
                await (async function(item){
                    var special = await IndexTopSpecialController.getOneById(item.id);
                    if (special) {
                    	item.supplyPrice = special.specialPriceAgent;
                    	item.retailPrice = special.specialPrice;
                    }
                })(drinkResult[i]);
            }
			//计算总价格
			for (var i = 0; i < drinkResult.length; i++) {
				var drink = drinkResult[i];
				for (var j = 0; j < goods.length; j++) {
					var gItem = goods[j];
					if (gItem.id === drink.id) {
						totalPriceSupply += gItem.nums * drink.supplyPrice;
						totalPriceRetail += gItem.nums * drink.retailPrice;
					}
				}
			}
			//
			if (memberLevel == 1 || memberLevel == 2) {
				if (totalPrice != totalPriceSupply) {
					respond.json(ctx,false,'价格计算有误',null,{memberLevel,totalPrice,totalPriceRetail,totalPriceSupply});
					return;
				}
			}else{
				if (totalPrice != totalPriceRetail) {
					respond.json(ctx,false,'价格计算有误',null,{memberLevel,totalPrice,totalPriceRetail,totalPriceSupply});
					return;
				}
			}

			//开启事务
            let orderData = await sequelize.transaction(async function(t) {

            	//创建订单
				var order = await Order.create({
					memberId: memberId,
					progressState: 1,
					progressInfo: '待付款',
					code: CommonUtil.guid(),
					totalPrice: totalPrice,
					orderTotalPrice: totalPrice,
					orderTotalDiscount: 0,
					orderFrom: 'wechat',
					remarks: remarks,
					agentId: agentId,
					createdTimestamp: Date.now()
				}, {transaction: t});

	            //创建订单包含的商品
				for (var i = 0; i < drinkResult.length; i++) {
					var drink = drinkResult[i];
					for (var j = 0; j < goods.length; j++) {
						var gItem = goods[j];
						if (gItem.id === drink.id) {
							await DrinkForOrderController.create({
				            	orderId: order.id,
				            	drinkId: drink.id,
				            	nums: gItem.nums,
				            	price: (memberLevel == 1 || memberLevel == 2) ? drink.supplyPrice : drink.retailPrice,
				            	discountTotal: 0
				            },t);
						}
					}
				}

				//创建订单收货人
				await ConsigneeForOrderController.create({
	            	orderId: order.id,
	            	consigneeName: consignee.consigneeName,
	            	consigneeMobile: consignee.consigneeMobile,
	            	province: consignee.province,
	            	city: consignee.city,
	            	county: consignee.county,
	            	address: consignee.address
	            },t);

	            return order;
            });
			respond.json(ctx,true,'订单创建成功',{orderId:orderData.id});
		}catch(e) {
			respond.json(ctx,false,'订单创建失败',null,e);
		}
	},

	//支付
	payOrder: async function(ctx) {
		var memberId = ctx.session.memberId;
		if (!memberId) {
			respond.json(ctx, false, '用户未登录或登录已过期，请重新登录',{code: 203});
			return false;
		}
		var {id} = ctx.request.body;
		try{
			// 查询订单详情
			var orderDetail = await Order.findOne({
				where: {
					id
				}
			});
			if (!orderDetail || orderDetail.progressState != '1') {
				respond.json(ctx,false,'订单不存在或已支付');
				return;
			}
			var totalPrice = orderDetail.totalPrice;
			var payInfo = orderDetail.payInfo;
			console.log('openid:'+ctx.session.openid);
			//创建微信订单
			var wxOrder = await weixinPay.createUniOrder(ctx.session.openid,id,0.01,payInfo,ctx.ip,'http://baebae.cn/api/order/paynotify');
			respond.json(ctx,true,'微信支付订单创建成功',wxOrder);
		}catch(e){
			respond.json(ctx,false,'微信支付订单创建失败',null,e);
		}
	},

	// 支付回调
	payNotify: async function(ctx) {
		// await OrderController.changeOrderState(memberId,2,id);
	},

	// 签收
	signOrder: async function(ctx) {
		var memberId = ctx.session.memberId;
		if (!memberId) {
			respond.json(ctx, false, '用户未登录或登录已过期，请重新登录',{code: 203});
			return false;
		}
		var {id} = ctx.request.body;
		try{
			await OrderController.changeOrderState(memberId,6,id);
			respond.json(ctx,true,'订单签收成功');
		}catch(e){
			respond.json(ctx,false,'订单签收失败',null,e);
		}
	},

	// 退款申请
	backOrder: async function(ctx) {
		var memberId = ctx.session.memberId;
		if (!memberId) {
			respond.json(ctx, false, '用户未登录或登录已过期，请重新登录',{code: 203});
			return false;
		}
		var {id} = ctx.request.body;
		try{
			await OrderController.changeOrderState(memberId,5,id);
			respond.json(ctx,true,'申请退款成功');
		}catch(e){
			respond.json(ctx,false,'申请退款失败',null,e);
		}
	},

	// 已退款
	backedOrder: async function(ctx) {
		var memberId = ctx.session.memberId;
		if (!memberId) {
			respond.json(ctx, false, '用户未登录或登录已过期，请重新登录',{code: 203});
			return false;
		}
		var {id} = ctx.request.body;
		try{
			await OrderController.changeOrderState(memberId,7,id);
			respond.json(ctx,true,'退款成功');
		}catch(e){
			respond.json(ctx,false,'退款失败',null,e);
		}
	},

	// 取消订单
	cancleOrder: async function(ctx) {
		var memberId = ctx.session.memberId;
		if (!memberId) {
			respond.json(ctx, false, '用户未登录或登录已过期，请重新登录',{code: 203});
			return false;
		}
		var {id} = ctx.request.body;
		try{
			await OrderController.changeOrderState(memberId,8,id);
			respond.json(ctx,true,'订单取消成功');
		}catch(e){
			respond.json(ctx,false,'退款取消失败',null,e);
		}
	},

	/**
	 * 改变订单状态
	 * @Author   KuangGuanghu
	 * @DateTime 2017-08-13
	 * @param    {Number}     stateIndex [订单状态]
	 * @param    {String}     id         [订单id]
	 */
	changeOrderState: async function(memberId,stateIndex,id) {
		var state = OrderController.getProgressState(stateIndex-1);
		try{
			var result = await Order.update({
				progressState: state.state,
				progressInfo: state.info,	
			},{
				where: {
					memberId,
					id
				}
			});
			return result;
		}catch(e){
			throw new Error(e);
		}
	},

	deleteOrder: async function(ctx) {
		var memberId = ctx.session.memberId;
		if (!memberId) {
			respond.json(ctx, false, '用户未登录或登录已过期，请重新登录',{code: 203});
			return false;
		}
		var {id} = ctx.request.body;
		try{
			await Order.update({
				isDeleted: 1	
			},{
				where: {
					memberId,
					id
				}
			});
			respond.json(ctx,true,'订单删除成功');
		}catch(e){
			respond.json(ctx,false,'退款删除失败',null,e);
		}
	},

	list: async function(ctx) {
		var memberId = ctx.session.memberId;
		if (!memberId) {
			respond.json(ctx, false, '用户未登录或登录已过期，请重新登录',{code: 203});
			return false;
		}
		var {state} = ctx.request.body;
		var query = {memberId,isDeleted: 0};
		if (state && ["1","2","3","4","5","9","19","99"].indexOf(state) > -1) {
			query.progressState = state;
		}
		try{
			var results = await Order.findAll({
				where: query
			});
			for (var i = 0; i < results.length; i++) {
				await (async function(item){
					var drinks = await DrinkForOrderController.getByOrderId(item.id);
					item.dataValues.drinks = drinks;
				})(results[i]);
			}
			respond.json(ctx, true, '获取订单成功',{code: 200,data: results});
		}catch(e) {
			respond.json(ctx, false, '获取订单失败');
		}
	},

	// 获取订单详情
	getOneById: async function(ctx) {
		var memberId = ctx.session.memberId;
		if (!memberId) {
			respond.json(ctx, false, '用户未登录或登录已过期，请重新登录',{code: 203});
			return false;
		}
		var {id} = ctx.request.body;
		try{
			var result = await Order.findOne({
				where: {
					id
				}
			});
			var drinks = await DrinkForOrderController.getByOrderId(result.id);
			var consignee = await ConsigneeForOrderController.getByOrderId(result.id);
			result.dataValues.drinks = drinks;
			result.dataValues.consignee = consignee;
			respond.json(ctx, true, '获取订单详情成功',{code: 200,data: result});
		}catch(e) {
			respond.json(ctx, false, '获取订单详情失败');
		}
	},

	getCountByState: async function(ctx) {
		var memberId = ctx.session.memberId;
		if (!memberId) {
			respond.json(ctx, false, '用户未登录或登录已过期，请重新登录',{code: 203});
			return false;
		}
		var {state} = ctx.request.body;
		var query = {
			memberId,
			isDeleted: 0
		};
		if (state) {
			query.progressState = state;
		}
		try{
			var result = await Order.findAndCountAll({
				where: query
			});
			respond.json(ctx, true, '获取订单数量成功',{code: 200,data: {count: result.count}});
		}catch(e) {
			respond.json(ctx, false, '获取订单数量失败');
		}
	},

	getProgressState: function(idx) {
		// 1待付款,2待配货, 3发货中,4待签收,5待退款,9交易成功,19:已退款,99:交易取消
		var states = [
			{
				state: 1,
				info: '待付款'
			},
			{
				state: 2,
				info: '待配货'
			},
			{
				state: 3,
				info: '发货中'
			},
			{
				state: 4,
				info: '待签收'
			},
			{
				state: 5,
				info: '待退款'
			},
			{
				state: 9,
				info: '交易成功'
			},
			{
				state: 19,
				info: '已退款'
			},
			{
				state: 99,
				info: '交易取消'
			},
		]
		return states[idx];
	}

}

module.exports = OrderController