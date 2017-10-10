const IndexTopSpecial = require('../models/IndexTopSpecial')
const Drink = require('../models/Drink')
const respond = require('../utils/respond')
const IndexTopSpecialController = {
    list: async function(ctx) {
        var date = new Date();
        var fillZero = function(num){if (num < 10) {return '0'+num}return num;}
        var today = date.getFullYear()+'-'+fillZero((date.getMonth()+1))+'-'+fillZero(date.getDate());
        try {
            const specials = await IndexTopSpecial.findAll({
                where: {
                    isshow: {
                        $eq: '1'
                    },
                    isDelete: {
                        $eq: '0'
                    },
                    timeChunk: today
                    // startTime: {
                    //     $gt: todayTimestamp
                    // },
                    // endTime: {
                    //     $lt: todayTimestamp+24*60*60*1000
                    // }
                },
                include: [
                    {
                        attributes: ['originPrice','imgPath','name'],
                        model: Drink,
                        as: 'drink'
                    }
                ]
            });
            respond.json(ctx, true, '获取成功', specials);
        } catch (e) {
            respond.json(ctx, false, '获取失败', null, e);
        }
    },

    getOneById: async function(id) {
        var date = new Date();
        var fillZero = function(num){if (num < 10) {return '0'+num}return num;}
        var today = date.getFullYear()+'-'+fillZero((date.getMonth()+1))+'-'+fillZero(date.getDate());
        try{
            return await IndexTopSpecial.findOne({
                where: {
                    drinkId: id,
                    isshow: '1',
                    isDelete: '0',
                    timeChunk: today
                }
            });
        }catch(e){
            return e;
        }
    }
}

module.exports = IndexTopSpecialController;