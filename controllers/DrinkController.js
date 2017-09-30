const Drink = require('../models/Drink');
const DrinkImage = require('../models/DrinkImage');
const DrinkBrand = require('../models/DrinkBrand');
const respond = require('../utils/respond');
const DrinkController = {
    /**
     * 生成排序组合
     * @Author   KuangGuanghu
     * @DateTime 2017-07-23
     */
    createOrderQuery: function(orderTag, orderRule) {
        orderRule = orderRule ? orderRule : 'DESC';
        let orderQuery = [];
        if (orderTag === 'new') {
            orderQuery.push(['updatedAt', 'DESC']);
        }
        if (orderTag === 'sale') {
            orderQuery.push(['saleCount', 'DESC']);
        }
        if (orderTag === 'price') {
            orderQuery.push(['retailPrice', orderRule]);
        }
        return orderQuery;
    },

    getGoodsList: async function(data,where) {
        var { pageIndex, pageSize, orderTag, orderRule } = data;
        pageIndex = pageIndex ? pageIndex : 0;
        pageSize = pageSize ? pageSize : 20;
        pageIndex = parseInt(pageIndex, 10);
        pageSize = parseInt(pageSize, 10);
        var queryWhere = {
                    isDelete: 0,
                    saleState: 1
                };
        queryWhere = Object.assign(queryWhere,where);
        try {
            let orderQuery = DrinkController.createOrderQuery(orderTag, orderRule);
            var result = await Drink.findAll({
                offset: pageIndex * pageSize,
                limit: pageSize,
                where: queryWhere,
                order: orderQuery
            });
            return result;
        } catch (e) {
            throw new Error(e);
        }
    },

    /**
     * 获取并排序
     * orderTag: all('综合'),new('新品'),sale('销售量'),price('价格')
     * orderRule: DESC('降序'),ASC(升序)
     * @Author   KuangGuanghu
     */
    list: async function(ctx) {
        try {
            var result = await DrinkController.getGoodsList(ctx.request.body);
            respond.json(ctx, true, '查询成功', result)
        } catch (e) {
            respond.json(ctx, false, '查询失败', null, e)
        }
    },

    // 推荐商品列表
    listRec: async function(ctx) {
        var { pageIndex, pageSize} = ctx.request.body;
        try {
            var result = await DrinkController.getGoodsList({pageIndex,pageSize,orderTag: 'new',orderRule: 'DESC'},{isRec: '1'});
            respond.json(ctx, true, '查询成功', result)
        } catch (e) {
            respond.json(ctx, false, '查询失败', null, e)
        }
    },

    // 热卖商品列表
    listHot: async function(ctx) {
        var { pageIndex, pageSize} = ctx.request.body;
        try {
            var result = await DrinkController.getGoodsList({pageIndex,pageSize,orderTag: 'new',orderRule: 'DESC'},{isHot: '1'});
            respond.json(ctx, true, '查询成功', result)
        } catch (e) {
            respond.json(ctx, false, '查询失败', null, e)
        }
    },  

    /**
     * 通过产品Id获取产品详细信息
     * @Author   KuangGuanghu
     * @DateTime 2017-07-23
     */
    getOneById: async function(ctx) {
        let { id } = ctx.request.body;
        if (!id) {
            respond.json(ctx, false, '查询参数id不能为空');
        }
        try {
            var imgResult = await DrinkImage.findAll({
                attributes: ['imgPath'],
                where: {
                    drinkId: id
                }
            });

            var imgPaths = [];
            for (var i = 0; i < imgResult.length; i++) {
                imgPaths.push(imgResult[i].imgPath);
            }

            var result = await Drink.findOne({
                where: { id }
            });

            var brand = await DrinkBrand.findOne({
                where: { 
                    id: result.brandId
                }
            });
            result.dataValues.imgPaths = imgPaths;
            result.dataValues.brand = brand;
            respond.json(ctx, true, '查询成功', result);
        } catch (e) {
            respond.json(ctx, false, '查询失败', null, e);
        }
    },

    /**
     * 通过类型获取
     * @Author   KuangGuanghu
     * @DateTime 2017-07-22
     */
    getByCate: async function(ctx) {
        let { pageIndex, pageSize, categoryId, orderTag, orderRule } = ctx.request.body;
        if (!categoryId) {
            respond.json(ctx, false, '查询参数categoryId不能为空');
        }
        pageIndex = pageIndex ? pageIndex : 0;
        pageSize = pageSize ? pageSize : 20;
        pageIndex = parseInt(pageIndex, 10);
        pageSize = parseInt(pageSize, 10);
        try {
            let orderQuery = DrinkController.createOrderQuery(orderTag, orderRule);
            var result = await Drink.findAll({
                // attributes: [],
                offset: pageIndex * pageSize,
                limit: pageSize,
                where: {
                    isDelete: 0,
                    saleState: 1,
                    categoryId: categoryId
                },
                order: orderQuery
            });
            respond.json(ctx, true, '查询成功', result);
        } catch (e) {
            respond.json(ctx, false, '查询失败', null, e);
        }
    },

    /**
     * 通过品牌获取
     * @Author   KuangGuanghu
     * @DateTime 2017-07-22
     */
    getByBrand: async function(ctx) {
        let { pageIndex, pageSize, brandId, orderTag, orderRule } = ctx.request.body;
        if (!brandId) {
            respond.json(ctx, false, '查询参数brandId不能为空');
        }
        pageIndex = pageIndex ? pageIndex : 0;
        pageSize = pageSize ? pageSize : 20;
        pageIndex = parseInt(pageIndex, 10);
        pageSize = parseInt(pageSize, 10);
        try {
            let orderQuery = DrinkController.createOrderQuery(orderTag, orderRule);
            var result = await Drink.findAll({
                // attributes: [],
                offset: pageIndex * pageSize,
                limit: pageSize,
                where: {
                    isDelete: 0,
                    saleState: 1,
                    brandId: brandId
                },
                order: orderQuery
            });
            respond.json(ctx, true, '查询成功', result);
        } catch (e) {
            respond.json(ctx, false, '查询失败', null, e);
        }
    },

    /**
     * 搜索
     * @Author   KuangGuanghu
     * @DateTime 2017-07-22
     */
    findBySearch: async function(ctx) {
        let { pageIndex, pageSize, keyword,orderTag, orderRule } = ctx.request.body;
        keyword = keyword ? keyword : '';
        pageIndex = pageIndex ? pageIndex : 0;
        pageSize = pageSize ? pageSize : 20;
        pageIndex = parseInt(pageIndex, 10);
        pageSize = parseInt(pageSize, 10);

        try {
            let orderQuery = DrinkController.createOrderQuery(orderTag, orderRule);
            var result = await Drink.findAll({
                // attributes: [],
                offset: pageIndex * pageSize,
                limit: pageSize,
                order: orderQuery,
                where: {
                    isDelete: 0,
                    saleState: 1,
                    $or: [{
                            name: {
                                $like: '%' + keyword + '%'
                            }
                        },
                        {
                            brandName: {
                                $like: '%' + keyword + '%'
                            }
                        }
                    ]
                }
            });
            respond.json(ctx, true, '查询成功', result);
        } catch (e) {
            respond.json(ctx, false, '查询失败', null, e);
        }
    },

    /**
     * 根据drinkId判断商品是否存在
     * @Author   KuangGuanghu
     * @DateTime 2017-07-23
     */
    drinkExist: async function(drinkId) {
        const drinks = await Drink.findAll({
            attributes: ['id'],
            where: {
                id: {
                    $eq: drinkId
                }
            }
        });
        return drinks.length > 0;
    }
}

module.exports = DrinkController;