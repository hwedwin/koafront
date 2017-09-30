const respond = require('../utils/respond')
const MemberBalance = require('../models/MemberBalance')

const MemberBalanceController = {
    /**
     * 创建账户，并初始化余额为0
     * @Author   KuangGuanghu
     * @DateTime 2017-08-17
     */
    create: async function(memberId,t) {
    	var transactionO = {};
    	if (t) {
    		transactionO.transaction = t;
    	}
        try{
            var memberB = await MemberBalance.create({
                memberId,
                balance: 0
            }, transactionO);
            return memberB;
        }catch(e){
            return e;
            throw new Error(e);
        }
    },

    /**
     * 改变账户余额，money为本次增量
     * @Author   KuangGuanghu
     * @DateTime 2017-08-19
     */
    changeBanlance: async function(memberId,money,t) {
        var transactionO = {};
        if (t) {
            transactionO.transaction = t;
        }
        try{
            var result = await MemberBalance.increment(['balance'],{
                by: money,
                where: {
                    memberId: memberId
                }
            },transactionO);
            return result;
        } catch(e) {
            throw new Error(e);
        }
    },

    getBalance: async function(memberId) {
        try{
            var result = await MemberBalance.findOne({
                where: {
                    memberId
                }
            });
            return result;
        } catch(e) {
            throw new Error(e);
        }
    },

    postBanlance: async function(ctx) {
        var memberId = ctx.session.memberId;
        if (!memberId) {
            respond.json(ctx,false,'获取余额失败，用户尚未登录',{code: 203});
            return false;
        }
        try{
            var result = await MemberBalance.findOne({
                where: {
                    memberId
                }
            });
            respond.json(ctx,true,'获取余额成功',{code: 200,data: result});
        }catch(e) {
            respond.json(ctx,false,'获取余额失败',null,e);
        }
    }
}

module.exports = MemberBalanceController