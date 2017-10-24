import './index.css';
import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import BlockTitle from '../../components/BlockTitle/Index.jsx';
import {List,InputItem,ImagePicker,Toast} from 'antd-mobile';
import CommonNavbar from '../../components/CommonNavbar/Index.jsx';

import Ajax from '../../utils/Ajax';
import Config from '../../config/Config';
import Util from '../../utils/Util';
import Wrapper from '../Wrapper.jsx';

const Item = List.Item;

class UserEdit extends Component {

	constructor(props) {
		super(props);
		this.state = {
			imgPath: 'https://gw.alipayobjects.com/zos/rmsportal/nywPmnTAvTmLusPxHPSu.png',
			name: '--',
			nickname: '--',
			sex: '0'
		}
	}

	componentWillMount() {
		Toast.loading('加载中...',0)
	}

	componentDidMount() {
		var p1 = this._getMemberData();
		Promise.all([p1]).then(function() {
			Toast.hide();
		}).catch(function(e){

		});
	}

	_getMemberData() {
		return Ajax.post({url: Config.API.MEMBER_DATA})
		.then((res) => {
			if (res.status === 200) {
				if (res.data.code === 200) {
					var mem = res.data.data;
					this.setState({
						imgPath: mem.headerImage ? mem.headerImage : this.state.imgPath,
						name: mem.name ? mem.name : '--',
						nickname: mem.nickname ? mem.nickname : '--',
						sex: mem.sex
					});
				}
			}else{
				Toast.info(res.message);
			}
		}).catch(function(error){
			console.log(error);
		});
	}

	postUserData() {
		Toast.loading('更新中...',0);
		Ajax.post({url: Config.API.MEMBER_EDIT,data: {
			headerImage: this.state.imgPath,
			name: this.state.name,
			nickname: this.state.nickname,
			sex: this.state.sex
		}})
		.then((res) => {
			Toast.hide();
			Toast.info(res.message);
			if (res.status === 200) {
			}else{
			}
		}).catch(function(error){
			console.log(error);
		});
	}

	handlePortraitChange(e) {
		var type = e.target.files[0].type;
		var size = e.target.files[0].size;
		if (type.indexOf('image') === -1) {
			Toast.info('不支持图片以外的其他类型文件');
			return false;
		}
		if (size > 102400) {
			Toast.info('请将上传图片大小控制在100KB内');
			return false;
		}
		Toast.loading('上传中,请稍候',0);
		var formData = new FormData();
		formData.append('file',e.target.files[0]);
		return Ajax.postFormData({url: Config.API.FILE_PORTRAIT,data:formData})
		.then((res) => {
			Toast.hide();
			if (res.status === 200) {
				this.setState({
					imgPath: res.data[0]
				});
			}else{
				Toast.info(res.message);
			}
		}).catch(function(error){
			console.log(error);
		});
	}

	handleNameChange(e) {
		this.setState({name: e.target.value});
	}

	handleNicknameChange(e) {
		this.setState({nickname: e.target.value});
	}

	handleSexChange(e) {
		this.setState({sex: e.target.value});
	}

	render() {
		return (
			<div className="page-uedit">
				<CommonNavbar 
					centerText="个人资料"
					onBackbarClick={()=>this.props.history.goBack()}
					showRightContent={false}
				/>
				<div className="m-field-wrapper">
					<div className="m-field-item">
						<span className="u-text">头像</span>
						<div className="u-value-wrapper">
							<img src={this.state.imgPath}/>
							<input className="u-file" type="file" onChange={this.handlePortraitChange.bind(this)}/>
						</div>
					</div>
					<div className="m-field-item">
						<span className="u-text">会员名</span>
						<div className="u-value-wrapper">
							<input type="text" value={this.state.name} onChange={this.handleNameChange.bind(this)}/>
						</div>
					</div>
					<div className="m-field-item">
						<span className="u-text">昵称</span>
						<div className="u-value-wrapper">
							<input type="text" value={this.state.nickname} onChange={this.handleNicknameChange.bind(this)}/>
						</div>
					</div>
					<div className="m-field-item">
						<span className="u-text">性别</span>
						<div className="u-value-wrapper">
							<select value={this.state.sex} onChange={this.handleSexChange.bind(this)}>
								<option value="0">保密</option>
								<option value="1">男</option>
								<option value="2">女</option>
							</select>
						</div>
					</div>
					<button className="u-submit" onClick={this.postUserData.bind(this)}>确认</button>
				</div>
			</div>
		)
	}
}

export default Wrapper(UserEdit);