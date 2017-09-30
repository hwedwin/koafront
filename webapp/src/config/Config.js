var host = 'http://localhost:4000/';
var Config = {
	API: {
		TOPADV_LIST: host+'api/topadv/list',
		TOPSPE_LIST: host+'api/topspe/list',

		// 商品
		DRINK_LIST: host+'api/drink/list',
		DRINK_LISTREC: host+'api/drink/listrec',
		DRINK_LISTHOT: host+'api/drink/listhot',
		DRINK_ONE: host+'api/drink/one',
		DRINK_CATE: host+'api/drink/listcate',//通过分类获取
		DRINK_BRAND: host+'api/drink/listbrand',//通过品牌获取
		DRINK_SEARCH: host+'api/drink/search',

		// 收藏
		FAV_ADD: host+'api/favorite/add',
		FAV_DEL: host+'api/favorite/del',
		FAV_COMBINE: host+'api/favorite/combine',
		FAV_STATE: host+'api/favorite/state',
		FAV_LIST: host+'api/favorite/list',

		// 用户
		MEMBER_LOGIN: host+'api/member/login',
		MEMBER_DATA: host+'api/member/data',
		MEMBER_EDIT: host+'api/member/edit',
		MEMBER_CUSTOMER: host+'api/member/customer',

		// 购物车
		CART_ADD: host+'api/cart/add',
		CART_GET: host+'api/cart/get',
		CART_NUMS: host+'api/cart/nums',
		CART_DEL: host+'api/cart/del',
		CART_DEL_BID: host+'api/cart/delbid',

		// 品牌
		BRAND_LIST: host+'api/brand/list',

		// 收货地址
		CONSIGNEE_LIST: host + 'api/consignee/list',
		CONSIGNEE_CREATE: host + 'api/consignee/create',
		CONSIGNEE_ONE: host + 'api/consignee/one',
		CONSIGNEE_MODIFY: host + 'api/consignee/modify',

		// 订单
		ORDER_CREATE: host + 'api/order/create',
		ORDER_LIST: host + 'api/order/list',
		ORDER_DETAIL: host + 'api/order/detail',
		ORDER_COUNT: host + 'api/order/count',
		ORDER_SIGN: host + 'api/order/sign',

		// 交易
		TRANS_EXPENSE: host + 'api/trans/expense',
		TRANS_SUM_ORDER: host + 'api/trans/sumorder',

		// 文件上传
		FILE_PORTRAIT: host + 'api/file/portrait',

		// 余额
		BALANCE_GET: host + 'api/balance/get',

		// 心跳借口
		BEAT: host + 'api/beat',
	}
}

export default Config;