import './index.css';
import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import {Icon,List,InputItem,Switch,Toast,Button,WingBlank} from 'antd-mobile';
import CommonNavbar from '../../components/CommonNavbar/Index.jsx';
import svgEdit from '../../assets/svg/edit.svg';
import KGArea from '../../components/KGArea/Index.jsx';
import Ajax from '../../utils/Ajax';
import Config from '../../config/Config';
import Util from '../../utils/Util';
import Wrapper from '../Wrapper.jsx';

class AddressEdit extends Component {
	constructor(props) {
		super(props);
		this.state = {
			action: props.match.params.action,
			title: props.match.params.action === 'new' ? '新建收货地址' : '编辑收货地址',
			name: '',
			mobile: '',
			address: '',
			area: '',
			isDefault: false
		}	
	}

	componentDidMount() {
		KGArea.init('#area');
		if (this.state.action !== 'new') {
			Toast.loading('加载中...',0);
			this._getAddress();
		}
	}

	_getAddress() {
		Ajax.post({url: Config.API.CONSIGNEE_ONE,data: {id: this.state.action}})
		.then((res) => {
			Toast.hide();
			if (res.status === 200) {
				if (res.data.code === 200) {
					var c = res.data.data
					this.setState({
						name: c.consigneeName,
						mobile: c.consigneeMobile,
						address: c.address,
						area: c.province+','+c.city+','+c.county,
						isDefault: c.isDefault === '1'
					},() => {
						window.document.getElementById('area').value = this.state.area;
					});
				}
			}else{
				Toast.info(res.message);
			}
		}).catch(function(error){
			console.log(error);
		});
	}

	_saveAddress() {
		Toast.loading('保存中...',0);
		var areas = window.document.getElementById('area').value.split(',');
		if (!Util.isMobile(this.state.mobile)) {
			Toast.info('电话号码有误');
			return;
		}
		if (this.state.name === '' || this.state.address === '' || areas.length ===0) {
			Toast.info('请填写详细收货信息');
			return;
		}
		var requestData = {
			consigneeName: this.state.name,
			consigneeMobile: this.state.mobile,
			address: this.state.address,
			province: areas[0],
			city: areas[1],
			county: areas[2] || '',
			isDefault: this.state.isDefault === true ? '1' : '0'
		}
		var url = '';
		if (this.state.action === 'new') {
			url = Config.API.CONSIGNEE_CREATE;
		}else{
			url = Config.API.CONSIGNEE_MODIFY;
			requestData.id = this.state.action;
		}

		Ajax.post({url: url,data: requestData})
		.then((res) => {
			Toast.hide();
			Toast.info(res.message);
			if (res.status === 200) {
				if (res.data.code === 200) {
					
				}
			}else{
			}
		}).catch(function(error){
			console.log(error);
		});
	}

	handleNameChange(value) {
		this.setState({
			name: value
		});
	}

	handleMobileChange(value) {
		this.setState({
			mobile: value
		});
	}

	handleAddressChange(value) {
		this.setState({
			address: value
		});
	}

	handleAreaChange(value) {
		console.log(value)
		this.setState({
			area: value
		});
	}

	handleDefaultChange(value) {
		this.setState({
			isDefault: value
		});
	}

	handleSaveButtonClick() {
		this._saveAddress();
	}

	render() {
		return (
			<div>
				<CommonNavbar 
					centerText={this.state.title}
					onBackbarClick={()=>this.props.history.goBack()}
					showRightContent={false}
				/>
				<div style={{marginBottom: '.2rem'}}>
					<List className="">
						<InputItem
							type="text"
							placeholder=""
							value={this.state.name}
							onChange={this.handleNameChange.bind(this)}
						>
							收货人
						</InputItem>
						<InputItem
							type="mobile"
							placeholder=""
							value={this.state.mobile}
							onChange={this.handleMobileChange.bind(this)}
						>
							联系方式
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
							placeholder=""
							value={this.state.address}
							onChange={this.handleAddressChange.bind(this)}
						>
							详细地址
						</InputItem>
						
						<List.Item
					        extra={<Switch 
					        	onChange={this.handleDefaultChange.bind(this)}
					        	checked={this.state.isDefault}
					        	/>}
					      >
					      	设为默认地址
					     </List.Item>
					</List>
				</div>
				<WingBlank>
					<Button className="btn" type="primary" onClick={this.handleSaveButtonClick.bind(this)}>保存</Button>
				</WingBlank>
			</div>
		)
	}
}

export default Wrapper(AddressEdit);