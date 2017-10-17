import './index.css';
import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import {Icon,Toast} from 'antd-mobile';
import CommonNavbar from '../../components/CommonNavbar/Index.jsx';
import svgEdit from '../../assets/svg/edit.svg';

import Ajax from '../../utils/Ajax';
import Config from '../../config/Config';
import Util from '../../utils/Util';

class Address extends Component {
	constructor(props) {
		super(props);
		this.state = {
			address: []
		}
	}

	componentWillMount() {
		Toast.loading('加载中...',0);	
	}

	componentDidMount() {
		this._getAddress();
	}

	_getAddress() {
		Ajax.post({url: Config.API.CONSIGNEE_LIST})
		.then((res) => {
			Toast.hide();
			if (res.status === 200) {
				if (res.data.code === 200) {
					this.setState({
						address: res.data.data
					});
				}
			}else{
				Toast.info(res.message);
			}
		}).catch(function(error){
			console.log(error);
		});
	}

	handleIconEditClick(e,id) {
		e.stopPropagation();
		this.props.history.push('/addressedit/'+id);
	}

	handleAddressItemClick(id) {
		if (Util.getSearch(this.props.location.search,'from') === 'order') {
			this.props.history.replace('/ordercreate/?goods='+Util.getSearch(this.props.location.search,'goods')+'&consignee='+id);
		}
	}

	render() {
		return (
		<div className="page-address">
			<CommonNavbar 
				centerText="收货地址"
				onBackbarClick={()=>this.props.history.goBack()}
				showRightContent={false}
			/>
			<div className="m-address-box">
				{
					this.state.address.map(el => (
						<div className="m-address-item" key={el.id} onClick={this.handleAddressItemClick.bind(this,el.id)}>
							<div className="m-left-wrapper">
								<div className="m-name-mobile">
									<span className="u-name">{el.consigneeName}</span>
									<span className="u-mobile">{el.consigneeMonbile}</span>
								</div>
								<div className="u-address">
									{el.province+el.city+el.county+' '+el.address}
								</div>
							</div>
							<div className="m-right-wrapper">
								<Icon type={svgEdit} size="md" onClick={(e)=>this.handleIconEditClick(e,el.id)} />
							</div>
						</div>

					))
				}
			</div>
			<div className="m-newaddress-box">
				<Link to="/addressedit/new" className="u-button-new">新建地址</Link>
			</div>
		</div>
		);
	}
}

export default Address;