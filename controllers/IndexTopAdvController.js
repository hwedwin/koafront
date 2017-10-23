const IndexTopAdvController = {
    list: async function(ctx) {
        try {
            const advs = await IndexTopAdv.findAll({
                where: {
                    isshow: {
                        $eq: '1'
                    }
                }
            });
            respond.json(ctx, true, '获取成功', advs);
        } catch (e) {
            respond.json(ctx, false, '获取成功', null, e);
        }
    }
};
module.exports = IndexTopAdvController;

const IndexTopAdv = require('../models/IndexTopAdv');
const respond = require('../utils/respond');