import '../Register/index.css'
import React,{Component} from 'react'
import {Link} from 'react-router-dom'
import {List,InputItem,Toast,Button} from 'antd-mobile'
import KGArea from '../../components/KGArea/Index.jsx'

class RegisterAgent extends Component {

	constructor(props) {
		super(props);
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
			address: ''
		}
	}

	componentDidMount() {
		KGArea.init('#area')
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

	handleVerifySend() {
		Toast.success('已发送，请注意查收')
		// Toast.fail('发送失败，请重试')
	}

	handleRegister() {
		Toast.loading('注册中...',0)
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
						extra="发送验证码"
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