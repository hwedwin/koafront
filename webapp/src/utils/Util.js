const Util = {
    fillZero: function(num) {
        if (num < 10) {
            return '0' + num;
        }
        return num;
    },

    getSearch: function(searchStr, name) {
        if (!searchStr) {
            return null;
        }
        searchStr = window.unescape(searchStr);
        searchStr = searchStr.substr(1);
        var reg = new RegExp(name + '=([^&]*)');
        if (reg.exec(searchStr)) {
            return reg.exec(searchStr)[1];
        }
        return null;
    },

    isMobile: function(mobile) {
        return /^1[3|4|5|7|8][0-9]\d{4,8}$/.test(mobile);
    },

    getCateById: function(id) {
        var obj = {
            1: '白酒',
            2: '红酒',
            3: '啤酒',
            4: '其他'
        }

        return obj[id];
    },

    formatOrderState: function(state) {
        var stateMap = {
            1: '待付款',
            2: '待配货',
            3: '发货中',
            4: '待签收',
            5: '待退款',
            9: '交易成功',
            19: '已退款',
            99: '交易取消'
        }
        return stateMap[state];
    },

    formatMemberLevel: function(member) {
        if (member.isAgent == '1' && member.isPay == '1') {
            return '商城经销商';
        }
        return '商城会员';
    },

    formatDate: function(format, timeStamp) {
        var date = timeStamp ? new Date(timeStamp) : new Date();
        return format.replace(/yyyy/, date.getFullYear())
            .replace(/MM/, this.fillZero(date.getMonth() + 1))
            .replace(/dd/, this.fillZero(date.getDate()))
            .replace(/hh/, this.fillZero(date.getHours()))
            .replace(/mm/, this.fillZero(date.getMinutes()))
            .replace(/ss/, this.fillZero(date.getSeconds()));
    },

    wxPay: function(order, fn) {
        if (typeof window.WeixinJSBridge === 'undefined') {
            return;
        }
        window.WeixinJSBridge.invoke(
            'getBrandWCPayRequest',
            order,
            function(res) {
                if (res.err_msg == "get_brand_wcpay_request:ok") {
                    fn(true);
                } else {
                    fn(false);
                }
            }
        );
    },

    isAndroid: function() {
        var u = window.navigator.userAgent;
        return u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
    },

    weixinVersion: function() {
        var str = window.navigator.userAgent;
        var v0 = [6,3,31];
        var regExp = /MicroMessenger\/([\d|\.]+)/;
        if (regExp.exec(str)===null) {return}
        var v1 = regExp.exec(str)[1].split('.');
        if (v1.length >= 4) {
            v1 = v1.slice(0,3);
        }
        v1 = v1.map(function(v){
            return parseInt(v, 10);
        });
        if (v1[0] > v0[0]) {
            return true;
        }
        if (v1[0] === v0[0] && v1[1] > v0[1]) {
            return true;
        }
        if (v1[0] === v0[0] && v1[1] === v0[1] && v1[2] >= v0[2]) {
            return true;
        }
        return false;
    }
}

export default Util;