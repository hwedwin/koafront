// var window.host = 'http://localwindow.host:4000/';
if (window.location.host.indexOf('localhost') > -1) {
	window.host = 'http://localhost:4000/';
}else{
	window.host = '/';
}
var Config = {
	API: {
		TOPADV_LIST: window.host+'api/topadv/list',
		TOPSPE_LIST: window.host+'api/topspe/list',

		// 商品
		DRINK_LIST: window.host+'api/drink/list',
		DRINK_LISTREC: window.host+'api/drink/listrec',
		DRINK_LISTHOT: window.host+'api/drink/listhot',
		DRINK_ONE: window.host+'api/drink/one',
		DRINK_CATE: window.host+'api/drink/listcate',//通过分类获取
		DRINK_BRAND: window.host+'api/drink/listbrand',//通过品牌获取
		DRINK_SEARCH: window.host+'api/drink/search',

		// 收藏
		FAV_ADD: window.host+'api/favorite/add',
		FAV_DEL: window.host+'api/favorite/del',
		FAV_COMBINE: window.host+'api/favorite/combine',
		FAV_STATE: window.host+'api/favorite/state',
		FAV_LIST: window.host+'api/favorite/list',

		// 用户
		MEMBER_LOGIN: window.host+'api/member/login',
		MEMBER_DATA: window.host+'api/member/data',
		MEMBER_EDIT: window.host+'api/member/edit',
		MEMBER_CUSTOMER: window.host+'api/member/customer',
		MEMBER_REG_AGENT: window.host+'api/member/regagent',
		MEMBER_AGENT: window.host+'api/member/agent',
		MEMBER_WXORDER: window.host+'api/member/wxorder',

		// 购物车
		CART_ADD: window.host+'api/cart/add',
		CART_GET: window.host+'api/cart/get',
		CART_NUMS: window.host+'api/cart/nums',
		CART_DEL: window.host+'api/cart/del',
		CART_DEL_BID: window.host+'api/cart/delbid',

		// 品牌
		BRAND_LIST: window.host+'api/brand/list',

		// 收货地址
		CONSIGNEE_LIST: window.host + 'api/consignee/list',
		CONSIGNEE_CREATE: window.host + 'api/consignee/create',
		CONSIGNEE_ONE: window.host + 'api/consignee/one',
		CONSIGNEE_MODIFY: window.host + 'api/consignee/modify',

		// 订单
		ORDER_CREATE: window.host + 'api/order/create',
		ORDER_LIST: window.host + 'api/order/list',
		ORDER_DETAIL: window.host + 'api/order/detail',
		ORDER_COUNT: window.host + 'api/order/count',
		ORDER_SIGN: window.host + 'api/order/sign',
		ORDER_DELETE: window.host + 'api/order/delete',
		ORDER_WEIXIN_PAY: window.host + 'api/order/wxpay',
		ORDER_BALANCE_PAY: window.host + 'api/order/bpay',

		// 验证码
		SMSCODE_REGISTER: window.host + 'api/sms/register',

		// 交易
		TRANS_EXPENSE: window.host + 'api/trans/expense',
		TRANS_SUM_ORDER: window.host + 'api/trans/sumorder',
		TRANS_ITEMS: window.host + 'api/trans/items',

		// 文件上传
		FILE_PORTRAIT: window.host + 'api/file/portrait',

		// 余额
		BALANCE_GET: window.host + 'api/balance/get',

		// 心跳借口
		BEAT: window.host + 'api/beat',
	}
}

export default Config;