import './index.css'
import React,{Component} from 'react'
import {Link} from 'react-router-dom'
import {Icon,Toast} from 'antd-mobile'
import CommonNavbar from '../../components/CommonNavbar/Index.jsx'
import IndexFillBottom from '../../components/IndexFillBottom/Index.jsx'
import PMOperatorButton from '../../components/PMOperatorButton/Index.jsx'
import Ajax from '../../utils/Ajax'
import Config from '../../config/Config'
import {connect} from 'react-redux';

const SelectAllBar = (props) => {
	const type = props.selectAll ? "check-circle" : "check-circle-o";
	return (
		<div className="m-select-all-bar">
			<Icon size="sm" type={type} onClick={props.onSelectIconClick} color="red"/><span className="u-text">全选</span>
		</div>
	)
}

const AccountBar = (props) => {
	return (
		<div className="m-account-bar">
			<span className="u-all">合计:¥{props.totalMoney}</span>
			<button className="u-btn-account" onClick={()=>{props.onAccountClick()}}>去结算({props.totalGoods})</button>
		</div>
	)
}

class GoodsItem extends Component {

	constructor(props) {
		super(props);
		this.handleNumChange = this.handleNumChange.bind(this)
		this.handleOperateClick = this.handleOperateClick.bind(this)
		this.state = {
			id: this.props.data.cartId,
			num: this.props.data.cartNum,
			select: true,
			pselect: this.props.pselect
		}
	}

	componentWillReceiveProps(nextProps) {
		if (this.state.pselect !== nextProps.pselect) {
			this.setState({
				select: nextProps.pselect,
				pselect: nextProps.pselect
			},() => {
				this.props.onCheckIconClick(this.state.id,this.state.num,this.state.select);
			});
		}
	}

	handleNumChange(e) {
		let val = parseInt(e.target.value.trim(),10)
		val = isNaN(val) ? 1 : val
		this.setState({
			num: val
		},() => {
			this.props.onNumChange(this.state.id,this.state.num);
		})
	}

	handleOperateClick(op) {
		if (this.state.num <= 1 && op === -1) {
			return false
		}

		this.setState({
			num: this.state.num+op
		},() => {
			this.props.onNumChange(this.state.id,this.state.num);
		})
	}

	handleClick() {
		this.props.onItemClick(this.props.data.id);
	}

	handleCheckIconClick(e) {
		e.stopPropagation();
		this.setState({
			select: !this.state.select
		},()=>{
			this.props.onCheckIconClick(this.state.id,this.state.num,this.state.select);
		});
	}

	render() {
		const type = this.state.select ? "check-circle" : "check-circle-o";
		var data = this.props.data;
		return (
			<div className="m-shopcart-item" onClick={this.handleClick.bind(this)}>
				<Icon size="xs" type={type} color="red" onClick={this.handleCheckIconClick.bind(this)}/>
				<img className="u-logo" src={data.imgPath}/>
				<div className="m-right">
					<div className="u-name">{data.name}</div>
					<div className="u-bottom">
						<span className="u-price">{data.price}</span>
						<PMOperatorButton
							value={this.state.num}
							onNumChange={this.handleNumChange}
							onOperateClick={this.handleOperateClick}
						/>
					</div>
				</div>
			</div>
		)
	}
}


class IndexCart extends Component {

	constructor(props) {
		super(props);
		this.handleSelectAllClick = this.handleSelectAllClick.bind(this)
		this.state = {
			selectAll: true,
			goods: [],
			totalMoney: 0,
			totalGoods: 0,
			isNotLogin: true,
			cart: {

			}
		}
	}

	componentWillMount() {
		Toast.loading('加载中...',0);
	}

	componentDidMount() {
		var self = this;
		// 获取购物车商品
		Ajax.post({url: Config.API.CART_GET},this.props.member.level)
			.then(function(data) {
				if (data.status === 200) {
					var goods = self._formatGoods(data.data);
					var cart={};
					for (var i = 0; i < goods.length; i++) {
						var gItem = goods[i];
						cart[gItem.cartId] = {};
						cart[gItem.cartId].price=gItem.price;
						cart[gItem.cartId].num=gItem.cartNum;
						cart[gItem.cartId].id=gItem.id;
					}
					
					self.setState({
						goods: goods,
						isNotLogin: false,
						cart
					},function(){
						self._computedTotal();
					});
				}else{
					// Toast.info(data.message);
				}
				Toast.hide();
			}).catch(function(error){
				console.log(error);
			});
	}

	_formatGoods(goods) {
		for (var i = 0; i < goods.length; i++) {
			var gItem = goods[i];
			if (gItem.special) {
				gItem.price = gItem.special.specialPrice;
			}
		}
		return goods;
	}

	_computedTotal() {
		var totalMoney=0,totalGoods = 0;
		for (var name in this.state.cart) {
			var gItem = this.state.cart[name];
			totalGoods += gItem.num;
			totalMoney += gItem.num * gItem.price;
		}
		this.setState({
			totalMoney,
			totalGoods
		});
	}

	handleSelectAllClick() {
		this.setState({
			selectAll: !this.state.selectAll
		});
	}

	handleGameItemNumChange(id,num) {
		var cart = this.state.cart;
		cart[id].num = num;
		this.setState({
			cart
		},()=>{
			this._computedTotal();
		});

		// 获取购物车商品
		Ajax.post({url: Config.API.CART_NUMS,data:{id:id,nums: num}})
			.then(function(data) {
				if (data.status === 200) {
				}else{
				}
			}).catch(function(error){
				console.log(error);
			});
	}

	handleGameItemClick(id) {
		this.props.history.push('/goods/'+id);
	}

	handleCheckIconClick(id,num,select) {
		var cart = this.state.cart;
		if (select) {
			cart[id].num = num;
			this.setState({
				cart
			},() => {
				this._computedTotal();
			});
		}else{
			cart[id].num = 0;
			this.setState({
				cart
			},() => {
				this._computedTotal();
			});
		}
	}

	handleAccountButtonClick() {
		const cart = this.state.cart;
		var cartData = [];
		for(let name in cart){
			if (cart[name].num !== 0) {
				var item = {};
				item.id = cart[name].id;
				item.num = cart[name].num;
				cartData.push(item);
			}
		}
		if (cartData.length === 0) {
			Toast.info('请选择要结算的商品');
			return;
		}
		var goods = JSON.stringify(cartData);
		this.props.history.push('/ordercreate/?goods='+goods);
	}

	render() {
		return (
			<div>
				<CommonNavbar 
					showLeftIcon={false}
					centerText="购物车"
				/>
				<div className="m-cart-container">
					<SelectAllBar onSelectIconClick={this.handleSelectAllClick} selectAll={this.state.selectAll}/>
					<div className="m-shopcart-list">
						{
							this.state.goods.map(el => <GoodsItem 
								pselect={this.state.selectAll} 
								data={el}
								key={el.cartId}
								isAgent={this.props.member.level==1||this.props.member.level==2}
								onNumChange={this.handleGameItemNumChange.bind(this)}
								onItemClick={this.handleGameItemClick.bind(this)}
								onCheckIconClick={this.handleCheckIconClick.bind(this)}
								/>)
						}
					</div>
				</div>
				{
					this.state.isNotLogin ? (<div className="m-nologin-box">
												<Link to="/login">用户尚未登录</Link>
											</div>) : null
				}
				<AccountBar 
					totalMoney={this.state.totalMoney}
					totalGoods={this.state.totalGoods}
					onAccountClick={this.handleAccountButtonClick.bind(this)}
				/>
				<IndexFillBottom height={2}/>
			</div>
		)
	}
}

// export default IndexCart
const mapStateToProps = (state) => {
  return {
  	agentId: state.agentId,
    member: state.member
  }
}

export default connect(mapStateToProps)(IndexCart);