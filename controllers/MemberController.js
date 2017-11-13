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
                ctx.session.memberId = member.id;
                respond.json(ctx, true, '登录成功', { code: 200, data: member });
            } else {
                respond.json(ctx, true, '登录失败,用户名或密码错误', { code: 203 });
            }
        } catch (e) {
            respond.json(ctx, false, '登录失败,服务器内部错误', null, e);
        }
    },

    loginByOpenid: async function(ctx, openid) {
        //查询
        try {
            let member = await Member.findOne({
                where: {
                    wxtoken: openid
                }
            });
            if (member) {
                ctx.session.memberId = member.id;
            }
            return member;
        } catch (e) {
            return e;
        }
    },

    logout: async function(ctx) {
        ctx.session.memberId = null;
        respond.json(ctx, true, '退出成功');
    },

    //预注册为经销商-未支付
    registerAgent: async function(ctx) {
        if (!ctx.session.openid) {
            respond.json(ctx, false, '未获取到您的openid,请重新打开次链接并允许授权');
            return false;   
        }
        if (await MemberController.openidExist(ctx.session.openid)) {
            respond.json(ctx, false, '您的微信账号已被注册');
            return false;
        }
        let { mobile, verifyCode, password, agentId, consigneeName, consigneeMobile, province, city, county, address } = ctx.request.body;
        let { vCode, vMobile } = smsVerify.get(ctx);
        if (!password || password.length < 6 || password.length > 12) {
            respond.json(ctx, false, '密码不符合要求,请输入6～12位密码');
            return false;
        }
        if (!consigneeName || !consigneeMobile || !province || !city || !address) {
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
                    phone: mobile,
                    payCode: wxCode,
                    isPay: '0',
                    isAgent: '1'
                };
                if (ctx.session.openid) {
                    agentData.nickname = ctx.session.nickname.replace(/[^\u4E00-\u9FA5A-Za-z0-9_]/g, ''); //
                    agentData.headerImage = ctx.session.headimgurl;
                    agentData.wxtoken = ctx.session.openid;
                }
                var member;
                //写入
                member = await Member.create(agentData, { transaction: t });

                let level = 1;
                if (agentId) {
                    let agentLevel = await MemberRelationController.getMemberLevelById(agentId);
                    if (agentLevel === null) {
                        throw new Error('代理人不存在,请检查您的注册链接是否正确');
                    } else if (agentLevel instanceof Error) {
                        throw new Error(agentLevel);
                    }
                    level = agentLevel + 1;
                } else {
                    agentId = 'top';
                }

                var memberRe = await MemberRelationController.create(level, agentId, member.id, t);
                if (memberRe instanceof Error) {
                    throw new Error(memberRe);
                }

                // 添加用户收货地址
                var consigneeResult = await ConsigneeController.create({
                    isDefault: '1',
                    memberId: member.id,
                    consigneeName,
                    consigneeMobile,
                    province,
                    city,
                    county,
                    address
                }, t);
                if (consigneeResult instanceof Error) {
                    throw new Error(consigneeResult);
                }

                return member;
            });
            ctx.session.memberId = memberData.id;
            // smsVerify.destory(ctx);
            var wxOrder = await MemberController.createWxOrder(ctx.session.openid, wxCode, ctx.ip);
            respond.json(ctx, true, '预注册成功', wxOrder);
        } catch (e) {
            respond.json(ctx, false, '预注册失败,如因上次未支付而导致,请前往商城支付', null, e);
        }
    },

    // 二次支付
    resumeAgentPay: async function(ctx) {
        try {
            var openid = ctx.session.openid;
            let member = await Member.findOne({
                where: {
                    wxtoken: openid
                }
            });
            if (!member) {
                respond.json(ctx, false, '经销商不存在');
                return;
            }
            var wxCode = CommonUtil.createOrderCode();
            await Member.update({
                payCode: wxCode
            }, {
                where: {
                    wxtoken: openid
                }
            });
            var wxOrder = await MemberController.createWxOrder(openid, wxCode, ctx.ip);
            respond.json(ctx, true, '创建支付订单成功', wxOrder);
        } catch (e) {
            respond.json(ctx, false, '创建支付订单失败', null, e);
        }
    },

    createWxOrder: async function(openid, out_trade_no, ip) {
        var wxpay = new WeixinPay();
        var wxOrder = await wxpay.createWCPayOrder({
            openid: openid,
            body: '用户注册代理商订单',
            detail: '用户注册代理商订单',
            out_trade_no: out_trade_no, //内部订单号
            total_fee: 39800,
            spbill_create_ip: ip,
            notify_url: 'http://baebae.cn/api/member/paynotify'
        });
        return wxOrder;
    },

    // 未支付或支付失败清除注册的经销商
    clearRegistedAgent: async function(wxCode) {
        try {
            var member = await Member.findOne({
                payCode: wxCode
            });
            var memberId = member.id;

            await Consignee.destroy({
                where: {
                    memberId
                }
            });

            await MemberRelation.destroy({
                where: {
                    cid: memberId
                }
            });

            await Member.destroy({
                where: {
                    id: memberId
                }
            });
        } catch (e) {
            throw new Error(e);
        }
    },

    // 创建注册代理成功交易
    createRegisterTransaction: async function(wxCode) {
        try {
            await sequelize.transaction(async function(t) {
                await Member.update({
                    isPay: '1'
                }, {
                    where: {
                        payCode: wxCode
                    },
                    transaction: t
                });
                var member = await Member.findOne({
                    where: {
                        payCode: wxCode
                    },
                    transaction: t
                });
                if (!member) {
                    throw new Error('用户不存在');
                }
                var memberId = member.id;
                // 找到agentid
                var pid = await MemberRelationController.getPidByCid(memberId);
                if (pid === null) {
                    throw new Error('获取pid为null');
                } else if (pid instanceof Error) {
                    throw new Error('获取上级代理ID时发生错误');
                }
                if (pid !== 'top') {
                    var gPid = await MemberRelationController.getPidByCid(pid);
                    if (gPid === null) {
                        throw new Error('获取gpid为null');
                    } else if (gPid instanceof Error) {
                        throw new Error('获取上上级代理ID时发生错误');
                    }
                }
                // 找到收获地址
                var consignee = await Consignee.findOne({
                    where: {
                        memberId
                    }
                });
                // 新建一笔订单，送注册礼品
                var order = await OrderController.createRegisterOrder(member.id, pid, {
                    consigneeName: consignee.consigneeName,
                    consigneeMobile: consignee.consigneeMobile,
                    province: consignee.province,
                    city: consignee.city,
                    county: consignee.county,
                    address: consignee.address,
                    payCode: wxCode
                }, t);
                if (order instanceof Error) {
                    throw new Error('创建用户注册订单失败');
                }
                // 创建用户余额账户
                if (await MemberBalanceController.create(member.id, t) instanceof Error) {
                    throw new Error('创建用户余额账户失败');
                }

                // 创建一条注册为经销商的支出交易
                var t1 = await MemberTransactionController.expenseByRegister(memberId, -398, wxCode, 'top', t);
                // 上级获取注册返利金额
                // 交易记录,余额增量
                var t2 = await MemberTransactionController.incomeByRegister('top', 398, wxCode, memberId, t);
                var t3 = await MemberBalanceController.changeBanlance('top', 398, t);
                if (pid !== 'top') {
                    var t4 = await MemberTransactionController.incomeByRegister(pid, 98, wxCode, memberId, t);
                    var t5 = await MemberBalanceController.changeBanlance(pid, 98, t);
                }
                if (gPid !== 'top' && gPid != null) {
                    var t6 = await MemberTransactionController.incomeByRegister(gPid, 30, wxCode, memberId, t);
                    var t7 = await MemberBalanceController.changeBanlance(gPid, 30, t);
                }
                if (t1 instanceof Error || t2 instanceof Error || t3 instanceof Error || t4 instanceof Error || t5 instanceof Error || t6 instanceof Error || t7 instanceof Error) {
                    throw new Error('创建用户注册交易相关记录失败');
                }
            });
        } catch (e) {
            throw new Error(e);
        }
    },

    // 支付成功回调
    payNotify: async function(ctx) {
        var body = ctx.request.body;
        try {
            if (body.return_code == 'SUCCESS' && body.result_code == 'SUCCESS') {
                await MemberController.createRegisterTransaction(body.out_trade_no);
            } else {
                await MemberController.clearRegistedAgent(body.out_trade_no);
            }
        } catch (e) {

        }
        // await OrderController.changeOrderState(memberId,2,id);
        var message = '<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>';
        ctx.body = message;
    },

    //注册为普通会员
    register: async function(ctx) {
        let { mobile, verifyCode, password } = ctx.request.body;
        let { vCode, vMobile } = smsVerify.get(ctx);
        if (!password || password.length < 6 || password.length > 12) {
            respond.json(ctx, false, '密码不符合要求,请输入6～12位密码');
            return false;
        }
        if (vMobile != mobile) {
            respond.json(ctx, false, '号码与已验证手机号码不匹配');
            return false;
        }
        if (vCode != verifyCode) {
            respond.json(ctx, false, '短信验证码错误，请重试');
            return false;
        }
        try {
            //开启事务
            let memberData = await sequelize.transaction(async function(t) {
                var agentData = {
                    account: mobile,
                    password: password,
                    phone: mobile,
                    isAgent: '0',
                    isPay: '0',
                    payCode: 'normalmember'
                };
                if (ctx.session.openid) {
                    agentData.nickname = ctx.session.nickname.replace(/[^\u4E00-\u9FA5A-Za-z0-9_]/g, '');
                    agentData.headerImage = ctx.session.headimgurl;
                    agentData.wxtoken = ctx.session.openid;
                }
                //写入
                const member = await Member.create(agentData, { transaction: t });

                //记录会员关系，三级为普通会员
                const memberRe = await MemberRelation.create({
                    fxLevel: 9999,
                    pid: 'top',
                    cid: member.id
                }, { transaction: t });

                // 创建用户余额账户
                await MemberBalanceController.create(member.id, t);

                return member;
            });
            ctx.session.memberId = memberData.id;
            // smsVerify.destory(ctx);
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
        try {
            const result = await Member.update({
                password
            }, {
                where: {
                    account: mobile
                }
            });
            respond.json(ctx, true, '密码重置成功');
        } catch (e) {
            respond.json(ctx, false, '密码重置失败，请重试', null, e);
        }
    },

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

    openidExist: async function(openid) {
        const members = await Member.findAll({
            attributes: ['id'],
            where: {
                wxtoken: openid
            }
        });
        return members.length > 0;
    },

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
            respond.json(ctx, false, '获取收货资料失败，用户尚未登录', { code: 203 });
            return false;
        }
        try {
            var result = await Member.findOne({
                where: {
                    id: memberId
                }
            });
            respond.json(ctx, true, '获取用户资料成功', { code: 200, data: result });
        } catch (e) {
            respond.json(ctx, false, '获取用户资料失败', null, e);
        }
    },

    edit: async function(ctx) {
        var memberId = ctx.session.memberId;
        if (!memberId) {
            respond.json(ctx, false, '更新用户资料失败，用户尚未登录', { code: 203 });
            return false;
        }
        var { headerImage, name, nickname, sex } = ctx.request.body;
        try {
            var result = await Member.update({
                headerImage,
                name,
                nickname,
                sex
            }, {
                where: {
                    id: memberId
                }
            });
            respond.json(ctx, true, '更新用户资料成功', { code: 200, data: result });
        } catch (e) {
            respond.json(ctx, false, '更新用户资料失败', null, e);
        }
    },

    getCustomer: async function(ctx) {
        var memberId = ctx.session.memberId;
        if (!memberId) {
            respond.json(ctx, false, '获取客户失败，用户尚未登录', { code: 203 });
            return false;
        }
        var { pageIndex, pageSize } = ctx.request.body;
        pageIndex = pageIndex ? pageIndex : 0;
        pageSize = pageSize ? pageSize : 20;
        pageIndex = parseInt(pageIndex, 10);
        pageSize = parseInt(pageSize, 10);
        try {
            var customers = await MemberRelationController.getCustomersByMemberId(memberId, pageIndex, pageSize);
            respond.json(ctx, true, '获取客户成功', { code: 200, data: customers });
        } catch (e) {
            respond.json(ctx, false, '获取客户失败', null, e);
        }
    },

    obtainDataById: async function(id) {
        try {
            return await Member.findOne({
                where: {
                    id
                }
            });
        } catch (e) {
            return e;
        }
    },

    getDataById: async function(ctx) {
        var { id } = ctx.request.body;
        try {
            var result = await MemberController.obtainDataById(id);
            if (!result) {
                respond.json(ctx, true, '用户不存在', { code: 203 });
            } else if (result instanceof Error) {
                throw new Error(e);
            }
            respond.json(ctx, true, '获取用户资料成功', { code: 200, data: result });
        } catch (e) {
            respond.json(ctx, false, '服务器内部错误', null, e);
        }
    },

    withdraw: async function(ctx) {
        var openid = ctx.session.openid;
        var memberId = ctx.session.memberId;
        if (!openid || !memberId) {
            respond.json(ctx, false, '用户未登录或未获取到用户openid');
            return;
        }
        var { amount } = ctx.request.body;
        amount = parseFloat(amount);
        if (isNaN(amount) || amount < 1 || amount > 20000) {
            respond.json(ctx, false, '提现金额有误，单笔提现需在1至20000元之间');
            return;
        }
        try {
            //查询用户是否存在
            var member = Member.findOne({
                where: {
                    id: memberId,
                    wxtoken: openid
                }
            });
            if (!member) {
                respond.json(ctx, false, '用户不存在');
                return;
            }
            // 获取用户余额
            var memberBalance = await MemberBalanceController.getBalance(memberId);
            if (!memberBalance) {
                respond.json(ctx, false, '用户余额账户不存在，未获取到用户余额');
                return;
            } else if (memberBalance instanceof Error) {
                throw new Error(memberBalance);
            }
            // 检验余额
            if (memberBalance.balance < amount) {
                respond.json(ctx, false, '用户余额不足');
                return;
            }
            var orderNo = CommonUtil.createOrderCode();
            var wxpay = new WeixinPay();
            var wxOrder = await wxpay.createTransferOrder({
                openid: openid,
                partner_trade_no: orderNo,
                amount: parseInt(amount * 100),
                spbill_create_ip: ctx.ip
            });
            if (wxOrder.return_code == 'SUCCESS' && wxOrder.return_msg == 'SUCCESS') {
                // 交易成功,扣除用户余额，增加交易记录
                // 扣除总账户余额
                await MemberBalanceController.changeBanlance('top', -amount);
                // 添加提现记录
                await MemberTransactionController.expenseByWithdraw('top', -amount, orderNo, memberId);
                // 扣用户余额 
                await MemberBalanceController.changeBanlance(memberId, -amount);
                // 添加用户提现记录
                await MemberTransactionController.expenseByWithdraw(memberId, -amount, orderNo, 'top');
                respond.json(ctx, true, '提现成功，请注意查收');
            } else {
                respond.json(ctx, false, '提现失败,请联系管理员,err_code:' + wxOrder.err_code + ',系统描述' + wxOrder.err_code_des);
            }
        } catch (e) {
            respond.json(ctx, false, '服务器内部错误', null, e);
        }
    }
};
module.exports = MemberController;

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