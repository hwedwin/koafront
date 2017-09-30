const Favorite = require('../models/Favorite')
const Drink = require('../models/Drink')
const respond = require('../utils/respond')

const FavoriteController = {
	create: async function(ctx) {
		var {drinkId} = ctx.request.body;
		var memberId = ctx.session.memberId;
		if (!memberId) {
			respond.json(ctx,false,'用户未登录');
			return;
		}
		if (!drinkId) {
			respond.json(ctx,false,'drinkId不能为空');
			return;
		}
		try{
			if (await FavoriteController.exits(drinkId,memberId)) {
				respond.json(ctx,false,'商品已收藏过');
				return;
			}
			await Favorite.create({
				drinkId,
				memberId
			});
			respond.json(ctx,true,'收藏成功');
		} catch(e){
			respond.json(ctx,false,'收藏失败',null,e);
		}
	},

	remove: async function(ctx) {
		var {drinkId} = ctx.request.body;
		var memberId = ctx.session.memberId;
		if (!memberId) {
			respond.json(ctx,false,'用户未登录');
			return;
		}
		if (!drinkId) {
			respond.json(ctx,false,'drinkId不能为空');
			return;
		}
		try{
			if (!await FavoriteController.exits(drinkId,memberId)) {
				respond.json(ctx,false,'商品还没收藏');
				return;
			}
			var result = await Favorite.destroy({
				where: {
					drinkId,
					memberId
				}
			});
			respond.json(ctx,true,'移出收藏夹成功');
		} catch(e){
			respond.json(ctx,false,'移出收藏夹失败',null,e);
		}
	},

	combine: async function(ctx) {
		var {drinkId} = ctx.request.body;
		var memberId = ctx.session.memberId;
		if (!memberId) {
			respond.json(ctx,false,'用户未登录',{code: 203});
			return;
		}
		if (!drinkId) {
			respond.json(ctx,false,'drinkId不能为空',{code: 204});
			return;
		}
		try{
			if (await FavoriteController.exits(drinkId,memberId)) {
				await Favorite.destroy({
					where: {
						drinkId,
						memberId
					}
				});
				respond.json(ctx,true,'移出收藏夹成功',{code: 201});
			}else{
				await Favorite.create({
					drinkId,
					memberId
				});
				respond.json(ctx,true,'收藏成功',{code: 200});
			}
		} catch(e){
			respond.json(ctx,false,'收藏失败',null,e);
		}
	},

	state: async function(ctx) {
		var {drinkId} = ctx.request.body;
		var memberId = ctx.session.memberId;
		if (!memberId) {
			respond.json(ctx,false,'用户未登录',{code: 203});
			return;
		}
		if (!drinkId) {
			respond.json(ctx,false,'drinkId不能为空',{code: 204});
			return;
		}
		try{
			if (await FavoriteController.exits(drinkId,memberId)) {
				respond.json(ctx,true,'商品已收藏',{code: 200});
			}else{
				respond.json(ctx,true,'商品未收藏',{code: 201});
			}
		}catch(e){
			respond.json(ctx,false,'获取商品收藏状态失败',null,e);
		}
	},

	list: async function(ctx) {
		var memberId = ctx.session.memberId;
		if (!memberId) {
			respond.json(ctx,false,'用户未登录',{code: 203});
			return;
		}
		try{
			var results = await Favorite.findAll({
				where: {
					memberId
				},
				include: [
					{
						model: Drink,
						as: 'drink'
					}
				]
			});
			respond.json(ctx,true,'获取收藏商品成功',{code: 200,data: results});
		}catch(e){
			respond.json(ctx,false,'获取收藏商品失败',null,e);
		}
	},

	exits: async function(drinkId,memberId){
		try{
			var results = await Favorite.findAll({
				where: {
					drinkId,
					memberId
				}
			});
			return results.length>0;
		}catch(e){
			throw new Error(e);
		}
	}
}

module.exports = FavoriteController;