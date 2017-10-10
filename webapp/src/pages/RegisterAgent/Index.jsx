import '../Register/index.css';
import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import {List,InputItem,Toast,Button} from 'antd-mobile';
import KGArea from '../../components/KGArea/Index.jsx';
import Ajax from '../../utils/Ajax';
import Util from '../../utils/Util';
import Config from '../../config/Config';

class RegisterAgent extends Component {

	constructor(props) {
		super(props);
		console.log(props);
		this.handlePhoneChange = this.handlePhoneChange.bind(this)
		this.handlePasswordChange = this.handlePasswordChange.bind(this)
		this.handleRePasswordChange = this.handleRePasswordChange.bind(this)
		this.handleVerifyCodeChange = this.handleVerifyCodeChange.bind(this)
		this.handleVerifySend = this.handleVerifySend.bind(this)
		this.handleRegister = this.handleRegister.bind(this)
		this.handleAddressChange = this.handleAddressChange.bind(this)
		this.state = {
			phone: '',
			password: '',
			repassword: '',
			verifyCode: '',
			address: '',
			consigneeName: '',
			consigneeMobile: '',
			verifyButton: true,
			verifyCount: 60
		}
	}

	componentDidMount() {
		KGArea.init('#area')
	}

	_startTimer() {
		this.state.verifyButton = false;
		var count = this.state.verifyCount;
		this.timer = setInterval(() => {
			if (count > 1) {
				count--;
				this.setState({
					verifyCount: count
				});
			}else{
				this.setState({
					verifyCount: 60,
					verifyButton: true
				});
				clearInterval(this.timer);
			}
		},1000);
	}

	handlePhoneChange(value) {
		this.setState({
			phone: value
		})
	}

	handleVerifyCodeChange(value) {
		this.setState({
			verifyCode: value
		})
	}

	handlePasswordChange(value) {
		this.setState({
			password: value
		})
	}

	handleRePasswordChange(value) {
		this.setState({
			repassword: value
		})
	}

	handleAddressChange(value) {
		this.setState({
			address: value
		})
	}

	handleConsigneeNameChange(value) {
		this.setState({
			consigneeName: value
		});
	}

	handleConsigneeMobileChange(value) {
		this.setState({
			consigneeMobile: value
		});
	}

	handleVerifySend() {
		if (!this.state.verifyButton) {
			return;
		}
		var mobile = this.state.phone.replace(/\s/g,'');
		if (!Util.isMobile(mobile)) {
			Toast.info('请输入正确的手机号');
			return;
		}
		Ajax.post({url: Config.API.SMSCODE_REGISTER,data: {mobile: mobile}})
			.then((res) => {
				Toast.info(res.message);
				if (res.status === 200) {
					this._startTimer();
				}
			}).catch(function(error){
				console.log(error);
			});
	}

	handleRegister() {
		Toast.loading('注册中...',0);
		var mobile = this.state.phone.replace(/\s/g,'');
		var consigneeMobile = this.state.consigneeMobile.replace(/\s/g,'');
		if (!Util.isMobile(mobile)) {
			Toast.info('手机号码有误');
			return;
		}
		if (this.state.verifyCode === '') {
			Toast.info('验证码不能为空');
			return;
		}
		if (this.state.password.lenght < 6 || (this.state.password !== this.state.repassword)) {
			Toast.info('密码长度小于6或两次输入密码不一致');
			return;
		}
		if (this.state.consigneeName === '') {
			Toast.info('姓名不能为空');
			return;
		}
		if (!Util.isMobile(consigneeMobile)) {
			Toast.info('收货人手机号码有误');
			return;
		}
		var area = window.document.getElementById('area').value;
		if (area === '' || this.state.address === '') {
			Toast.info('地址不能为空');
			return;
		}
		var areas = area.split(',');
		var agentId = Util.getSearch(this.props.location.search,'aid');
		var requestData = {
			mobile: mobile,
			password: this.state.password,
			consigneeName: this.state.consigneeName,
			consigneeMobile: consigneeMobile,
			province: areas[0],
			city: areas[1],
			county: areas[2],
			address: this.state.address,
			verifyCode: this.state.verifyCode
		}
		if (agentId) {
			requestData.agentId = agentId;	
		}
		Ajax.post({url: Config.API.MEMBER_REG_AGENT,data: requestData})
			.then((res) => {
				Toast.info(res.message);
				if (res.status === 200) {
					this.props.history.replace('/?aid='+res.id);
				}else{
				}
			}).catch(function(error){
				console.log(error);
			});
	}

	render() {
		return (
			<div>
				<List className="m-input-list">
					<InputItem
						type="phone"
						placeholder="手机号码"
						value={this.state.phone}
						onChange={this.handlePhoneChange}
						extra={this.state.verifyButton ? '发送验证码' : '('+this.state.verifyCount+')后重新发送'}
						onExtraClick={this.handleVerifySend}
					>
						手机
					</InputItem>
					<InputItem
						placeholder="验证码"
						value={this.state.verifyCode}
						onChange={this.handleVerifyCodeChange}
					>
						验证码
					</InputItem>
					<InputItem
						type="password"
						placeholder="密码6-12位"
						maxLength={12}
						value={this.state.password}
						onChange={this.handlePasswordChange}
					>
						密码
					</InputItem>
					<InputItem
						type="password"
						placeholder="确认密码"
						maxLength={12}
						value={this.state.repassword}
						onChange={this.handleRePasswordChange}
					>
						密码
					</InputItem>
					<InputItem
						type="text"
						placeholder="收货人姓名"
						maxLength={12}
						value={this.state.consigneeName}
						onChange={this.handleConsigneeNameChange.bind(this)}
					>
						姓名
					</InputItem>
					<InputItem
						type="phone"
						placeholder="收货人电话"
						value={this.state.consigneeMobile}
						name="consigneeMobile"
						onChange={this.handleConsigneeMobileChange.bind(this)}
					>
						电话
					</InputItem>
					<InputItem
						id="area"
						type="text"
						placeholder="选择区域"
					>
						区域
					</InputItem>
					<InputItem
						type="text"
						placeholder="详细地址"
						value={this.state.address}
						onChange={this.handleAddressChange}
					>
						地址
					</InputItem>
				</List>

				<Button 
					type="primary"
					onClick={this.handleRegister}
					style={{borderRadius: 0,marginTop: '1.5rem'}}
				>
					注册
				</Button>
			</div>
		)
	}
}

export default RegisterAgent