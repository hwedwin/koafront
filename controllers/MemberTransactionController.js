/**
 * 创建交易信息
 * 收支类型：
 * 1（下级经销商注册收入），
 * 2（销售所得收入），
 * 3（销售所得佣金收入），
 * 4（购买商品支出），
 * 5（购买商品余额支出），
 * 6（注册经销商支出）,
 * 7（提现支出）,
 * memberId,money,type,orderId,cId
 * @Author   KuangGuanghu
 * @DateTime 2017-08-17
 */
const respond = require('../utils/respond')
const MemberTransaction = require('../models/MemberTransaction')

const MemberTransactionController = {
    create: async function(memberId,money,type,orderId,cId,t) {
        var transactionO = {};
        if (t) {
            transactionO.transaction = t;
        }
        if (!memberId) {
            throw new Error('用户ID不能为空');
        }
        var info = {memberId,money,type,orderId,cId};
        try{
            var result = await MemberTransaction.create(info, transactionO);
            return result;
        }catch(e){
            return e;
        }
    },

    //通过下级经销商注册获得收入
    incomeByRegister: async function(memberId,income,cId,t) {
        var result = await MemberTransactionController.create(memberId,income,1,null,cId,t);
        return result;
    },

    // 通过销售获得收入
    incomeBySale: async function(memberId,income,orderId,t) {
        var result = await MemberTransactionController.create(memberId,income,2,orderId,null,t);
        return result;
    },

    // 通过佣金获得收入
    incomeByCommission: async function(memberId,income,orderId,t) {
        var result = await MemberTransactionController.create(memberId,income,3,orderId,null,t);
        return result;
    },

    // 购买，第三方支付支付
    expenseByPurchase: async function(memberId,expense,orderId,t) {
        var result = await MemberTransactionController.create(memberId,expense,4,orderId,null,t);
        return result;
    },

    // 余额购买支出
    expenseByPurchaseBanlance: async function(memberId,expense,orderId,t) {
        var result = await MemberTransactionController.create(memberId,expense,5,orderId,null,t);
        return result;
    },

    // 注册时支出,cId注册人Id
    expenseByRegister: async function(memberId,expense,cId,t) {
        var result = await MemberTransactionController.create(memberId,expense,6,null,cId,t);
        return result;
    },


    // 提现支出
    expenseByWithdraw: async function(memberId,expense,t) {
        var result = await MemberTransactionController.create(memberId,expense,7,null,null,t);
        return result;
    },

    getAllExpense: async function(ctx) {
        var memberId = ctx.session.memberId;
        if (!memberId) {
            respond.json(ctx,false,'获取收益失败，用户尚未登录',{code: 203});
            return false;
        }
        var query = {
                memberId,
                money: {
                    $gt: 0
                }
            };
        var {date} = ctx.request.body;
        if (date) {
            query.createdAt = date;
        }
        try{
            var result = await MemberTransaction.sum('money',{where: query});
            if (!result) {
                result = 0;
            }
            respond.json(ctx,true,'获取收益成功',{code: 200,data: {sum:result}});
        }catch(e) {
            respond.json(ctx,false,'获取收益失败',null,e);
        }
    },

    getAllOrders: async function(ctx) {
        var memberId = ctx.session.memberId;
        if (!memberId) {
            respond.json(ctx,false,'获取订单失败，用户尚未登录',{code: 203});
            return false;
        }
        var query = {
                    memberId,
                    type: 2
                };
        var {date} = ctx.request.body;
        if (date) {
            query.createdAt = date;
        }
        try{
            var result = await MemberTransaction.findAndCountAll({
                where: query
            });
            respond.json(ctx,true,'获取订单成功',{code: 200,data: {count: result.count}});
        }catch(e) {
            respond.json(ctx,false,'获取订单失败',null,e);
        }
    },

    getUserBalanceTransItem: async function(ctx) {
        var memberId = ctx.session.memberId;
        if (!memberId) {
            respond.json(ctx,false,'获取订单失败，用户尚未登录',{code: 203});
            return false;
        }
        var { pageIndex, pageSize } = ctx.request.body;
        pageIndex = pageIndex ? pageIndex : 0;
        pageSize = pageSize ? pageSize : 20;
        pageIndex = parseInt(pageIndex, 10);
        pageSize = parseInt(pageSize, 10);
        try{
            var result = await MemberTransaction.findAll({
                offset: pageIndex * pageSize,
                limit: pageSize,
                where: {
                    memberId,
                    type: {
                        $notIn: ['4','6']
                    }
                }
            });
            respond.json(ctx,true,'获取用户余额明细成功',{code: 200,data: result});
        }catch(e) {
            respond.json(ctx,false,'获取用户余额明细失败',null,e);
        }
    }
}

module.exports = MemberTransactionController