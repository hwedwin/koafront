const Sequelize = require('sequelize');
const ShopCart = require('../models/ShopCart');
const Drink = require('../models/Drink');
const DrinkController = require('../controllers/DrinkController');
const MemberController = require('../controllers/MemberController');
const respond = require('../utils/respond');
const IndexTopSpecialController = require('./IndexTopSpecialController');

const ShopCartController = {
    /**
     * 通过用户memberId获取其购物车中的商品
     * @Author   KuangGuanghu
     * @DateTime 2017-07-23
     */
    getByMemberId: async function(ctx) {
        let memberId  = ctx.session.memberId;
        if (!memberId) {
            respond.json(ctx, false, '用户未登录',null,{code: 203});
            return;
        }
        try {
            var queryStr = "select shopCart.id as `cartId`,shopCart.nums as `cartNum`,drink.* from "
            queryStr += "`shopCarts` AS shopCart,`drinks` AS drink "
            queryStr += "where shopCart.drinkId=drink.id and shopCart.memberId='" + memberId + "'";
            var result = await sequelize.query(queryStr, { type: sequelize.QueryTypes.SELECT });
            for (var i = 0; i < result.length; i++) {
                await (async function(item){
                    var special = await IndexTopSpecialController.getOneById(item.id);
                    item.special = special;
                })(result[i]);
            }
            respond.json(ctx, true, '查询成功', result);
        } catch (e) {
            respond.json(ctx, false, '查询失败', null, e);
        }
    },

    /**
     * 添加商品至购物车
     * @Author   KuangGuanghu
     * @DateTime 2017-07-23
     */
    addGoods: async function(ctx) {
        let { drinkId, nums } = ctx.request.body;
        let memberId = ctx.session.memberId;
        if (!memberId || !drinkId || !nums || isNaN(parseInt(nums, 10))) {
            respond.json(ctx, false, '请求参数错误');
        }
        if (await DrinkController.drinkExist(drinkId)) {
            respond.json(ctx, false, '商品不存在');
        }
        if (await MemberController.memberExist(memberId)) {
            respond.json(ctx, false, '用户不存在');
        }

        try {
            var cart = {};
            //判断是否曾经加入过购物车
            if (await ShopCartController.haveAlreadyAdd(memberId, drinkId)) {
                cart = await ShopCart.findOne({
                    where: {
                        memberId: {
                            $eq: memberId
                        },
                        drinkId: {
                            $eq: drinkId
                        }
                    }
                });
                await cart.increment('nums', { by: nums });
            } else {
                cart = await ShopCart.create({
                    drinkId,
                    memberId,
                    nums
                });
            }
            respond.json(ctx, true, '成功加入购物车', { id: cart.id } );
        } catch (e) {
            respond.json(ctx, false, '加入购物车失败', null, e);
        }
    },

    /**
     * 通过id删除
     * @Author   KuangGuanghu
     * @DateTime 2017-07-23
     */
    deleteCartById: async function(ctx) {
        let { id } = ctx.request.body;
        let memberId = ctx.session.memberId;
        if (!memberId) {
            respond.json(ctx, false, '用户未登录', {code: 203});
            return;
        }
        try {
            await ShopCart.destroy({
                where: {
                    id,memberId
                }
            });
            respond.json(ctx, true, '删除成功');
        } catch (e) {
            respond.json(ctx, false, '删除失败', null, e);
        }
    },

    /**
     * 通过DrinkId删除
     * @Author   KuangGuanghu
     * @DateTime 2017-07-23
     */
    deleteCartByDrinkId: async function(ctx) {
        let { id } = ctx.request.body;
        let memberId = ctx.session.memberId;
        if (!memberId) {
            respond.json(ctx, false, '用户未登录', {code: 203});
            return;
        }
        try {
            await ShopCart.destroy({
                where: {
                    drinkId: id,memberId
                }
            });
            respond.json(ctx, true, '删除成功');
        } catch (e) {
            respond.json(ctx, false, '删除失败', null, e);
        }
    },

    /**
     * 增加／减少／设置购物车商品数量
     * @Author   KuangGuanghu
     * @DateTime 2017-07-23
     */
    operationNums: async function(ctx) {
        let { id, nums } = ctx.request.body;
        let memberId = ctx.session.memberId;
        if (!memberId) {
            respond.json(ctx, false, '用户未登录', {code: 203});
            return;
        }
        try {
            await ShopCart.update({
                nums: nums  
            }, {
                where: {
                    id,
                    memberId
                }
            });
            respond.json(ctx, true, '操作成功');
        } catch (e) {
            respond.json(ctx, false, '操作失败', null, e);
        }
    },

    /**
     * 判断是否曾经加入过购物车
     * @Author   KuangGuanghu
     * @DateTime 2017-07-23
     */
    haveAlreadyAdd: async function(memberId, drinkId) {
        const carts = await ShopCart.findAll({
            attributes: ['id'],
            where: {
                memberId,
                drinkId
            }
        });
        return carts.length > 0;
    }
}

module.exports = ShopCartController;