import './index.css'
import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import {Icon,Toast} from 'antd-mobile';
import CommonNavbar from '../../components/CommonNavbar/Index.jsx';
import svgEdit from '../../assets/svg/edit.svg';

import Ajax from '../../utils/Ajax';
import Config from '../../config/Config';
import Util from '../../utils/Util';

var CustomerItem = (props) => {
	return (
		<div className="m-customer-item">
			<img className="u-portrait" src={props.data.member.headerImage} />
			<div className="m-right-detail">
				<div className="u-name">
					{props.data.member.nickname}
				</div>
				<div className="u-desc">
					{props.data.fxLevel}
				</div>
			</div>
		</div>
	)
}

class Customer extends Component {

	constructor(props) {
		super(props);
		this.state = {
			customers: []
		}
	}

	componentWillMount() {
		Toast.loading('加载中...',0);
	}

	componentDidMount() {
		this.requestCustomer();	
	}

	requestCustomer() {
		Ajax.post({url: Config.API.MEMBER_CUSTOMER})
		.then((res) => {
			Toast.info(res.message);
			if (res.status === 200 && res.data.code === 200) {
				this.setState({
					customers: res.data.data
				});
			}
		}).catch(function(error){
			console.log(error);
		});
	}

	render() {
		return (
			<div className="page-customer">
				<CommonNavbar 
					centerText="我的经销商"
					onBackbarClick={()=>this.props.history.goBack()}
				/>
				<div className="m-customer-list">
					{
						this.state.customers.map(item => 
							<CustomerItem data={item} key={item.id} />
						)
					}
				</div>
			</div>
		)
	}
}

export default Customer;