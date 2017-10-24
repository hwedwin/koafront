import './index.css'
import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import {Icon,Toast} from 'antd-mobile';
import CommonNavbar from '../../components/CommonNavbar/Index.jsx';
import ButtonLoadMore from '../../components/ButtonLoadMore/Index.jsx';
import svgEdit from '../../assets/svg/edit.svg';
import Ajax from '../../utils/Ajax';
import Config from '../../config/Config';
import Util from '../../utils/Util';
import defaultPortrait from '../../assets/images/portrait.png';
import Wrapper from '../Wrapper.jsx';

var CustomerItem = (props) => {
	return (
		<div className="m-customer-item">
			<img className="u-portrait" src={props.data.member.headerImage || defaultPortrait} />
			<div className="m-right-detail">
				<div className="u-name">
					{props.data.member.nickname}
				</div>
				<div className="u-desc">
					{props.data.createdAt}
				</div>
			</div>
		</div>
	)
}

class Customer extends Component {

	constructor(props) {
		super(props);
		this.state = {
			customers: [],
			pageIndex: 0,
			pageSize: 20,
			displayLoadMore: false
		}
	}

	componentDidMount() {
		this.requestCustomer();	
	}

	requestCustomer() {
		Toast.loading('加载中...',0);
		Ajax.post({url: Config.API.MEMBER_CUSTOMER,data:{
			pageSize: this.state.pageSize,
			pageIndex: this.state.pageIndex
		}})
		.then((res) => {
			Toast.hide();
			if (res.status === 200 && res.data.code === 200) {
				this.setState({
					customers: this.state.customers.concat(res.data.data.rows),
					displayLoadMore: (this.state.pageSize * (this.state.pageIndex+1) < res.data.data.count)
				});
			}else{
				Toast.info(res.message);
			}
		}).catch(function(error){
			console.log(error);
		});
	}

	handleLoadMore() {
		this.setState({
			pageIndex: ++this.state.pageIndex
		},() => {
			this._request();
		});
	}

	render() {
		return (
			<div className="page-customer">
				<CommonNavbar 
					centerText="我的经销商"
					onBackbarClick={()=>this.props.history.goBack()}
					showRightContent={false}
				/>
				<div className="m-customer-list">
					{
						this.state.customers.map(item => 
							<CustomerItem data={item} key={item.id} />
						)
					}
				</div>
				<ButtonLoadMore 
					display={this.state.displayLoadMore}
					onClick={this.handleLoadMore.bind(this)}
				/>
			</div>
		)
	}
}

export default Wrapper(Customer);