import './index.css';
import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import {List,InputItem,Toast,Button} from 'antd-mobile';
import Ajax from '../../utils/Ajax';
import Util from '../../utils/Util';
import Config from '../../config/Config';
import Wrapper from '../Wrapper.jsx';

class Register extends Component {

	constructor(props) {
		super(props);
		this.handlePhoneChange = this.handlePhoneChange.bind(this)
		this.handlePasswordChange = this.handlePasswordChange.bind(this)
		this.handleRePasswordChange = this.handleRePasswordChange.bind(this)
		this.handleVerifyCodeChange = this.handleVerifyCodeChange.bind(this)
		this.handleVerifySend = this.handleVerifySend.bind(this)
		this.handleRegister = this.handleRegister.bind(this)
		this.state = {
			phone: '',
			password: '',
			repassword: '',
			verifyCode: '',
			verifyButton: true,
			verifyCount: 60,
		}
	}

	componentWillUnmount() {
		window.clearInterval(this.timer);
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
				if (res.status === 200) {
					this._startTimer();
				}else{
					Toast.info(res.message);
				}
			}).catch(function(error){
				console.log(error);
			});
	}

	handleRegister() {
		var mobile = this.state.phone.replace(/\s/g,'');
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
		var requestData = {
			mobile: mobile,
			password: this.state.password,
			verifyCode: this.state.verifyCode
		}
		Toast.loading('注册中...',0);
		var self = this;
		Ajax.post({url: Config.API.MEMBER_REG,data: requestData})
			.then((res) => {
				Toast.info(res.message);
				if (res.status === 200) {
					setTimeout(()=>{
						this.props.history.replace('/');		
					},1000);
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
						placeholder="再次输入密码"
						maxLength={12}
						value={this.state.repassword}
						onChange={this.handleRePasswordChange}
					>
						密码
					</InputItem>
				</List>

				<Button 
					type="primary"
					onClick={this.handleRegister}
					style={{borderRadius: 0,marginTop: '1.5rem'}}
				>
					注册
				</Button>
				<div className="u-other-op">
					<Link to="/login" replace={true}>已有账号？去登录</Link>
				</div>
			</div>
		)
	}
}

export default Wrapper(Register);