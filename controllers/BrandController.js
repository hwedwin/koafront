const BrandController = {
    list: async function(ctx) {
        let { cate } = ctx.request.body;
        try {
            var queryCondition = {
                state: {
                    $eq: 1
                }
            };
            if (cate) {
                queryCondition.categoryId = { $eq: cate };
            }
            var brands = await DrinkBrand.findAll({
                attributes: ['id', 'brandName', 'info', 'logo','categoryId'],
                where: queryCondition
            });
            respond.json(ctx, true, '获取成功', brands);
        } catch (e) {
            respond.json(ctx, true, '获取失败', null, e);
        }
    }
}
module.exports = BrandController;

const DrinkBrand = require('../models/DrinkBrand');
const respond = require('../utils/respond');