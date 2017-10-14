const Member = require('../models/Member');
const Consignee = require('../models/Consignee');
const MemberRelation = require('../models/MemberRelation');
const MemberRelationController = require('./MemberRelationController');
const MemberBalanceController = require('./MemberBalanceController');
const MemberTransactionController = require('./MemberTransactionController');
const ConsigneeController = require('./ConsigneeController');
const OrderController = require('./OrderController');
const crypto = require('../utils/crypto');
const respond = require('../utils/respond');
const smsVerify = require('../utils/smsVerify');

const WeixinPay = require('../core/weixinPay');
const CommonUtil = require('../utils/CommonUtil');

const MemberController = {
    login: async function(ctx) {
        let { mobile, password } = ctx.request.body;
        //是否为注册用户
        if (!await MemberController.mobileExist(mobile)) {
            respond.json(ctx, false, '用户尚未注册');
            return false;
        }
        //查询
        try {
            let member = await Member.findOne({
            	attributes: ['id'],
                where: {
                    account: {
                        $eq: mobile + '',
                    },
                    password: {
                        $eq: crypto.encrypt(password)
                    }
                }
            });

            if (member) {
                let memberLevel = await MemberRelationController.getMemberLevelById(member.id);
            	ctx.session.memberId = member.id;
                member.dataValues.level = memberLevel;
                respond.json(ctx, true, '登录成功',{code: 200,data: member});
            } else {
                respond.json(ctx, true, '登录失败,用户名或密码错误',{code: 203});
            }
        } catch (e) {
            respond.json(ctx, false, '登录失败,服务器内部错误', null, e);
        }
    },

    loginByOpenid: async function(openid) {
        //查询
        try {
            let member = await Member.findOne({
                where: {
                    wxtoken: openid
                }
            });
            return member;
        } catch (e) {
            return null;
        }
    },

    logout: async function(ctx) {
        ctx.session.memberId = null;
        respond.json(ctx,true,'退出成功');
    },

    //预注册为经销商-未支付
    registerAgent: async function(ctx) {
        let { mobile, verifyCode, password, agentId, consigneeName,consigneeMobile,province,city,county,address } = ctx.request.body;
        let { vCode, vMobile } = smsVerify.get(ctx);
        if (!password || password.length < 6 || password.length > 12) {
            respond.json(ctx, false, '密码不符合要求,请输入6～12位密码');
            return false;
        }
        if (!consigneeName||!consigneeMobile||!province||!city||!county||!address) {
            respond.json(ctx, false, '注册失败，请详细填写收货人信息');
            return false;
        }
        if (vMobile !== mobile) {
            respond.json(ctx, false, '号码与已验证手机号码不匹配');
            return false;
        }
        if (vCode != verifyCode) {
            respond.json(ctx, false, '短信验证码错误，请重试');
            return false;
        }
        try {
            var wxCode = CommonUtil.createOrderCode();
        	//开启事务
            let memberData = await sequelize.transaction(async function(t) {
                var agentData = {
                    account: mobile,
                    password: password,
                    phone: wxCode
                };
                if (ctx.session.openid) {
                    agentData.nickname = ctx.session.nickname;
                    agentData.headerImage = ctx.session.headerimgurl;
                    agentData.wxtoken = ctx.session.openid;
                }
                var member;
                //写入
                member = await Member.create(agentData, {transaction: t});
	            //记录会员关系
	            let level = agentId ? 2 : 1;
	            agentId = agentId ? agentId : 'top';
	            var memberRe = await MemberRelationController.create(level,agentId,member.id,t);
                console.log(memberRe);
                // 添加用户收货地址
                var oResult = await ConsigneeController.create({
                    isDefault: '1',
                    memberId: member.id,
                    consigneeName,consigneeMobile,province,city,county,address
                },t);
                console.log(oResult);

                // // 新建一笔订单，送注册礼品
                // await OrderController.createRegisterOrder(member.id,agentId,{
                //     consigneeName,consigneeMobile,province,city,county,address
                // },t);

                // // 创建用户余额账户
                // var baResult = await MemberBalanceController.create(member.id,t);
                // // console.log(baResult);

                // // 创建一条注册为经销商的支出交易
                // var transResult = await MemberTransactionController.expenseByRegister(member.id,-400,agentId,t);
                // // console.log(transResult);

                // // 上级获取注册返利金额
                // // 交易记录,余额增量
                // await MemberTransactionController.incomeByRegister('top',400,member.id,t);
                // await MemberBalanceController.changeBanlance('top',400,t);
                // if (agentId !== 'top') {
                //     await MemberTransactionController.incomeByRegister(agentId,98,member.id,t);
                //     await MemberBalanceController.changeBanlance(agentId,98,t);
                // }

	            return member;
            });
            // ctx.session.memberId = memberData.id;
            // smsVerify.destory(ctx);
            var wxpay = new WeixinPay();
            var wxOrder = await wxpay.createWCPayOrder({
                openid: ctx.session.openid,
                body: '用户注册代理商订单',
                detail: '用户注册代理商订单',
                out_trade_no: wxCode,//内部订单号
                total_fee: 1,
                spbill_create_ip: ctx.ip,
                notify_url: 'http://baebae.cn/api/member/paynotify'
            });
            respond.json(ctx, true, '预注册成功', wxOrder);
        } catch (e) {
            respond.json(ctx, false, '预注册失败', null, e);
        }
    },

    // 未支付或支付失败清除注册的经销商
    clearRegistedAgent: async function(mobile) {
        try{
            var member = await Member.findOne({
                phone: mobile
            });
            var memberId = member.id;

            await Consignee.destory({
                where: {
                    memberId
                }
            });

            await MemberRelation.destory({
                where: {
                    cid: memberId
                }
            });

            await Member.destory({
                where: {
                    id: memberId
                }
            });
        }catch(e){
            console.log(e);
           throw new Error(e); 
        }
    },

    createRegisterTransaction: async function(mobile) {
        try{
            var member = await Member.findOne({
                phone: mobile
            });
            var memberId = member.id;

            // 找到agentid
            var relation = await MemberRelation.findOne({
                where: {
                    cid: memberId
                }
            });
            var agentId = relation.pid;

            // 找到收获地址
            var consignee = await Consignee.findOne({
                where: {
                    memberId
                }
            });

            // 新建一笔订单，送注册礼品
            await OrderController.createRegisterOrder(member.id,agentId,{
                consigneeName: consignee.consigneeName,
                consigneeMobile: consignee.consigneeMobile,
                province: consignee.province,
                city: consignee.city,
                county: consignee.county,
                address: consignee.address,
                mobile: mobile
            });

            // 创建用户余额账户
            await MemberBalanceController.create(member.id);

            // 创建一条注册为经销商的支出交易
            await MemberTransactionController.expenseByRegister(member.id,-400,agentId);

            // 上级获取注册返利金额
            // 交易记录,余额增量
            await MemberTransactionController.incomeByRegister('top',400,member.id);
            await MemberBalanceController.changeBanlance('top',400);
            if (agentId !== 'top') {
                await MemberTransactionController.incomeByRegister(agentId,98,member.id);
                await MemberBalanceController.changeBanlance(agentId,98);
            }
        }catch(e){
           throw new Error(e); 
        }
    },

    // 支付成功回调
    payNotify: async function(ctx) {
        var body = ctx.request.body;
        if (body.return_code == 'SUCCESS' && body.result_code == 'SUCCESS') {
            await MemberController.createRegisterTransaction(body.out_trade_no);
        }else{
            await MemberController.clearRegistedAgent(body.out_trade_no);  
        }
        // await OrderController.changeOrderState(memberId,2,id);
        var message = '<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>';
        ctx.body = message;
    },

    //注册为普通会员
    register: async function(ctx) {
    	let { mobile, verifyCode, password} = ctx.request.body;
        let { vCode, vMobile } = smsVerify.get(ctx);
        if (!password || password.length < 6 || password.length > 12) {
            respond.json(ctx, false, '密码不符合要求,请输入6～12位密码');
            return false;
        }
        if (vMobile !== mobile) {
            respond.json(ctx, false, '号码与已验证手机号码不匹配');
            return false;
        }
        if (vCode !== verifyCode) {
            respond.json(ctx, false, '短信验证码错误，请重试');
            return false;
        }
        try {
        	//开启事务
            let memberData = await sequelize.transaction(async function(t) {
                var agentData = {
                    account: mobile,
                    password: password,
                    phone: mobile
                };
                if (ctx.session.openid) {
                    agentData.nickname = ctx.session.nickname;
                    agentData.headerImage = ctx.session.headerimgurl;
                    agentData.wxtoken = ctx.session.openid;
                }
	            //写入
	            const member = await Member.create(agentData, {transaction: t});

	            //记录会员关系，三级为普通会员
	            let level = 3;
	            const memberRe = await MemberRelation.create({
	                fxLevel: level,
	                pid: 'top',
	                cid: member.id,
	            }, {transaction: t});

                // 创建用户余额账户
                await MemberBalanceController.create(member.id,t);

	            return member;
            });
            smsVerify.destory(ctx);
            respond.json(ctx, true, '注册成功', { id: memberData.id });
        } catch (e) {
            respond.json(ctx, false, '注册失败', null, e);
        }
    },

    resetPassword: async function(ctx) {
    	let { mobile, verifyCode, password } = ctx.request.body;
    	let { vCode, vMobile } = smsVerify.get(ctx);
        if (!password || password.length < 6 || password.length > 12) {
            respond.json(ctx, false, '密码不符合要求,请输入6～12位密码');
            return false;
        }
        if (vMobile !== mobile) {
            respond.json(ctx, false, '号码与已验证手机号码不匹配');
            return false;
        }
        if (vCode !== verifyCode) {
            respond.json(ctx, false, '短信验证码错误，请重试');
            return false;
        }
        try{
        	const result = await Member.update({
        		password
        	},{
        		where: {
        			account: mobile
        		}
        	});
        	respond.json(ctx, true, '密码重置成功');
        }catch(e) {
        	respond.json(ctx, false, '密码重置失败，请重试',null,e);
        }
    },

    /**
     * 通过mobile判断手机号是否已被注册
     * @Author   KuangGuanghu
     * @DateTime 2017-07-23
     */
    mobileExist: async function(mobile) {
        const members = await Member.findAll({
            attributes: ['id'],
            where: {
                account: {
                    $eq: mobile
                }
            }
        });
        return members.length > 0;
    },

    /**
     * 通过memberId判断用户是否存在
     * @Author   KuangGuanghu
     * @DateTime 2017-07-23
     */
    memberExist: async function(memberId) {
        const members = await Member.findAll({
            attributes: ['id'],
            where: {
                id: {
                    $eq: memberId
                }
            }
        });
        return members.length > 0;
    },

    data: async function(ctx) {
        var memberId = ctx.session.memberId;
        if (!memberId) {
            respond.json(ctx,false,'获取收货资料失败，用户尚未登录',{code: 203});
            return false;
        }
        try{
            var result = await Member.findOne({
                where: {
                    id: memberId
                }
            });
            if (result) {
                let memberLevel = await MemberRelationController.getMemberLevelById(memberId);
                result.dataValues.level = memberLevel;
            }
            respond.json(ctx,true,'获取用户资料成功',{code: 200,data: result});
        }catch(e) {
            respond.json(ctx,false,'获取用户资料失败',null,e);
        }
    },

    edit: async function(ctx) {
        var memberId = ctx.session.memberId;
        if (!memberId) {
            respond.json(ctx,false,'更新用户资料失败，用户尚未登录',{code: 203});
            return false;
        }
        var {headerImage,name,nickname,sex} = ctx.request.body;
        try{
            var result = await Member.update({
                headerImage,name,nickname,sex
            },{
                where: {
                    id:memberId
                }
            });
            respond.json(ctx,true,'更新用户资料成功',{code: 200,data: result});
        }catch(e) {
            respond.json(ctx,false,'更新用户资料失败',null,e);
        }
    },

    getCustomer: async function(ctx) {
        var memberId = ctx.session.memberId;
        if (!memberId) {
            respond.json(ctx,false,'获取客户失败，用户尚未登录',{code: 203});
            return false;
        }
        try{
            var customers = await MemberRelationController.getCustomerByMemberId(memberId);
            respond.json(ctx,true,'获取客户成功',{code: 200,data: customers});
        }catch(e) {
            respond.json(ctx,false,'获取客户失败',null,e);
        }
    },

    getDataById: async function(ctx){
        var {id} = ctx.request.body;
        try{
            var result = await Member.findOne({
                where: {
                    id
                }
            });
            if (!result) {
                respond.json(ctx,true,'用户不存在',{code: 203}); 
            }
            respond.json(ctx,true,'获取用户资料成功',{code: 200,data: result});
        }catch(e) {
            respond.json(ctx,false,'获取用户资料失败',null,e);
        }
    }
}

module.exports = MemberController;