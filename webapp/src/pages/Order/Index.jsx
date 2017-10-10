import './index.css';
import PropTypes from 'prop-types';
import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import { Tabs ,Toast} from 'antd-mobile';
import CommonNavbar from '../../components/CommonNavbar/Index.jsx';
import Ajax from '../../utils/Ajax';
import Config from '../../config/Config';
import Util from '../../utils/Util';


function getCount(props) {
	var count = 0;
	props.data.drinks.forEach(function(el) {
		count += el.nums;
	});
	return count;
}

class OrderItem extends Component {

	static propTypes = {
		onButtonClick: PropTypes.func
	}

	getButtonText() {
		var state = this.props.data.progressState;
		if (state == 1) {
			return '去付款';
		} else if(state == 3){
			return '确认收货';
		}else {
			return '再次购买';
		}
	}

	handleButtonClick(e) {
		e.preventDefault();
		e.stopPropagation();
		var state = this.props.data.progressState;
		var id = this.props.data.id;
		
		this.props.onButtonClick(state,id);
	}

	handleItemClick() {
		this.props.onItemClick(this.props.data.id);
	}

	handleDeleteClick(e) {
		e.stopPropagation();
		this.props.onDelete(this.props.data.id);
	}

	render() {
		var props = this.props;
		return (
			<div className="m-order-item" onClick={this.handleItemClick.bind(this)}>
				<div className="m-top-box">
					<Link className="u-link-shop" to="/"></Link>
					<div>
						<span className="u-order-status-tip">{Util.formatOrderState(props.data.progressState)}</span>
						<span className="u-btn-delete" onClick={this.handleDeleteClick.bind(this)}>删除</span>
					</div>
				</div>
				<div className="m-center-item">
					{
						props.data.drinks.map(drink => 
							<img className="u-logo-item" key={drink.id} src={drink.drink.imgPath}/>
						)
					}
					<div className="u-desc">
						
					</div>
				</div>
				<div className="m-order-num">
					共{getCount(props)}件商品 实付款：<span className="u-big">¥{props.data.orderTotalPrice}</span>
				</div>
				<div className="m-opt-box">
					<button className="u-btn-opt red" onClick={this.handleButtonClick.bind(this)}>{this.getButtonText()}</button>
				</div>
			</div>
		)
	}
}


class Order extends Component {

	constructor(props) {
		super(props);
		this.handleTabChange = this.handleTabChange.bind(this);
		this.handleTabClick = this.handleTabClick.bind(this);
		this.state = {
			orderAll: [],
			defaultActiveKey: "1"
		}
	}

	componentWillMount() {
		this._getActiveKey();
	}

	componentDidMount() {
	}

	_getOrderByTag(state) {
		Toast.loading('加载中...',0);
		var self = this;
		// 获取全部订单
		Ajax.post({url: Config.API.ORDER_LIST,data: {state}})
			.then(function(data) {
				Toast.hide();
				if (data.status === 200 && data.data.code === 200) {
					self.setState({
						orderAll: data.data.data
					});
				}else{
					Toast.info(data.message);
				}
			}).catch(function(error){
				console.log(error);
			});
	}

	_getActiveKey() {
		var tag = this.props.match.params.tab;
		var defaultActiveKey = "1";
		if (tag === 'waitPay') {
			defaultActiveKey = "2";
		}else if(tag === 'waitReceive'){
			defaultActiveKey = "3";
		}else if(tag === 'waitComment'){
			defaultActiveKey = "4";
		}
		this.setState({defaultActiveKey},()=>{
			this.handleTabClick(defaultActiveKey);
		});
	}

	requestReceiveOrder(id) {
		Toast.loading('签收中...',0);
		// 获取全部订单
		Ajax.post({url: Config.API.ORDER_SIGN,data: {id: id}})
			.then((data) => {
				Toast.info(data.message);
				if (data.status === 200) {
					this.setState({defaultActiveKey: "4"},()=>{
						this.handleTabClick(4);
					});
				}else{
				}
			}).catch(function(error){
				console.log(error);
			});
	}

	handleTabChange(key) {
	  console.log('onChange', key);
	}

	handleTabClick(key) {
	  var state = null;
	  if (key == 2) {
	  	state = 1;
	  }else if(key == 3) {
	  	state = 3;
	  }else if(key == 4) {
	  	state = 9;
	  }
	  this._getOrderByTag(state);
	}

	handleOrderButtonClick(state,id) {
		if (state == 1) {
			this.props.history.push('/pay/'+id);
		} else if(state == 3){
			this.requestReceiveOrder(id);
		}else {
		}
		console.log(state)
		console.log(id)
	}

	handleOrderClick(id) {
		this.props.history.push('/orderdetail/'+id)
	}

	handleOrderDelete(id) {
		if (window.confirm('确定要删除此订单吗？')) {
			Ajax.post({url: Config.API.ORDER_DELETE,data: {id: id}})
			.then((data) => {
				Toast.info(data.message);
				if (data.status === 200) {
					this.handleTabClick(this.state.defaultActiveKey);
				}else{
				}
			}).catch(function(error){
				console.log(error);
			});
		}
	}

	render() {
		return (
			<div className="page-order">
				<CommonNavbar 
					centerText="我的订单"
					onBackbarClick={()=>this.props.history.goBack()}
				/>
				<Tabs defaultActiveKey={this.state.defaultActiveKey} animated={false} onChange={this.handleTabChange} onTabClick={this.handleTabClick}>
			      <Tabs.TabPane tab="全部" key="1">
			        <div>
			        	{
			        		this.state.orderAll.map(el => 
			           				<OrderItem 
			           				data={el}
			           				key={el.id}
			           				onButtonClick={this.handleOrderButtonClick.bind(this)}
			           				onDelete={this.handleOrderDelete.bind(this)}
			           				onItemClick={this.handleOrderClick.bind(this)} />
			        			)
			        	}
			        </div>
			      </Tabs.TabPane>
			      <Tabs.TabPane tab="待付款" key="2">
			        <div>
			        	{
			        		this.state.orderAll.map(el => 
			           				<OrderItem 
			           				data={el}
			           				key={el.id}
			           				onButtonClick={this.handleOrderButtonClick.bind(this)}
			           				onDelete={this.handleOrderDelete.bind(this)}
			           				onItemClick={this.handleOrderClick.bind(this)} />
			        			)
			        	}
			        </div>
			      </Tabs.TabPane>
			      <Tabs.TabPane tab="待收货" key="3">
			        <div>
			        	{
			        		this.state.orderAll.map(el => 
			           				<OrderItem 
			           				data={el}
			           				key={el.id}
			           				onButtonClick={this.handleOrderButtonClick.bind(this)}
			           				onDelete={this.handleOrderDelete.bind(this)}
			           				onItemClick={this.handleOrderClick.bind(this)} />
			        			)
			        	}
			        </div>
			      </Tabs.TabPane>
			      <Tabs.TabPane tab="已完成" key="4">
			        <div>
			        	{
			        		this.state.orderAll.map(el => 
			           				<OrderItem 
			           				data={el}
			           				key={el.id}
			           				onButtonClick={this.handleOrderButtonClick.bind(this)}
			           				onDelete={this.handleOrderDelete.bind(this)}
			           				onItemClick={this.handleOrderClick.bind(this)} />
			        			)
			        	}
			        </div>
			      </Tabs.TabPane>
			    </Tabs>
			</div>
		)
	}
}

export default Order