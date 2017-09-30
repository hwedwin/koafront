import './index.css';
import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import {Icon,Toast,InputItem} from 'antd-mobile';
import CommonNavbar from '../../components/CommonNavbar/Index.jsx'
import svgLocation from '../../assets/svg/map-marker.svg';

import Ajax from '../../utils/Ajax';
import Config from '../../config/Config';
import Util from '../../utils/Util';


const GoodsItemB = (props) => (
	<div className="m-goods-item-b">
		<img className="u-logo" src={props.logo}/>
		<div className="m-right">
			<div className="u-name">{props.name}</div>
			<div className="u-bottom">
				<span className="u-price">¥{props.price}</span>
				<span className="u-nums">x {props.num}</span>
			</div>
		</div>
	</div>
)

class OrderCreate extends Component {

	constructor(props) {
		super(props);
		this.state = {
			addressData: {},
			allMoney: 0,
			goods: [],
			totalMoney: 0,
			expressFee: 0,
			remarks: ''
		}
	}

	componentWillMount() {
		Toast.loading('加载中...',0);
		this._getSearch();
	}

	componentDidMount() {
	}

	_request() {
		var ps1 = this._getGoodsInfo();
		var a1 = this._getDefaultAddress();
		ps1.push(a1);
		Promise.all(ps1).then(function() {
			Toast.hide();
		}).catch(function(){
			Toast.hide();
		});
	}

	_getSearch() {
		var goods = JSON.parse(window.decodeURIComponent(Util.getSearch(this.props.location.search,'goods')));
		var addressId = Util.getSearch(this.props.location.search,'address');
		this.setState({
			goods: goods
		},() => {
			this._request();
		});
	}

	_getDefaultAddress() {
		return Ajax.post({url: Config.API.CONSIGNEE_LIST,data: {defaults: true}})
		.then((data) => {
			if (data.status === 200) {
				if (data.data.code === 200) {
					this.setState({
						addressData: data.data.data
					});
				}
			}else{
				Toast.info(data.message);
			}
		}).catch(function(error){
			console.log(error);
		});
	}

	_getGoodsInfo() {
		var promises = [],p,goods = this.state.goods;
		for(let i = 0; i< goods.length; i++) {
			//获取商品
			p = Ajax.post({url: Config.API.DRINK_ONE,data: {id: goods[i].id}})
				p.then((data) => {
					if (data.status === 200) {
						var goodsItem = data.data;
						for(let i = 0; i< goods.length; i++) {
							if (goods[i].id === goodsItem.id) {
								goods[i].info = goodsItem;
								this.setState({
									goods
								},() => {
									this._computeTotal();
								});
							}
						}
					}
				}).catch(function(error){
					console.log(error);
				});
			promises.push(p);
		}
		return promises;
	}

	_computeTotal() {
		var totalMoney = 0;
		for (var i = 0; i < this.state.goods.length; i++) {
			var item = this.state.goods[i];
			if (!item.info) {return;}
			totalMoney += item.info.price * item.num;
		}
		this.setState({
			totalMoney
		});
	}

	_deleteCartGoods() {
		for (var i = 0; i < this.state.goods.length; i++) {
			var item = this.state.goods[i];
			Ajax.post({url: Config.API.CART_DEL_BID,data: {id: item.id}})
			.then((data) => {
			}).catch(function(error){
				console.log(error);
			});
		}
	}

	handleSubmitOrder() {
		var data = {};
		data.totalPrice = this.state.totalMoney;
		data.agentId = 'top';
		data.remarks = this.state.remarks;
		data.goods = [];
		for (var i = 0; i < this.state.goods.length; i++) {
			var item = this.state.goods[i];
			var gItem = {};
			gItem.id = item.id;
			gItem.nums = item.num;
			data.goods.push(gItem);
		}
		data.consignee = this.state.addressData;
		console.log(data);
		Ajax.post({url: Config.API.ORDER_CREATE,data: data})
		.then((data) => {
			Toast.info(data.message);
			if (data.status === 200) {
				this._deleteCartGoods();
			}else{
			}
		}).catch(function(error){
			console.log(error);
		});
	}

	handleRemarksChange(value) {
		this.setState({
			remarks: value
		});
	}

	render() {
		const addressData = this.state.addressData;
		return (
			<div className="page-ordercreate">
				<CommonNavbar 
					centerText="创建订单"
					onBackbarClick={()=>this.props.history.goBack()}
				/>
				<div className="m-address-box">
					<div className="m-left-wrapper">
						<div className="u-top-name">
							<span className="u-name">{addressData.consigneeName}</span>
							<span className="u-mobile">{addressData.consigneeMobile}</span>
						</div>
						<div className="u-address">
							<Icon type={svgLocation} size="xxxs"/>
							<span className="u-text">{addressData.province+addressData.city+addressData.county+'   '+addressData.address}</span>
						</div>
					</div>
					<div className="m-right-wrapper">
						<Icon type="right" color="#b0b0b0" />
					</div>
				</div>
				<div className="u-mail-band"></div>
				<div className="m-goods-box">
					{
						this.state.goods.map(
							(el,ii) => 
							<GoodsItemB 
								key={ii}
								logo={el.info?el.info.imgPath:''}
								name={el.info?el.info.name:''}
								price={el.info?el.info.price:''}
								num={el.num}
							/>
						)
					}
				</div>
				<div className="m-remarks-wrapper">
					<InputItem 
						value={this.state.remarks}
						placeholder="订单备注"
						onChange={this.handleRemarksChange.bind(this)}
					/>
				</div>
				<div className="m-money-box">
					<div className="m-money-item">
						<span className="u-item-name">商品金额</span>
						<span className="u-item-value">¥{this.state.totalMoney}</span>
					</div>
					<div className="m-money-item">
						<span className="u-item-name">运费</span>
						<span className="u-item-value">+ ¥{this.state.expressFee}</span>
					</div>
				</div>
				<div className="m-account-bar">
					<span className="u-all">实付款:¥{this.state.totalMoney+this.state.expressFee}</span>
					<button className="u-btn-account" onClick={this.handleSubmitOrder.bind(this)}>提交订单</button>
				</div>
			</div>
		)
	}
}

export default OrderCreate;
