import './index.css';
import React,{Component} from 'react';
import CommonNavbar from '../../components/CommonNavbar/Index.jsx';
import {Toast,Grid,Icon} from 'antd-mobile';
import Ajax from '../../utils/Ajax';
import Util from '../../utils/Util';
import Config from '../../config/Config';
import Wrapper from '../Wrapper.jsx';

class TransDetail extends Component{

	constructor(props) {
		super(props);
		this.state = {
			data: {}
		}
	}

	componentWillMount() {
		Toast.loading('加载中',0);
		this._requestDetail();;	
	}

	_requestDetail() {
		var id = this.props.match.params.id;
		return Ajax.post({url: Config.API.TRANS_ITEM,data:{id:id}})
		.then((res) => {
			Toast.hide();
			if (res.status === 200) {
				if (res.data.code === 200) {
					this.setState({
						data: res.data.data
					});
				}
			}else{
				Toast.info(res.message);
			}
		}).catch(function(error){
			console.log(error);
		});
	}

	_mapState(state) {
		var maps = {
			'1':'下级经销商注册收入',
			'2':'销售所得收入',
			'3':'销售所得佣金收入',
			'4':'购买商品支出',
			'5':'购买商品余额支出',
			'6':'注册经销商支出',
			'7':'提现支出'
		};
		return maps[state];
	}

	render() {
		var data = this.state.data;
		return (
			<div className="page-trans-detail">
				<CommonNavbar 
					centerText="收支明细"
					onBackbarClick={()=>this.props.history.goBack()}
					showRightContent={false}
				/>
				<div className="m-money-box">
					<div className="u-text">出账金额</div>
					<div className="u-money">{data.money}</div>
				</div>
				<div className="m-trans-box">
					<div className="m-transd-item">
						<div className="u-text">类型</div>
						<div className="u-value">{this._mapState(data.type)}</div>
					</div>
					<div className="m-transd-item">
						<div className="u-text">时间</div>
						<div className="u-value">{data.createdAt}</div>
					</div>
					<div className="m-transd-item">
						<div className="u-text">单号</div>
						<div className="u-value">{data.orderId||data.memberId}</div>
					</div>
				</div>
			</div>
		)
	}
}

export default Wrapper(TransDetail);