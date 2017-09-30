import './index.css';
import {connect} from 'react-redux';
import React,{Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {List,InputItem,Toast,Button} from 'antd-mobile';
import Ajax from '../../utils/Ajax';
import Config from '../../config/Config';

import {initMember} from '../../store/userStore';

class Login extends Component {

	static propTypes = {
		onInitMember: PropTypes.func
	}

	constructor(props) {
		super(props);
		this.handlePhoneChange = this.handlePhoneChange.bind(this)
		this.handlePasswordChange = this.handlePasswordChange.bind(this)
		this.handleLogin = this.handleLogin.bind(this)
		this.state = {
			phone: '',
			password: '',
			verifyCode: ''
		}
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

	handleLogin() {
		var self = this;
		Toast.loading('登录中...',0)
		Ajax.post({url: Config.API.MEMBER_LOGIN,data: {mobile: this.state.phone.replace(/\s/g,''),password: this.state.password}})
			.then(function(data) {
				Toast.hide();
				if (data.status === 200 && data.data.code === 200) {
					self.props.onInitMember(data.data.data);
					self.props.history.goBack();
				}else{
					Toast.info(data.message);
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
					>
						手机
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
				</List>

				<Button 
					type="primary"
					onClick={this.handleLogin}
					style={{borderRadius: 0,marginTop: '1.5rem'}}
				>
					登录
				</Button>
				<div className="u-other-op">
					<Link to="/register" replace={true}>没有账号？去注册</Link>
				</div>
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		member: state.member
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onInitMember: (member) => dispatch(initMember(member))
	}
}

export default connect(mapStateToProps,mapDispatchToProps)(Login);