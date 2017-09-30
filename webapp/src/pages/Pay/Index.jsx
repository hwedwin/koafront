import './index.css';
import PropTypes from 'prop-types';
import React,{Component} from 'react';
import { Toast ,List, Radio} from 'antd-mobile';
import CommonNavbar from '../../components/CommonNavbar/Index.jsx';
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
			balance: 0
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
						banlance: res.data.data.balance
					});
				}
			}else{
				Toast.info(res.message);
			}
		}).catch(function(error){
			console.log(error);
		});
	}

	onChange(type) {
		this.setState({
			type
		});
	}

	handlePay() {
		console.log('pay')
	}

	render() {
		const payType = [
	      { type: 0, label: '微信支付' },
	      { type: 1, label: '余额支付' },
	    ];
		return (
			<div className="page-pay">
				<CommonNavbar 
					centerText="支付"
					onBackbarClick={()=>this.props.history.goBack()}
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
			</div>
		)
	}
}

export default Pay;