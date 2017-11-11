var wxUtil = {
    init: function(title, link, logo, desc) {

    },

    share: function(data,title, link, logo, desc, fnSuccess, fnCancle) {
    	fnSuccess = fnSuccess ? fnSuccess : function() {};
    	fnCancle = fnCancle ? fnCancle : function() {};
        var wx = window.wx;
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: 'wx401d956d445ec5aa', // 必填，公众号的唯一标识
            timestamp: data.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.nonceStr, // 必填，生成签名的随机串
            signature: data.signature, // 必填，签名，见附录1
            jsApiList: [
                'onMenuShareTimeline',
                'onMenuShareAppMessage'
            ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });

        wx.ready(function() {
            wx.onMenuShareTimeline({
                title: title, // 分享标题
                link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: logo, // 分享图标
                success: fnSuccess,
                cancel: fnCancle
            });

            wx.onMenuShareAppMessage({
                title: title, // 分享标题
                desc: desc, // 分享描述
                link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: logo, // 分享图标
                type: 'link', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: fnSuccess,
                cancel: fnCancle
            });
        });

        wx.error(function(res) {
            console.log('err');
            console.log(res);
        });
    }
}

export default wxUtil;