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
    }
}

export default Util;