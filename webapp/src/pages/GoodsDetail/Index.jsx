import './index.css'
import React,{Component} from 'react'

import Carousel from '../../components/IndexCarousel/Index.jsx'
import IndexFillBottom from '../../components/IndexFillBottom/Index.jsx'
import CommonNavbar from '../../components/CommonNavbar/Index.jsx'
import PMOperatorButton from '../../components/PMOperatorButton/Index.jsx'

import Ajax from '../../utils/Ajax'
import Config from '../../config/Config'

import {Icon,Badge,List,Toast} from 'antd-mobile'
import svgCart from '../../assets/svg/cart.svg'
import svgHeart from '../../assets/svg/heart.svg'
import svgHeartRed from '../../assets/svg/heartRed.svg'
import {connect} from 'react-redux';
import Wrapper from '../Wrapper.jsx';

const BottomBar = props => (
	<div className="m-bottom-bar">
		<div className="m-icon-box" onClick={props.onCollectionClick}>
			<Icon type={props.isCollection ? svgHeartRed : svgHeart}/>
			<span className="u-text" style={props.isCollection ? {color:'#f13030'} : {}}>收藏</span>
		</div>
		<div className="m-icon-box" onClick={props.onCartClick}>
			<Icon type={svgCart}/>
			<span className="u-text">购物车</span>
			<Badge text={props.cartLen}/>
		</div>
		<button 
			className="u-btn-addcart"
			onClick={props.onButtonCartClick}
		>加入购物车</button>
		<button 
			className="u-btn-buy"
			onClick={props.onButtonBuyClick}
		>立即购买</button>
	</div>
)


const BrandBox = props => {
	return (
		<div className="m-brand-box">
			<List className="my-list">
		        <List.Item
		          arrow="horizontal"
		          thumb={props.brand.logo}
		          multipleLine
		          onClick={() => {
		          	props.onItemClick(props.brand.id)
		          }}
		        >
		          {props.brand.brandName}<List.Item.Brief>{props.brand.info}</List.Item.Brief>
		        </List.Item>
		      </List>
		</div>
	)
}

const ParamsBox = props => (
	<div className="m-params-box">
		<div className="m-params-item">
			<div className="u-params-name">规格</div>
			<div className="u-params-content">{props.goodsInfo.standard}</div>
		</div>	
		<div className="m-params-item">
			<div className="u-params-name">产地</div>
			<div className="u-params-content">{props.goodsInfo.origin}</div>
		</div>	
		<div className="m-params-item">
			<div className="u-params-name">类型</div>
			<div className="u-params-content">{props.goodsInfo.categoryName}</div>
		</div>
		<div className="m-params-item">
			<div className="u-params-name">原料</div>
			<div className="u-params-content">{props.goodsInfo.recipe}</div>
		</div>		
		<div className="m-params-item">
			<div className="u-params-name">生产厂家</div>
			<div className="u-params-content">{props.goodsInfo.factory}</div>
		</div>	
		<div className="m-params-item">
			<div className="u-params-name">储存方式</div>
			<div className="u-params-content">{props.goodsInfo.storage}</div>
		</div>	
		<div className="m-params-item">
			<div className="u-params-name">生产日期</div>
			<div className="u-params-content">{props.goodsInfo.pruduceDate}</div>
		</div>	
		<div className="m-params-item">
			<div className="u-params-name">保质期</div>
			<div className="u-params-content">{props.goodsInfo.expire}</div>
		</div>
	</div>
)

const html = `
	<p><img style="text-align: center;" alt="" class="" src="//img30.360buyimg.com/popWaterMark/jfs/t3736/175/1036948284/83462/1cc978e2/5819e4b7N5e87ecb0.jpg"><img style="text-align: center;" alt="" class="" src="//img30.360buyimg.com/popWaterMark/jfs/t3739/208/1028028090/57308/1c45e6ca/5819e4b7Nfca048c2.jpg"><img style="text-align: center;" alt="" class="" src="//img30.360buyimg.com/popWaterMark/jfs/t3694/179/998213232/55468/50bbc627/5819e4b7N0e84b6ab.jpg"><img style="text-align: center;" alt="" class="" src="//img30.360buyimg.com/popWaterMark/jfs/t3388/99/968355184/94921/8f9c9d58/5819e4b7Nba89f12c.jpg"><img style="text-align: center;" alt="" class="" src="//img30.360buyimg.com/popWaterMark/jfs/t3355/301/987736441/54960/ff28091f/5819e4b7Nbebb6d9d.jpg"><img style="text-align: center;" alt="" class="" src="//img30.360buyimg.com/popWaterMark/jfs/t3313/176/937759273/87377/28e549e/5819e4b7Na73dc512.jpg"><img style="text-align: center;" alt="" class="" src="//img30.360buyimg.com/popWaterMark/jfs/t3712/184/956153959/116864/6dcc0153/5819e4b8Nfa0370ce.jpg"><img style="text-align: center;" alt="" class="" src="//img30.360buyimg.com/popWaterMark/jfs/t3379/192/953321034/53614/10c419d/5819e4b8Nce654d77.jpg"><img style="text-align: center;" alt="" class="" src="//img30.360buyimg.com/popWaterMark/jfs/t3520/173/1004957939/58177/a88b6130/5819e4b8N82eefab0.jpg"><img style="text-align: center;" alt="" class="" src="//img30.360buyimg.com/popWaterMark/jfs/t3514/244/985940210/32458/b7d1df8c/5819e4b8N5cf2ef30.jpg"><img style="text-align: center;" alt="" class="" src="//img30.360buyimg.com/popWaterMark/jfs/t3658/193/1022429367/95406/17ad9ce1/5819e4b8Nefa97148.jpg"><img style="text-align: center;" alt="" class="" src="//img30.360buyimg.com/popWaterMark/jfs/t3613/225/961405419/123405/1ad6a365/5819e4b8Nb30bbee7.jpg"><img style="text-align: center;" alt="" class="" src="//img30.360buyimg.com/popWaterMark/jfs/t3754/182/895178950/127128/eab672cb/5819e4b8Nced59daf.jpg"><img style="text-align: center;" alt="" class="" src="//img30.360buyimg.com/popWaterMark/jfs/t3709/194/944519532/126073/c91b8a4f/5819e4b9N6f29a183.jpg"><img style="text-align: center;" alt="" class="" src="//img30.360buyimg.com/popWaterMark/jfs/t3811/192/749325499/134359/a0f2217f/5819e4b9N3bbe91b2.jpg"><img style="text-align: center;" alt="" class="" src="//img30.360buyimg.com/popWaterMark/jfs/t3487/239/981157409/126657/60ed20fa/5819e4b9N8ea9fc0d.jpg"><img style="text-align: center;" alt="" class="" src="//img30.360buyimg.com/popWaterMark/jfs/t3832/215/754837216/136718/66eb9c43/5819e4baNa94212f7.jpg"><img style="text-align: center;" alt="" class="" src="//img30.360buyimg.com/popWaterMark/jfs/t3742/178/922894338/92327/b167aa91/5819e4bbNa3461a52.jpg"><img style="text-align: center;" alt="" class="" src="//img30.360buyimg.com/popWaterMark/jfs/t3736/185/1013814793/110310/65a7dc90/5819e4bbN2dd7dfc9.jpg"><img style="text-align: center;" alt="" class="" src="//img30.360buyimg.com/popWaterMark/jfs/t3574/359/985168022/152612/55898576/5819e4bbNaa1ac541.jpg"><img style="text-align: center;" alt="" class="" src="//img30.360buyimg.com/popWaterMark/jfs/t3457/184/870674494/107163/2b78e7c8/5819e4bbNef1498c1.jpg"><img style="border: 0px; vertical-align: bottom; color: rgb(102, 102, 102); font-family: Arial, Helvetica, sans-serif, 宋体; text-align: center; white-space: normal;" alt="" class="" src="//img30.360buyimg.com/popWaterMark/jfs/t3679/326/681501057/237239/7891c922/5811ecc2N19d39413.jpg"><img style="border: 0px; vertical-align: bottom; color: rgb(102, 102, 102); font-family: Arial, Helvetica, sans-serif, 宋体; text-align: center; white-space: normal;" alt="" class="" src="//img30.360buyimg.com/popWaterMark/jfs/t3358/195/598204745/240956/8d146f43/5811ecc2N5c8d30fc.jpg"><img style="border: 0px; vertical-align: bottom; color: rgb(102, 102, 102); font-family: Arial, Helvetica, sans-serif, 宋体; text-align: center; white-space: normal;" alt="" class="" src="//img30.360buyimg.com/popWaterMark/jfs/t3610/247/686713790/232372/67c44a2c/5811ecc6N885716fa.jpg"><img style="border: 0px; vertical-align: bottom; color: rgb(102, 102, 102); font-family: Arial, Helvetica, sans-serif, 宋体; text-align: center; white-space: normal;" alt="" class="" src="//img30.360buyimg.com/popWaterMark/jfs/t3556/239/615872788/224309/3b955a60/5811ecc6N7011aba8.jpg"></p>
`

class GoodsDetail extends Component {

	constructor(props) {
		super(props);
		console.log(props);
		this.handlePurchaseNumChange = this.handlePurchaseNumChange.bind(this)
		this.handleOperateClick = this.handleOperateClick.bind(this)
		this.state = {
			purchaseNum: 1,
			isCollection: false,
			cartLen: 0,
			goodsInfo: {
				brand: {}
			}
		}
	}

	componentWillMount() {
		Toast.loading('加载中...',0);
	}

	componentDidMount() {
		var self = this;
		//获取商品
		var a1 = Ajax.post({url: Config.API.DRINK_ONE,data: {id: this.props.match.params.id}},this.props.member.isPaidAgent)
			a1.then(function(data) {
				if (data.status === 200) {
					self.setState({
						goodsInfo: data.data
					});
				}
			}).catch(function(error){
				console.log(error);
			});

		// 获取收藏状态
		var a2 = Ajax.post({url: Config.API.FAV_STATE,data: {drinkId: this.props.match.params.id}})
			a2.then(function(data) {
				if (data.status === 200) {
					if (data.data.code === 200) {
						self.setState({
							isCollection: true
						});
					}else{
						self.setState({
							isCollection: false
						});
					}
				}
			}).catch(function(error){
				console.log(error);
			});

		// 获取购物车数量
		var a3 = this._getShopcarCount();
		Promise.all([a1,a2,a3]).then(function(){
			Toast.hide();
		},function(){
			Toast.info('请求超时，请重试');
		}).catch(function(){

		});
	}

	_getShopcarCount() {
		var self = this;
		return Ajax.post({url: Config.API.CART_GET})
		.then(function(data) {
			if (data.status === 200) {
				self.setState({
					cartLen: data.data.length
				})
			}else{
				// Toast.info(data.message);
			}
		},function(){
				Toast.info('请求超时，请重试');
			}).catch(function(error){
			console.log(error);
		});
	}

	handleCartClick() {
		this.props.history.push('/home/cart');
	}

	handleCollectionClick() {
		var self = this;
		Ajax.post({url: Config.API.FAV_COMBINE,data: {drinkId: this.state.goodsInfo.id}})
			.then(function(data) {
				Toast.info(data.message);
				if (data.status === 200) {
					if (data.data.code === 200) {
						self.setState({
							isCollection: true
						});
					}else if(data.data.code === 201){
						self.setState({
							isCollection: false
						});
					}
				}else{
					if(data.data.code === 203){
						setTimeout(function(){
							self.props.history.push('/login');
						},1000);
					}
				}
			},function(){
				Toast.info('请求超时，请重试');
			}).catch(function(error){
				console.log(error);
			});
	}

	handlePurchaseNumChange(e) {
		let val = parseInt(e.target.value.trim(),10)
		val = isNaN(val) ? 1 : val
		this.setState({
			purchaseNum: val
		})
	}

	handleOperateClick(op) {
		if (this.state.purchaseNum <= 1 && op === -1) {
			return false
		}

		this.setState({
			purchaseNum: this.state.purchaseNum+op
		})
	}

	handleBrandClick(brandId) {
		this.props.history.push('/brand/'+brandId+'?brand='+window.escape(this.state.goodsInfo.brand.brandName));
	}

	handleButtonCartClick() {
		Ajax.post({url: Config.API.CART_ADD,data: {drinkId: this.props.match.params.id,nums: this.state.purchaseNum}})
			.then((data) => {
				Toast.info(data.message);
				this._getShopcarCount();
			},function(){
				Toast.info('请求超时，请重试');
			}).catch(function(error){
				console.log(error);
			});
	}

	handleButtonBuyClick() {
		if (!this.props.loginStatus) {
			Toast.info('用户尚未登录');
			return;
		}
		var goods = JSON.stringify([{
			"id": this.state.goodsInfo.id,
			"num": this.state.purchaseNum
		}]);

		this.props.history.push('/ordercreate/?goods='+goods);
	}

	render() {
		var goodsInfo = this.state.goodsInfo;
		// var isAgent = this.props.member.isPaidAgent;
		// var backProfit = 0;
		// if (goodsInfo.special) {
		// 	backProfit = goodsInfo.special.specialPrice - goodsInfo.special.specialPriceAgent;
		// }else{
		// 	backProfit = goodsInfo.retailPrice - goodsInfo.supplyPrice;
		// }
		return (
			<div className="page-goods-detail">
				<CommonNavbar 
					centerText="商品详情"
					fixed={true}
					onBackbarClick={() => this.props.history.goBack()}
				/>
				<Carousel 
					height={7}
					data={goodsInfo.imgPaths}
					adjustImageSize={false}
					pureImage={true}
				/>
				<div className="m-white-block">
					<div className="u-goods-title">
						{goodsInfo.name}
					</div>
					<div className="m-price-box">
						<span className="u-web-price">{(goodsInfo.isTodaySpecial=='1'?'特卖价：¥':'¥')+goodsInfo.price}</span>
						<span className="u-origin-price">¥{goodsInfo.originPrice}</span>
					</div>
					<div className="m-price-box">
						<span className="u-web-price">{goodsInfo.backProfit?'返利：¥'+goodsInfo.backProfit:''}</span>
					</div>
				</div>
				<div className="m-purchase-box">
					<div className="m-item-box">
						<span className="u-tip">数量</span>
						<PMOperatorButton
							value={this.state.purchaseNum}
							onNumChange={this.handlePurchaseNumChange}
							onOperateClick={this.handleOperateClick}
						/>
					</div>
					<div className="m-item-box">
						<span className="u-tip">{goodsInfo.isTodaySpecial=='1'&&'此商品正在特卖中'}</span>
					</div>
					<div className="m-item-box">
						<span className="u-tip">{'产品若无质量问题，一经售出，一概不退不换'}</span>
					</div>
				</div>
				<BrandBox 
					brand={goodsInfo.brand}
					onItemClick={this.handleBrandClick.bind(this)}
				/>
				<BottomBar 
					onCartClick={this.handleCartClick.bind(this)}
					onCollectionClick={this.handleCollectionClick.bind(this)}
					onButtonCartClick={this.handleButtonCartClick.bind(this)}
					onButtonBuyClick={this.handleButtonBuyClick.bind(this)}
					isCollection={this.state.isCollection}
					cartLen={this.state.cartLen}
				/>
				<ParamsBox goodsInfo={goodsInfo}/>
				<div className="m-detail-wrapper" dangerouslySetInnerHTML={{__html:goodsInfo.detail}}></div>
				<IndexFillBottom height={1.5}/>
			</div>
		)
	}
}

// export default GoodsDetail

const mapStateToProps = (state) => {
  return {
  	loginStatus: state.loginStatus,
    member: state.member
  }
};
export default connect(mapStateToProps)(Wrapper(GoodsDetail));