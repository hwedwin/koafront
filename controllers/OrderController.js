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
const MemberBalanceController = require('./MemberBalanceController');
//微信支付相关
const WeixinPay = require('../core/weixinPay');

const OrderController = {
    // 用于创建注册为代理商的礼品订单
    createRegisterOrder: async function(memberId, agentId, consignee, t) {
        try {
            //创建订单
            var order = await Order.create({
                memberId: memberId,
                progressState: 2,
                progressInfo: '待配货',
                code: consignee.mobile,
                totalPrice: 400,
                orderTotalPrice: 400,
                orderTotalDiscount: 0,
                orderFrom: 'weixin',
                remarks: '用户注册订单',
                agentId: agentId,
                createdTimestamp: Date.now(),
                payInfo: '注册代理商订单',
                payCode: 'weixin'
            }, { transaction: t });

            //创建订单收货人
            await ConsigneeForOrderController.create({
                orderId: order.id,
                consigneeName: consignee.consigneeName,
                consigneeMobile: consignee.consigneeMobile,
                province: consignee.province,
                city: consignee.city,
                county: consignee.county,
                address: consignee.address
            }, t);

            return order
        } catch (e) {
            throw new Error(e);
        }
    },

    create: async function(ctx) {
        var { totalPrice, agentId, remarks, goods, consignee } = ctx.request.body;
        agentId = agentId ? agentId : 'top';
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

        try {
            var totalPriceRetail = 0,
                totalPriceSupply = 0;
            //获取用户等级
            var memberLevel = await MemberRelationController.getMemberLevelById(memberId);
            // 获取店铺代理人等级
            var agentLevel = 3;
            if (agentId != 'top') {
                agentLevel = await MemberRelationController.getMemberLevelById(agentId);
            }
            // 获取商品结果
            var drinkResult = await Drink.findAll({
                attributes: ['id', 'retailPrice', 'supplyPrice'],
                where: {
                    id: {
                        $in: drinkIds
                    }
                }
            });
            // 处理特价商品
            for (var i = 0; i < drinkResult.length; i++) {
                await (async function(item) {
                    var special = await IndexTopSpecialController.getOneById(item.id);
                    if (special) {
                        item.supplyPrice = special.specialPriceAgent;
                        item.retailPrice = special.specialPrice;
                    }
                })(drinkResult[i]);
            }
            //计算总价格,生成订单信息
            var payInfo = '';
            for (var i = 0; i < drinkResult.length; i++) {
                var drink = drinkResult[i];
                payInfo += drink.name+',';
                for (var j = 0; j < goods.length; j++) {
                    var gItem = goods[j];
                    if (gItem.id === drink.id) {
                        totalPriceSupply += gItem.nums * drink.supplyPrice;
                        totalPriceRetail += gItem.nums * drink.retailPrice;
                    }
                }
            }

            //
            // if (memberLevel == 1 || memberLevel == 2) {
            //     if (totalPrice != totalPriceSupply) {
            //         respond.json(ctx, false, '价格计算有误', null, { memberLevel, totalPrice, totalPriceRetail, totalPriceSupply });
            //         return;
            //     }
            // } else {
                if (totalPrice != totalPriceRetail) {
                    respond.json(ctx, false, '价格计算有误', null, { memberLevel, totalPrice, totalPriceRetail, totalPriceSupply });
                    return;
                }
            // }

            //开启事务
            let orderData = await sequelize.transaction(async function(t) {
                // 如果代理人等级为3，则将代理人设为top
                if (agentLevel != 1 || agentLevel != 2) {
                    agentId = 'top';
                }
                //创建订单
                var order = await Order.create({
                    memberId: memberId,
                    progressState: 1,
                    progressInfo: '待付款',
                    code: CommonUtil.createOrderCode(),
                    totalPrice: totalPrice,
                    orderTotalPrice: totalPrice,
                    orderTotalDiscount: 0,
                    orderFrom: 'wechat',
                    remarks: remarks,
                    agentId: agentId,
                    payInfo: payInfo,
                    createdTimestamp: Date.now()
                }, { transaction: t });

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
                            }, t);
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
                }, t);

                return order;
            });
            respond.json(ctx, true, '订单创建成功', { orderId: orderData.id });
        } catch (e) {
            respond.json(ctx, false, '订单创建失败', null, e);
        }
    },

    //支付
    payOrder: async function(ctx) {
        var memberId = ctx.session.memberId;
        if (!ctx.session.openid) {
            respond.json(ctx, false, '未获得用户openid', { code: 203 });
            return false;
        }
        if (!memberId) {
            respond.json(ctx, false, '用户未登录或登录已过期，请重新登录', { code: 203 });
            return false;
        }
        var { id } = ctx.request.body;
        try {
            // 查询订单详情
            var orderDetail = await Order.findOne({
                where: {
                    id
                }
            });
            if (!orderDetail || orderDetail.progressState != 1) {
                respond.json(ctx, false, '无此订单货订单状态错误');
            }
            var wxpay = new WeixinPay();
            var wxOrder = await wxpay.createWCPayOrder({
                openid: ctx.session.openid,
                body: orderDetail.payInfo || '购买商品',
                detail: orderDetail.payInfo || '购买商品',
                out_trade_no: orderDetail.code, //内部订单号
                total_fee: 1,
                spbill_create_ip: ctx.ip,
                notify_url: 'http://baebae.cn/api/order/paynotify'
            });
            respond.json(ctx, true, '微信支付订单创建成功', wxOrder);
        } catch (e) {
            respond.json(ctx, false, '微信支付订单创建失败', null, e);
        }
    },

    // 支付回调
    payNotify: async function(ctx) {
        var body = ctx.request.body;
        console.log(body);
        if (body.return_code == 'SUCCESS' && body.result_code == 'SUCCESS') {
            // 更新订单状态
            var order = await Order.update({
                progressState: 2,
                progressInfo: '待配货',
                paidCode: 'weixin'
            }, {
                where: {
                    code: body.out_trade_no
                }
            });
            if (!order) {
                return;
            }
            // 处理交易等操作
            await OrderController.handleOrderSuccess(order.id);
        }
        var message = '<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>';
        ctx.body = message;
    },

    handleOrderSuccess: async function(orderId) {
        try {
            var order = await Order.findOne({
                where: {
                    id: orderId
                }
            });
            if (!order) {
                return;
            }
            var agentId1 = order.agentId;
            var memberId = order.memberId;
            var commision = 0; //佣金,给一级经销商的返利（在二级经销商购买，一级获得返利。在一级经销商购买，无佣金）
            var agentProfit = 0; //代理商获取的利润，
            var profit = 0; //总利润 普通消费者：零售价-成本，代理商：零售价-供货价
            var drinks = await DrinkForOrderController.getByOrderId(result.id);

            // 1.增加top余额，
            // 2.直接代理商获取利润
            // 3.(代理商上级获取佣金)
            // 4.写top交易记录
            // 5.直接代理商交易记录
            // 6.(代理商上级交易记录）
            // 7.用户交易记录
        } catch (e) {

        }
    },

    payByBalance: async function(ctx) {
        var memberId = ctx.session.memberId;
        if (!memberId) {
            respond.json(ctx, false, '用户未登录或登录已过期，请重新登录', { code: 203 });
            return false;
        }
        var { id } = ctx.request.body;
        try {
            // 查询订单详情
            var orderDetail = await Order.findOne({
                where: {
                    id
                }
            });

            // 查询用户余额
            var mBalance = await MemberBalanceController.getBalance(memberId);
            var balance = parseFloat(mBalance.balance);
            var orderMoney = parseFloat(orderDetail.orderTotalPrice);
            if (balance < orderMoney) {
                respond.json(ctx, false, '余额不足以支付这笔订单');
                return;
            }
            // 开启事务
            await sequelize.transaction(async function(t) {
                // 改变用户余额
                await MemberBalanceController.changeBanlance(memberId, -orderMoney, t);
                // 修改订单状态
                let order = await Order.update({
                	progressState: 2,
                	progressInfo: '待配货',
                	paidCode: 'balance'
            	}, {
            		where: {
            			id
            		},
            		transaction: t
            	});

            	return order;
            });
            // 交易记录等操作
            await OrderController.handleOrderSuccess(id);
            respond.json(ctx, true, '支付成功', { orderId: id, money: orderMoney });
        } catch (e) {
            respond.json(ctx, false, '支付失败', null, e);
        }
    },

    // 签收
    signOrder: async function(ctx) {
        var memberId = ctx.session.memberId;
        if (!memberId) {
            respond.json(ctx, false, '用户未登录或登录已过期，请重新登录', { code: 203 });
            return false;
        }
        var { id } = ctx.request.body;
        try {
            await OrderController.changeOrderState(memberId, 6, id);
            respond.json(ctx, true, '订单签收成功');
        } catch (e) {
            respond.json(ctx, false, '订单签收失败', null, e);
        }
    },

    // 退款申请
    backOrder: async function(ctx) {
        var memberId = ctx.session.memberId;
        if (!memberId) {
            respond.json(ctx, false, '用户未登录或登录已过期，请重新登录', { code: 203 });
            return false;
        }
        var { id } = ctx.request.body;
        try {
            await OrderController.changeOrderState(memberId, 5, id);
            respond.json(ctx, true, '申请退款成功');
        } catch (e) {
            respond.json(ctx, false, '申请退款失败', null, e);
        }
    },

    // 已退款
    backedOrder: async function(ctx) {
        var memberId = ctx.session.memberId;
        if (!memberId) {
            respond.json(ctx, false, '用户未登录或登录已过期，请重新登录', { code: 203 });
            return false;
        }
        var { id } = ctx.request.body;
        try {
            await OrderController.changeOrderState(memberId, 7, id);
            respond.json(ctx, true, '退款成功');
        } catch (e) {
            respond.json(ctx, false, '退款失败', null, e);
        }
    },

    // 取消订单
    cancleOrder: async function(ctx) {
        var memberId = ctx.session.memberId;
        if (!memberId) {
            respond.json(ctx, false, '用户未登录或登录已过期，请重新登录', { code: 203 });
            return false;
        }
        var { id } = ctx.request.body;
        try {
            await OrderController.changeOrderState(memberId, 8, id);
            respond.json(ctx, true, '订单取消成功');
        } catch (e) {
            respond.json(ctx, false, '退款取消失败', null, e);
        }
    },

    /**
     * 改变订单状态
     * @Author   KuangGuanghu
     * @DateTime 2017-08-13
     * @param    {Number}     stateIndex [订单状态]
     * @param    {String}     id         [订单id]
     */
    changeOrderState: async function(memberId, stateIndex, id, t) {
        var state = OrderController.getProgressState(stateIndex - 1);
        var query = {
            where: {
                memberId,
                id
            }
        };
        if (t) {
            query.transaction = t;
        }
        try {
            var result = await Order.update({
                progressState: state.state,
                progressInfo: state.info,
            }, query);
            return result;
        } catch (e) {
            throw new Error(e);
        }
    },

    deleteOrder: async function(ctx) {
        var memberId = ctx.session.memberId;
        if (!memberId) {
            respond.json(ctx, false, '用户未登录或登录已过期，请重新登录', { code: 203 });
            return false;
        }
        var { id } = ctx.request.body;
        try {
            await Order.update({
                isDeleted: 1
            }, {
                where: {
                    memberId,
                    id
                }
            });
            respond.json(ctx, true, '订单删除成功');
        } catch (e) {
            respond.json(ctx, false, '退款删除失败', null, e);
        }
    },

    list: async function(ctx) {
        var memberId = ctx.session.memberId;
        if (!memberId) {
            respond.json(ctx, false, '用户未登录或登录已过期，请重新登录', { code: 203 });
            return false;
        }
        var { state } = ctx.request.body;
        var query = { memberId, isDeleted: 0 };
        if (!state) {
            query.$or = {
                progressState: {
                    $ne: 1
                },
                $and: {
                    progressState: 1,
                    createdTimestamp: {
                        $gt: Date.now() - 24*60*60*1000*1
                    }
                }
            };
        }else if(["1", "2", "3", "4", "5", "9", "19", "99"].indexOf(state) > -1){
            query.progressState = state;
            // 过滤超过时间未支付的订单,天
            if(state == 1){
                query.createdTimestamp = {
                    $gt: Date.now() - 24*60*60*1000*1
                };
            }
        }
        try {
            var results = await Order.findAll({
                where: query
            });
            for (var i = 0; i < results.length; i++) {
                await (async function(item) {
                    var drinks = await DrinkForOrderController.getByOrderId(item.id);
                    item.dataValues.drinks = drinks;
                })(results[i]);
            }
            respond.json(ctx, true, '获取订单成功', { code: 200, data: results });
        } catch (e) {
            respond.json(ctx, false, '获取订单失败');
        }
    },

    // 获取订单详情
    getOneById: async function(ctx) {
        var memberId = ctx.session.memberId;
        if (!memberId) {
            respond.json(ctx, false, '用户未登录或登录已过期，请重新登录', { code: 203 });
            return false;
        }
        var { id } = ctx.request.body;
        try {
            var result = await Order.findOne({
                where: {
                    id
                }
            });
            var drinks = await DrinkForOrderController.getByOrderId(result.id);
            var consignee = await ConsigneeForOrderController.getByOrderId(result.id);
            result.dataValues.drinks = drinks;
            result.dataValues.consignee = consignee;
            respond.json(ctx, true, '获取订单详情成功', { code: 200, data: result });
        } catch (e) {
            respond.json(ctx, false, '获取订单详情失败');
        }
    },

    getCountByState: async function(ctx) {
        var memberId = ctx.session.memberId;
        if (!memberId) {
            respond.json(ctx, false, '用户未登录或登录已过期，请重新登录', { code: 203 });
            return false;
        }
        var { state } = ctx.request.body;
        var query = {
            memberId,
            isDeleted: 0
        };
        if (state) {
            query.progressState = state;
            if (state == 1) {
                query.createdTimestamp = {
                    $gt: Date.now() - 24*60*60*1000*1
                };
            }
        }
        try {
            var result = await Order.findAndCountAll({
                where: query
            });
            respond.json(ctx, true, '获取订单数量成功', { code: 200, data: { count: result.count } });
        } catch (e) {
            respond.json(ctx, false, '获取订单数量失败');
        }
    },

    getProgressState: function(idx) {
        // 1待付款,2待配货, 3发货中,4待签收,5待退款,9交易成功,19:已退款,99:交易取消
        var states = [{
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