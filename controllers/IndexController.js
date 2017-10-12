const respond = require('../utils/respond');
const Member = require('../models/Member');
const MemberRelationController = require('./MemberRelationController');
const MemberController = require('./MemberController');
const request = require('request');
const wxConfig = require('../config/weixin');
const CommonUtil = require('../utils/CommonUtil');
const IndexController = {
    index: async function(ctx) {
        // 进行微信授权
        if (!ctx.session.openid) {
            ctx.redirect('https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxd49fa3df1b475fa7&redirect_uri=http://www.baebae.cn/wxoauth&response_type=code&scope=snsapi_userinfo&state=index#wechat_redirect');
            return;
        }
        await ctx.render('index');
    },
    regagent: async function(ctx) {
        // 进行微信授权
        if (!ctx.session.openid) {
            ctx.redirect('https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxd49fa3df1b475fa7&redirect_uri=http://www.baebae.cn/wxoauth&response_type=code&scope=snsapi_userinfo&state=regagent#wechat_redirect');
            return;
        }
        await ctx.render('index');
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
        var { code,state } = ctx.request.query;
        var resBody = await IndexController.getWXToken(code);
        resBody = JSON.parse(resBody);
        var resUserInfo = await IndexController.getWXUserInfo(resBody.access_token,resBody.openid);
        console.log(resUserInfo);
        resUserInfo = JSON.parse(resUserInfo);
        // openid
        ctx.cookies.set('openid',resUserInfo.openid);
        ctx.session.openid = resUserInfo.openid;
        // headerimgurl
        // ctx.cookies.set('headerimgurl',resUserInfo.headerimgurl);
        ctx.session.headerimgurl = resUserInfo.headerimgurl;
        // nickname
        // ctx.cookies.set('nickname',resUserInfo.nickname);
        ctx.session.nickname = resUserInfo.nickname;
        // 通过openid登录
        var member = await MemberController.loginByOpenid(resUserInfo.openid);
        if (state === 'regagent' && !member) {
            ctx.redirect('http://www.baebae.cn/regagent');
        }else{
            ctx.redirect('http://www.baebae.cn');
        }
    },

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
            url: reqUrl + CommonUtil.json2RequestParam(params)
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