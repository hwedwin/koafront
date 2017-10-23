const MemberRelationController = {
    create: async function(level,agentId,memberId,t) {
    	var transactionO = {};
    	if (t) {
    		transactionO.transaction = t;
    	}
        try{
            return await MemberRelation.create({
                fxLevel: level,
                pid: agentId,
                cid: memberId,
            }, transactionO);
        }catch(e){
            return e;
        }
    },

    getMemberLevelById: async function(memberId) {
    	try{
	    	var result = await MemberRelation.findOne({
                attributes: ['fxLevel'],
	    		where: {
	    			cid: memberId
	    		}
	    	});
            if (result) {
	    	    return result.fxLevel;
            }
            return null;
    	} catch(e) {
    		return e;
    	}
    },

    getPidByCid: async function(cid) {
        try{
            var result = await MemberRelation.findOne({
                attributes: ['pid'],
                where: {
                    cid: cid
                }
            });
            if (result) {
                return result.pid;
            }
            return null;
        } catch(e) {
            return e;
        }
    },

    getCustomersByMemberId: async function(memberId,pageIndex,pageSize) {
        try{
            var result = await MemberRelation.findAndCountAll({
                where: {
                    pid: memberId
                },
                offset: pageIndex * pageSize,
                limit: pageSize,
                include: [
                    {
                        model: Member,
                        as: 'member'
                    }
                ]
            });
            return result;
        } catch(e) {
            return e;
        }   
    }
};
module.exports = MemberRelationController;

const respond = require('../utils/respond');
const MemberRelation = require('../models/MemberRelation');
const Member = require('../models/Member');
