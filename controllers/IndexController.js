const IndexController = {
    index: async function(ctx) {
        console.log(ctx.session.headerimgurl);
        ctx.session.headerimgurl = null;
        var {aid} = ctx.request.query;
        aid = aid ? aid : '';
        // 进行微信授权
        if (!ctx.session.openid || !ctx.session.wxticket) {
            ctx.redirect('https://open.weixin.qq.com/connect/oauth2/authorize?appid='+wxConfig.appid+'&redirect_uri=http://www.baebae.cn/wxoauth&response_type=code&scope=snsapi_userinfo&state=index'+aid+'#wechat_redirect');
            return;
        }
        var member = await MemberController.loginByOpenid(ctx,ctx.session.openid);
        if (member) {ctx.session.memberId = member.id}
        await ctx.render('index');
    },
    regagent: async function(ctx) {
        var {aid} = ctx.request.query;
        aid = aid ? aid : '';
        // 进行微信授权
        if (!ctx.session.openid || !ctx.session.wxticket) {
            ctx.redirect('https://open.weixin.qq.com/connect/oauth2/authorize?appid='+wxConfig.appid+'&redirect_uri=http://www.baebae.cn/wxoauth&response_type=code&scope=snsapi_userinfo&state=regagent'+aid+'#wechat_redirect');
            return;
        }
        var member = await MemberController.loginByOpenid(ctx,ctx.session.openid);
        if (member) {ctx.session.memberId = member.id}
        await ctx.render('index');
    },
    beat: async function(ctx) {
        var memberId = ctx.session.memberId;
        //查询
        try {
            if (!memberId && ctx.session.openid) {
                var memberR = await MemberController.loginByOpenid(ctx,ctx.session.openid);
                memberId = memberR.id;
            }
            if (memberId) {
                let member = await MemberController.obtainDataById(memberId);
                if (!member) {
                   respond.json(ctx, true, '无此用户', { code: 203 }); 
                   return;
                }
                if (member instanceof Error) {
                    throw new Error(member);
                }
                respond.json(ctx, true, '用户已登录', {
                    code: 200,
                    data: member
                });
            } else {
                respond.json(ctx, true, '用户尚未登录', { code: 203 });
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
        resUserInfo = JSON.parse(resUserInfo);
        // openid
        ctx.cookies.set('openid',resUserInfo.openid);
        ctx.session.openid = resUserInfo.openid;
        // headerimgurl
        ctx.session.headerimgurl = unescape(resUserInfo.headerimgurl);
        console.log('sessionUrl:'+ctx.session.headerimgurl)
        // nickname
        ctx.session.nickname = resUserInfo.nickname;
        // 获取jsAPI
        var baseToken = await IndexController.getBaseToken();
        baseToken = JSON.parse(baseToken);

        var ticketBody = await IndexController.getJsTicket(baseToken.access_token);
        ticketBody = JSON.parse(ticketBody);
        if (ticketBody && ticketBody.errmsg == 'ok') {
            ctx.session.wxticket = ticketBody.ticket;
            setTimeout(() => {
                ctx.session.wxticket = null;
            },7200000);
        }

        // 通过openid登录
        var member = await MemberController.loginByOpenid(resUserInfo.openid);
        var mats = /^regagent(.*)/.exec(state);
        var redUrl = '';
        if (mats) {
            redUrl = 'http://www.baebae.cn/regagent';
            if (mats[1] !== '') {
                redUrl = redUrl+'?aid='+mats[1];
            }
        }else{
            redUrl = 'http://www.baebae.cn';
            mats = /^index(.*)/.exec(state);
            if (mats && mats[1] !== '') {
                redUrl = redUrl+'?aid='+mats[1]; 
            }
        }
        ctx.redirect(redUrl);
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
    },

    getBaseToken: function() {
        let reqUrl = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+wxConfig.appid+'&secret='+wxConfig.appSecret;

        let options = {
            method: 'get',
            url: reqUrl
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

    getJsTicket: function(AccessToken) {
        let reqUrl = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?';
        let params = {
            access_token: AccessToken,
            type: 'jsapi'   
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
    },

    getWeixinJSConfig: async function(ctx){
        var {url} = ctx.request.body;
        url = unescape(url);
        var sign = weixinSign(ctx.session.wxticket,url);
        respond.json(ctx, true, '获取签名成功',sign);
    }
};
module.exports = IndexController;

const respond = require('../utils/respond');
const Member = require('../models/Member');
const MemberRelationController = require('./MemberRelationController');
const MemberController = require('./MemberController');
const request = require('request');
const wxConfig = require('../config/weixin');
const CommonUtil = require('../utils/CommonUtil');
const weixinSign = require('../core/weixinSign');