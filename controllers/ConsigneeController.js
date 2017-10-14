/**
 * consigneeName,consigneeMobile,province,city,county,address
 */
const Consignee = require('../models/Consignee');
const respond = require('../utils/respond');

const ConsigneeController = {
	create: async function(option,t) {
		var transaction0 = {};
		if (t) {
			transaction0.transaction = t;
		}
		try{
			return await Consignee.create(option, transaction0);
		} catch(e){
			throw new Error(e);
		}
	},

	createByPost: async function(ctx) {
		var memberId = ctx.session.memberId;
		if (!memberId) {
			respond.json(ctx,false,'新增收货地址失败，用户尚未登录');
			return false;
		}
		var {consigneeName,consigneeMobile,province,city,county,address,isDefault} = ctx.request.body;
		if (!consigneeName||!consigneeMobile||!province||!city||!county||!address) {
            respond.json(ctx, false, '注册失败，请详细填写收货人信息');
            return false;
        }
		if (!isDefault) {
			isDefault = '0';
		}
		try{
			if (isDefault == '1') {
				await Consignee.update({
					isDefault: '0'
				},{where: {memberId}})
			}
			var result = await ConsigneeController.create({
				memberId,consigneeName,consigneeMobile,province,city,county,address,isDefault
			});
			respond.json(ctx,true,'新增收货地址成功',{code: 200,data: result});
		}catch(e){
			respond.json(ctx,false,'新增收货地址失败',null,e);
		}
	},

	getByMemberId: async function(ctx) {
		var {defaults} = ctx.request.body;
		var memberId = ctx.session.memberId;
		if (!memberId) {
			respond.json(ctx,false,'获取收货地址失败，用户尚未登录',{code: 203});
			return false;
		}
		try{
			var result = null;
			if (defaults) {
				result = await Consignee.findOne({
					where: {
						memberId,
						isDefault: '1'
					}
				});
			}else{
				result = await Consignee.findAll({
					where: {memberId}
				});
			}
			respond.json(ctx,true,'获取收货地址成功',{code: 200,data: result});
		}catch(e){
			respond.json(ctx,false,'获取收货地址失败',null,e);
		}
	},

	getOneById: async function(ctx) {
		var {id} = ctx.request.body;
		var memberId = ctx.session.memberId;
		if (!memberId) {
			respond.json(ctx,false,'获取收货地址失败，用户尚未登录',{code: 203});
			return false;
		}
		try{
			var result = await Consignee.findOne({
				where: {
					id,
					memberId
				}
			});
			respond.json(ctx,true,'获取收货地址成功',{code: 200,data: result});
		}catch(e){
			respond.json(ctx,false,'获取收货地址失败',null,e);
		}
	},

	modifyOneById: async function(ctx) {
		var {consigneeName,consigneeMobile,province,city,county,address,isDefault,id} = ctx.request.body;
		var memberId = ctx.session.memberId;
		if (!memberId) {
			respond.json(ctx,false,'获取收货地址失败，用户尚未登录',{code: 203});
			return false;
		}
		var updateObj = {consigneeName,consigneeMobile,province,city,county,address,isDefault};
		for (let name in updateObj) {
			if (!updateObj[name]) {
				delete updateObj[name];
			}
		}
		try{
			if (Object.keys(updateObj).length != 0) {
				if (updateObj.isDefault == '1') {
					await Consignee.update({
						isDefault: 0
					},{
						where: {
							memberId
						}
					});
				}
				await Consignee.update(updateObj,{
					where: {
						id,
						memberId
					}
				});
			}
			respond.json(ctx,true,'保存地址成功',{code: 200});
		}catch(e){
			respond.json(ctx,false,'保存地址失败',null,e);
		}
	},
}

module.exports = ConsigneeController;