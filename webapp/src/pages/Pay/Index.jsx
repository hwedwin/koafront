import './index.css';
import PropTypes from 'prop-types';
import React,{Component} from 'react';
import { Toast ,List, Radio} from 'antd-mobile';
import CommonNavbar from '../../components/CommonNavbar/Index.jsx';
import PayTip from '../../components/PayTip/Index.jsx';
import Ajax from '../../utils/Ajax';
import Config from '../../config/Config';
import Util from '../../utils/Util';

const RadioItem = Radio.RadioItem;

class Pay extends Component {

	constructor(props) {
		super(props);
		this.state = {
			id: this.props.match.params.id,
			type: 0,
			consignee: {},
			drinks: [],
			details: {},
			balance: 0,
			paySuccess: false
		}
	}

	componentWillMount() {
		Toast.loading('加载中...');
	}

	componentDidMount() {
		this.requestData();
		this.requestBalance();
	}

	requestData() {
		Ajax.post({url: Config.API.ORDER_DETAIL,data: {id: this.state.id}})
		.then((res) => {
			Toast.hide();
			if (res.status === 200) {
				if (res.data.code === 200) {
					var o = res.data.data;
					this.setState({
						consignee: o.consignee, 
						drinks: o.drinks,
						details: o
					});
				}
			}else{
				Toast.info(res.message);
			}
		}).catch(function(error){
			console.log(error);
		});
	}

	requestBalance() {
		Ajax.post({url: Config.API.BALANCE_GET})
		.then((res) => {
			Toast.hide();
			if (res.status === 200) {
				if (res.data.code === 200) {
					this.setState({
						balance: res.data.data.balance
					});
				}
			}else{
				Toast.info(res.message);
			}
		}).catch(function(error){
			Toast.hide();
			console.log(error);
		});
	}

	onChange(type) {
		this.setState({
			type
		});
	}

	handlePay() {
		Toast.loading('支付中...',0);
		if (this.state.type == 0) {//微信支付
			var self = this;
			Ajax.post({url: Config.API.ORDER_WEIXIN_PAY,data: {id: this.state.id}})
			.then((res) => {
				Toast.hide();
				if (res.status === 200) {
					Util.wxPay(res.data,function(state){
						Toast.hide();
						if (state) {
							self.handleSuccess();
						}else{
							Toast.info('支付失败，请重试');
						}
					});
				}else{
					Toast.info(res.message);
				}
			}).catch(function(error){
				console.log(error);
			});
		}else{//余额支付
			if (parseFloat(this.state.balance) < parseFloat(this.state.details.totalPrice)) {
				Toast.info('您的余额不足以支付这笔订单');
				return;
			}
			Ajax.post({url: Config.API.ORDER_BALANCE_PAY,data: {id: this.state.id}})
			.then((res) => {
				Toast.hide();
				if (res.status === 200) {
					self.handleSuccess();
				}else{
					Toast.info('支付失败，请重试');
				}
			}).catch(function(error){
				console.log(error);
			});
		}
	}

	handleSuccess() {
		this.setState({
			paySuccess: true
		});
	}

	handlePayTipClose() {
		this.props.history.replace('/order/myOrders');
	}

	handlePayTipDetail() {
		this.props.history.replace('/orderdetail/'+this.state.id);
	}

	handleBackClick() {
		if (window.confirm('确认离开支付页面？')) {
			this.props.history.replace('/order/waitPay')
		}
	}

	render() {
		const payType = [
	      { type: 0, label: '微信支付' },
	      { type: 1, label: '余额支付' },
	    ];
		return (
			<div className="page-pay">
				<CommonNavbar 
					showLeftIcon={false}
					leftContent="我的订单"
					centerText="支付"
					showRightContent={false}
					onBackbarClick={()=>this.handleBackClick()}
				/>
				<div className="m-pay-money">
					<span className="u-text">需支付:<i className="red">{this.state.details.totalPrice}元</i></span>
				</div>
				<List renderHeader={() => '支付方式'}>
			        {payType.map(i => (
			          <RadioItem key={i.type} checked={this.state.type === i.type} onChange={() => this.onChange(i.type)}>
			            {i.label}{i.type === 1 && '('+this.state.balance+'元)'}
			          </RadioItem>
			        ))}
		        </List>
		        <button className="u-button-pay" onClick={this.handlePay.bind(this)}>支付</button>
		        <PayTip
					display={this.state.paySuccess}
					text="支付成功"
					money={this.state.balance+''}
					displayButton={true}
					onCloseClick={this.handlePayTipClose.bind(this)}
					onDetailClick={this.handlePayTipDetail.bind(this)}
				/>
			</div>
		)
	}
}

export default Pay;