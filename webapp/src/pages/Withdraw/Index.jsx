import './index.css';
import React,{Component} from 'react';
import CommonNavbar from '../../components/CommonNavbar/Index.jsx';
import {Toast} from 'antd-mobile';
import Ajax from '../../utils/Ajax';
import Config from '../../config/Config';
import PayTip from '../../components/PayTip/Index.jsx';

class Withdraw extends Component {

	constructor(props) {
		super(props);
		this.state = {
			amount: '',
			avalidAmount: 0,
			withSuccess: false
		}
	}

	componentWillMount() {
		Toast.loading('加载中...',0)
		var p1 = Ajax.post({url: Config.API.BALANCE_GET})
		.then((res) => {
			Toast.hide();
			if (res.status === 200) {
				if (res.data.code === 200) {
					this.setState({
						avalidAmount: res.data.data.balance
					});
				}
			}else{
				Toast.info(res.message);
			}
		}).catch(function(error){
			Toast.info('服务器内部错误');
		});
	}

	_prehandleAmount(value) {
		value = value.replace(/[^\d.]/g,'');
		value = parseFloat(value);
		return value;
	}

	handleAmountChange(e) {
		var value = e.target.value;
		value = this._prehandleAmount(value);
		value = value > this.state.avalidAmount?this.state.avalidAmount:value;
		if (isNaN(value)) {
			value = 0;
		}
		this.setState({
			amount: value
		});
	}

	checkMoney(value) {
        var reg = /^(([1-9]{1}\d*)|([0]{1}))(\.(\d){1,2})?$/;
        if (value && reg.test(value)) {
            return true;
        } else {
            return false;
        }
    }

	handleWithdrawClick() {
		if (!this.checkMoney(this.state.amount)) {
			Toast.info('金额有误，请重新输入');
			return;
		}
		Toast.loading('操作中....');
		Ajax.post({url: Config.API.MEMBER_WITHDRAW})
		.then((res) => {
			Toast.hide();
			if (res.status === 200) {
				this.setState({
					withSuccess: true
				},()=>{
					setTimeout(()=>{
						this.props.history.replace('/balance?type=7');
					},2000);
				});
			}else{
				Toast.info(res.message);
			}
		}).catch(function(error){
			Toast.info('服务器内部错误');
		});
	}

	render() {
		return (
			<div className="page-count-room">
				<CommonNavbar 
					centerText="提现"
					onBackbarClick={()=>this.props.history.goBack()}
					showRightContent={false}
				/>
				<div className="m-withdraw-box">
					<div className="m-banlance-box">
						<div className="u-banlance">{this.state.avalidAmount}</div>
						<div className="u-title">可提现余额</div>
					</div>
					<div className="m-withdraw-amount-box">
						<div className="u-text">提现金额</div>
						<div className="m-amount-input-wrapper">
							<div className="u-text-rmb">¥</div>
							<div className="u-input-wrapper">
								<input type="number" value={this.state.amount} onChange={this.handleAmountChange.bind(this)}/>
							</div>
						</div>
					</div>
					<div className="u-button-withdraw" onClick={this.handleWithdrawClick.bind(this)}>提现</div>
					<div className="u-tip">提示：目前仅支持提现到微信零钱</div>
				</div>
				<PayTip
					display={this.state.withSuccess}
					text="提现成功即将跳转"
					money={this.state.amount}
					displayButton={false}
				/>
			</div>
		)
	}
}

export default Withdraw;