import '../Register/index.css';
import './index.css';
import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import {List,InputItem,Toast,Button,Radio,Icon} from 'antd-mobile';
import KGArea from '../../components/KGArea/Index.jsx';
import PayTip from '../../components/PayTip/Index.jsx';
import ProtoRegister from '../../components/ProtoRegister/Index.jsx';
import Ajax from '../../utils/Ajax';
import Util from '../../utils/Util';
import Config from '../../config/Config';

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
			address: '',
			consigneeName: '',
			consigneeMobile: '',
			verifyButton: true,
			verifyCount: 60,
			paySuccess: false,
			agreeProto: true,
			isPaidAgent: false,
			displayProto: false
		}
	}

	componentDidMount() {
		this._handleShareUrl();
		KGArea.init('#area');
	}

	componentWillUnmount() {
		window.clearInterval(this.timer);
	}

	_handleShareUrl() {
		var self = this;
		Ajax.post({url: Config.API.MEMBER_DATA})
			.then((res) => {
				if (res.status === 200) {
					if (res.data.code === 200) {
						this._requestWXJsConfig(res.data.data);
					}else{
						this._requestWXJsConfig({nickname: '我'});
					}
				}else{
					this._requestWXJsConfig({nickname: '我'});
				}
			}).catch(function(error){
				self._requestWXJsConfig({nickname: '我'});
			});
	}

	_requestWXJsConfig(memberData) {
		Ajax.post({url: Config.API.WXJS_SIGN,data:{url: window.escape(window.location.href)}})
				.then((res) => {
					console.log(res);
					if (res.status === 200) {
						this._handleWXShare(res.data,memberData);
					}
				}).catch(function(error){
					console.log(error);
				});
	}

	_handleWXShare(data,member) {
		var wx = window.wx;
		wx.config({
	          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
	          appId: 'wxd49fa3df1b475fa7', // 必填，公众号的唯一标识
	          timestamp: data.timestamp, // 必填，生成签名的时间戳
	          nonceStr: data.nonceStr, // 必填，生成签名的随机串
	          signature: data.signature,// 必填，签名，见附录1
	          jsApiList: [
	          	'onMenuShareTimeline',
	          	'onMenuShareAppMessage'
	          ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
	      });

		var title = '邀请您加入麦智合伙人';
		if (member && member.nickname) {
			title = member.nickname + title;
		}
		var link = window.location.origin+window.location.pathname;
		if (member && member.id && member.isAgent == '1' && member.isPay == '1') {
			link += ('?aid='+member.id);
		}
		var logo = 'http://jiuji-test.gz.bcebos.com/logo_100.png';
		var desc = '邀请您加入麦智合伙人，分享高性价比糖酒食品';

      wx.ready(function(){
	      	wx.onMenuShareTimeline({
			    title: title, // 分享标题
			    link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
			    imgUrl: logo, // 分享图标
			    success: function () { 
			        // 用户确认分享后执行的回调函数
			        Toast.info('已成功分享您的邀请链接');
			    },
			    cancel: function () { 
			        // 用户取消分享后执行的回调函数
			    }
			});

			wx.onMenuShareAppMessage({
			    title: title, // 分享标题
			    desc: desc, // 分享描述
			    link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
			    imgUrl: logo, // 分享图标
			    type: 'link', // 分享类型,music、video或link，不填默认为link
			    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
			    success: function () { 
			        // 用户确认分享后执行的回调函数
			        Toast.info('已成功分享您的邀请链接');
			    },
			    cancel: function () { 
			        // 用户取消分享后执行的回调函数
			    }
			});
      });

      wx.error(function(res){
      	console.log('err');
      	console.log(res);
      });
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
		if (!this.state.agreeProto) {
			Toast.info('注册成为代理商，请阅读并同意注册协议');
			return;
		}
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
			county: areas[2] || '',
			address: this.state.address,
			verifyCode: this.state.verifyCode
		}
		if (agentId) {
			requestData.agentId = agentId;	
		}
		Toast.loading('注册中...',0);
		var self = this;
		Ajax.post({url: Config.API.MEMBER_REG_AGENT,data: requestData})
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
	}

	handleSuccess() {
		this.setState({
			paySuccess: true
		});
		setTimeout(()=>{
			this.props.history.replace('/');
		},2000);
	}

	handleAgreeChange(e) {
		this.setState({
			agreeProto: !this.state.agreeProto
		});
	}

	render() {
		return (
			<div className="page-reg-agent">
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

				<div className="m-agree-box">
					<Icon type="check-circle" onClick={this.handleAgreeChange.bind(this)} size="xs" color={this.state.agreeProto ? '#108ee9':'#ccc'} className="u-icon-check"/>
					<span className="u-text-proto" onClick={()=>this.setState({displayProto: true})}>同意《注册代理商协议》</span>
				</div>
				
				<Button 
					type="primary"
					onClick={this.handleRegister}
					style={{borderRadius: 0,marginTop: '.6rem'}}
				>
					注册
				</Button>
				<div className="u-share-tip">tip:点击右上角菜单分享此页面来发展你的客户</div>
				<ProtoRegister 
					display={this.state.displayProto}
					onClose={()=>this.setState({displayProto: false})}
				/>
				<PayTip
					display={this.state.paySuccess}
					text="支付成功即将跳转至商户首页"
					money={398}
					displayButton={false}
				/>
			</div>
		)
	}
}

export default RegisterAgent