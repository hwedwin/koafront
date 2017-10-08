const respond = require('../utils/respond');
const Member = require('../models/Member');
const IndexController = {
	index: async function(ctx) {
		await ctx.render('index')
	},
	regagent: async function(ctx) {
		console.log(ctx.params.id)
		await ctx.render('index')
	},
	beat: async function(ctx) {
		var memberId = ctx.session.memberId;
		//查询
        try {
            if (memberId) {
                let memberLevel = await MemberRelationController.getMemberLevelById(memberId);
            	ctx.session.memberId = memberId;
                respond.json(ctx, true, '用户已登录',{code: 200,data: {
                	id: memberId,
                	level: memberLevel
                }});
            } else {
                respond.json(ctx, true, '用户未登录',{code: 203});
            }
        } catch (e) {
            respond.json(ctx, true, '失败,服务器内部错误', null, e);
        }
	}
}

module.exports = IndexController;