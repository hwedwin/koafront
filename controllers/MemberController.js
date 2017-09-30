const Member = require('../models/Member');
const MemberRelation = require('../models/MemberRelation');
const MemberRelationController = require('./MemberRelationController');
const MemberBalanceController = require('./MemberBalanceController');
const MemberTransactionController = require('./MemberTransactionController');
const ConsigneeController = require('./ConsigneeController');
const OrderController = require('./OrderController');
const crypto = require('../utils/crypto');
const respond = require('../utils/respond');
const smsVerify = require('../utils/smsVerify');

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

    logout: async function(ctx) {
        ctx.session.memberId = null;
        respond.json(ctx,true,'退出成功');
    },

    //注册为经销商
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
        if (vCode !== verifyCode) {
            respond.json(ctx, false, '短信验证码错误，请重试');
            return false;
        }
        try {
        	//开启事务
            let memberData = await sequelize.transaction(async function(t) {
	            //写入
	            const member = await Member.create({
	                account: mobile,
	                password: password,
	                phone: mobile
	            }, {transaction: t});

	            //记录会员关系
	            let level = agentId ? 2 : 1;
	            agentId = agentId ? agentId : 'top';
	            const memberRe = await MemberRelation.create({
	                fxLevel: level,
	                pid: agentId,
	                cid: member.id,
	            }, {transaction: t});

                // 添加用户收货地址
                var oResult = await ConsigneeController.create({
                    isDefault: '1',
                    memberId: member.id,
                    consigneeName,consigneeMobile,province,city,county,address,
                },t);

                // 新建一笔订单，送注册礼品
                await OrderController.createRegisterOrder(member.id,agentId,{
                    consigneeName,consigneeMobile,province,city,county,address
                },t);

                // 创建用户余额账户
                var baResult = await MemberBalanceController.create(member.id,t);
                // console.log(baResult);

                // 创建一条注册为经销商的支出交易
                var transResult = await MemberTransactionController.expenseByRegister(member.id,-400,agentId,t);
                // console.log(transResult);

                // 上级获取注册返利金额
                // 交易记录,余额增量
                if (agentId === 'top') {
                    await MemberTransactionController.incomeByRegister(agentId,400,member.id,t);
                    await MemberBalanceController.changeBanlance(agentId,400,t);
                }else{
                    await MemberTransactionController.incomeByRegister(agentId,400,member.id,t);
                    await MemberBalanceController.changeBanlance(agentId,400,t);
                    await MemberTransactionController.incomeByRegister(agentId,98,member.id,t);
                    await MemberBalanceController.changeBanlance(agentId,98,t);
                }

	            return member;
            });
            ctx.session.memberId = memberData.id;
            smsVerify.destory(ctx);
            respond.json(ctx, true, '注册成功', { id: memberData.id });
        } catch (e) {
            respond.json(ctx, false, '注册失败', null, e);
        }
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
	            //写入
	            const member = await Member.create({
	                account: mobile,
	                password: password,
	                phone: mobile
	            }, {transaction: t});

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
            var customers = MemberRelationController.getCustomerByMemberId(memberId);
            respond.json(ctx,true,'获取客户成功',{code: 200,data: customers});
        }catch(e) {
            respond.json(ctx,false,'获取客户失败',null,e);
        }
    },
}

module.exports = MemberController;