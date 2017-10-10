const respond = require('../utils/respond');
const Member = require('../models/Member');
const MemberRelationController = require('./MemberRelationController');
const request = require('request');
const wxConfig = require('../config/weixin');
const CommonUtil = require('../utils/CommonUtil');
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
                respond.json(ctx, true, '用户已登录', {
                    code: 200,
                    data: {
                        id: memberId,
                        level: memberLevel
                    }
                });
            } else {
                respond.json(ctx, true, '用户未登录', { code: 203 });
            }
        } catch (e) {
            respond.json(ctx, false, '失败,服务器内部错误', null, e);
        }
    },

    wxOauth: async function(ctx) {
        var { code } = ctx.request.body;
        console.log('code:'+code);
        var resBody = await IndexController.getWXToken(code);
        resBody = JSON.parse(resBody);
        console.log('resBody:'+resBody);
        var resUserInfo = await IndexController.getWXUserInfo(resBody.access_token,resBody.openid);
        console.log('resUserInfo:'+resUserInfo);
        ctx.type = 'text/plain';
        ctx.body = resUserInfo;
    },

    //getWebToken.js
    getWXToken: function(code) {
        let reqUrl = 'https://api.weixin.qq.com/sns/oauth2/access_token?';
        let params = {
            appid: wxConfig.appid,
            secret: wxConfig.appSecret,
            code: code,
            grant_type: 'authorization_code'
        };

        let options = {
            method: 'get',
            url: reqUrl + CommonUtil.json2RequestParam(params)
        };
        console.log(options.url);
        return new Promise((resolve, reject) => {
            request(options, function(err, res, body) {
                if (res) {
                    resolve(body);
                } else {
                    reject(err);
                }
            })
        });
    },

    getWXUserInfo: function(AccessToken, openId) {
        let reqUrl = 'https://api.weixin.qq.com/sns/userinfo?';
        let params = {
            access_token: AccessToken,
            openid: openId,
            lang: 'zh_CN'
        };

        let options = {
            method: 'get',
            url: reqUrl + qs.stringify(params)
        };

        return new Promise((resolve, reject) => {
            request(options, function(err, res, body) {
                if (res) {
                    resolve(body);
                } else {
                    reject(err);
                }
            });
        })
    }
}

module.exports = IndexController;