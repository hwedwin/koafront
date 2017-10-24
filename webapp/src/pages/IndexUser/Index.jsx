import './index.css';
import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import BlockTitle from '../../components/BlockTitle/Index.jsx';
import {Badge,Grid,Icon,Toast} from 'antd-mobile';
import IndexFillBottom from '../../components/IndexFillBottom/Index.jsx';

import svgWallet from '../../assets/svg/wallet.svg';
import svgPackage from '../../assets/svg/package.svg';
import svgChat from '../../assets/svg/chat3.svg';
import svgClipboard from '../../assets/svg/clipboard2.svg';
import svgHeart from '../../assets/svg/heart.svg';
import svgMap from '../../assets/svg/map-marker.svg';
import svgUsers from '../../assets/svg/users.svg';
import svgCog from '../../assets/svg/cogWhite.svg';
import svgCountRoom from '../../assets/svg/count-room.svg';

import Ajax from '../../utils/Ajax';
import Config from '../../config/Config';
import Util from '../../utils/Util';

import defaultPortrait from '../../assets/images/portrait.png';
import Wrapper from '../Wrapper.jsx';


const PortraitBox = (props) => {
	return (
		<div className="m-portrait-box">
			<div className="m-setting">
				<Link className="u-setting" to="/uedit"><Icon type={svgCog} color="#FFF"/></Link>
			</div>
			<img className="u-portrait" 
				src={props.member.headerImage || defaultPortrait}
				alt="头像" 
				onClick={props.onPortraitClick}/>
			<div className="u-name">{props.member.nickname || '--'}</div>
			<div className="u-level">{Util.formatMemberLevel(props.member)}</div>
		</div>
	)
}

const BanlanceBox = props => {
	return (
		<div className="m-banlance-box">
			<a onClick={()=>props.onBalanceClick()}>
				<div className="u-banlance">{props.expenseAll}</div>
				<div className="u-title">账户余额</div>
			</a>
		</div>
	)
}

const EarningBox = props => {
	return (
		<div className="m-earning-box">
			<div className="m-earning-item">
				<div className="u-num">{props.profit.sale}</div>
				<div className="u-title">累计收益</div>
			</div>
			<div className="m-earning-item">
				<div className="u-num">{props.profit.commission}</div>
				<div className="u-title">累计佣金</div>
			</div>
			<div className="m-earning-item">
				<div className="u-num">{props.profit.order}</div>
				<div className="u-title">累计订单</div>
			</div>
		</div>
	)
}

const ListFour = props => {
	return (
		<div className="m-badge-grid">
			{
				props.data.map((item,ii) => (
						<div className="m-item" key={ii} onClick={() => props.onItemClick(item)}>
							<Icon type={item.icon} size="md"/>
							<div className="u-text">{item.text}</div>
							{item.badge ? <Badge text={item.badge}/> : null}
						</div>
					)
				)
			}
		</div>
	)	
}

const MyOrderBox = props => {
	const data = [
		{
			icon: svgWallet,
			text: '待付款',
			badge: props.countWaitPay,
			tagId: 'waitPay'
		},
		{
			icon: svgPackage,
			text: '待收货',
			badge: props.countWaitSign,
			tagId: 'waitReceive'
		},
		{
			icon: svgChat,
			text: '已完成',
			tagId: 'waitComment'
		},
		{
			icon: svgClipboard,
			text: '我的订单',
			tagId: 'myOrders'
		},
	]
	return (
		<ListFour data={data} {...props}/>
	)
}

const MineBox = props => {
	const data = [
		{
			icon: svgHeart,
			text: '关注商品',
			tagId: 'myFavorite'
		},
		{
			icon: svgMap,
			text: '收货地址管理',
			tagId: 'myAddress'
		},
		{
			icon: svgUsers,
			text: '客户管理',
			tagId: 'myCustomer'
		},
		{
			icon: svgCountRoom,
			text: '账房',
			tagId: 'myCountRoom'
		},
	];
	if (!props.isPaidAgent) {
		data.splice(2,1);
	}
	return (
		<div className="mine-box">
			<ListFour data={data} {...props}/>
		</div>
	)
}

class IndexUser extends Component {
	constructor(props) {
		super(props);
		this.handlePortraitClick = this.handlePortraitClick.bind(this);
		this.handleOrderItemClick = this.handleOrderItemClick.bind(this);
		this.handleMineItemClick = this.handleMineItemClick.bind(this);
		this.state = {
			countWaitPay: 0,
			countWaitSign: 0,
			member: {},
			expenseAll: 0,
			expenseToday: 0,
			orderAll: 0,
			orderToday: 0,
			isPaidAgent: false,
			profit: {}
		}
	}

	componentWillMount() {
		Toast.loading('加载中...');
	}

	componentDidMount() {
		var p1 = this._getOrderCount();
		var p2 = this._getMemberData();
		var p3 = this._getExpense();
		var p4 = this._getOrder();
		var p5 = this._getTransProfit();
		Promise.all([p2,p3,p4,p5].concat(p1)).then(function() {
			Toast.hide();
		}).catch(function() {

		});
	}

	_getTransProfit() {
		return Ajax.post({url: Config.API.TRANS_PROFIT})
		.then((res) => {
			if (res.status === 200) {
				if (res.data.code === 200) {
					this.setState({
						profit: res.data.data
					});
				}
			}else{
				Toast.info(res.message);
			}
		},function(error){
				Toast.hide();
				console.log(error);
		}).catch(function(error){
			console.log(error);
		});
	}

	_getOrderCount() {
		var t1 =  Ajax.post({url: Config.API.ORDER_COUNT,data: {state: 1}})
		.then((res) => {
			if (res.status === 200) {
				if (res.data.code === 200) {
					this.setState({
						countWaitPay: res.data.data.count
					});
				}
			}else{
				Toast.info(res.message);
			}
		},function(error){
				Toast.hide();
				console.log(error);
		}).catch(function(error){
			console.log(error);
		});

		var t2 = Ajax.post({url: Config.API.ORDER_COUNT,data: {state: 3}})
		.then((res) => {
			if (res.status === 200) {
				if (res.data.code === 200) {
					this.setState({
						countWaitSign: res.data.data.count
					});
				}
			}else{
				Toast.info(res.message);
			}
		},function(error){
				Toast.hide();
				console.log(error);
		}).catch(function(error){
			console.log(error);
		});
		return [t1,t2];
	}

	_getMemberData() {
		return Ajax.post({url: Config.API.MEMBER_DATA})
		.then((res) => {
			if (res.status === 200) {
				if (res.data.code === 200) {
					var mData = res.data.data
					this.setState({
						member: mData,
						isPaidAgent: mData.isAgent == '1' && mData.isPay == '1'
					});
				}
			}else{
				Toast.info(res.message);
			}
		},function(error){
			Toast.hide();
			console.log(error);
		}).catch(function(error){
			console.log(error);
		});
	}

	_getExpense() {
		var p1 = Ajax.post({url: Config.API.BALANCE_GET})
		.then((res) => {
			if (res.status === 200) {
				if (res.data.code === 200) {
					this.setState({
						expenseAll: res.data.data.balance
					});
				}
			}else{
				Toast.info(res.message);
			}
		},function(error){
				Toast.hide();
				console.log(error);
		}).catch(function(error){
			console.log(error);
		});
		var p2 = Ajax.post({url: Config.API.TRANS_EXPENSE,data: {date: Util.formatDate('yyyy-MM-dd')}})
		.then((res) => {
			if (res.status === 200) {
				if (res.data.code === 200) {
					this.setState({
						expenseToday: res.data.data.sum
					});
				}
			}else{
				Toast.info(res.message);
			}
		},function(error){
				Toast.hide();
				console.log(error);
			}).catch(function(error){
			console.log(error);
		});

		return [p1,p2];
	}

	_getOrder() {
		var p1 = Ajax.post({url: Config.API.TRANS_SUM_ORDER})
		.then((res) => {
			if (res.status === 200) {
				if (res.data.code === 200) {
					this.setState({
						orderAll: res.data.data.count
					});
				}
			}else{
				Toast.info(res.message);
			}
		},function(error){
				Toast.hide();
				console.log(error);
			}).catch(function(error){
			console.log(error);
		});
		var p2 = Ajax.post({url: Config.API.TRANS_SUM_ORDER,data: {date: Util.formatDate('yyyy-MM-dd')}})
		.then((res) => {
			if (res.status === 200) {
				if (res.data.code === 200) {
					this.setState({
						orderToday: res.data.data.count
					});
				}
			}else{
				Toast.info(res.message);
			}
		},function(error){
				Toast.hide();
				console.log(error);
			}).catch(function(error){
			console.log(error);
		});
		return [p1,p2];
	}

	handlePortraitClick() {
		if (Object.keys(this.state.member).length > 0) {
			this.props.history.push('/uedit');
		}else{
			this.props.history.push('/login');
		}
	}

	handleOrderItemClick(item) {
		this.props.history.push('/order/'+item.tagId);
	}

	handleMineItemClick(item) {
		var href = '';
		if (item.tagId === 'myAddress') {
			href = '/address';
		}else if(item.tagId === 'myFavorite'){
			href = '/favorite';
		}else if(item.tagId === 'myCustomer'){
			href = '/customer'
		}else if(item.tagId === 'myCountRoom'){
			href = '/countroom'
		}
		this.props.history.push(href);
	}

	render() {
		return (
			<div>
				<PortraitBox 
					member={this.state.member}
					onPortraitClick={this.handlePortraitClick}/>
				<BanlanceBox 
					expenseAll={this.state.expenseAll}
					onBalanceClick={()=>this.props.history.push('/balance')}
				/>
				{
					this.state.isPaidAgent 
					&& 
					(<EarningBox 
						profit={this.state.profit}
					/>)
				}
				<BlockTitle title="订单管理"/>
				<MyOrderBox 
					countWaitPay={this.state.countWaitPay}
					countWaitSign={this.state.countWaitSign}
					onItemClick={this.handleOrderItemClick}
				/>
				<BlockTitle title="我的"/>
				<MineBox 
					onItemClick={this.handleMineItemClick}
					isPaidAgent={this.state.isPaidAgent}
				/>
				<IndexFillBottom />
			</div>
		)
	}
}

export default Wrapper(IndexUser);