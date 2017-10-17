import './index.css';
import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import {Toast} from 'antd-mobile';
import CommonNavbar from '../../components/CommonNavbar/Index.jsx';

import Ajax from '../../utils/Ajax';
import Config from '../../config/Config';
import Util from '../../utils/Util';

class BanlanceDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			pageIndex: 0,
			pageSize: 20,
			items: [],
			title: '收支明细'
		}
	}

	componentWillMount() {
		Toast.loading('加载中...',0);
		this._request();
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

	_request() {
		var queryData = {};
		var type = Util.getSearch(this.props.location.search,'type');
		if (type) {
			queryData.type = type;
			if (type == '7') {
				this.setState({
					title: '提现记录'
				});
			}
		}
		return Ajax.post({url: Config.API.TRANS_ITEMS,data:queryData})
		.then((res) => {
			Toast.hide();
			if (res.status === 200) {
				if (res.data.code === 200) {
					this.setState({
						items: res.data.data
					});
				}
			}else{
				Toast.info(res.message);
			}
		}).catch(function(error){
			console.log(error);
		});
	}

	render() {
		return (
			<div className="page-balance-detail">
				<CommonNavbar 
					centerText={this.state.title}
					onBackbarClick={()=>this.props.history.goBack()}
					showRightContent={false}
				/>
				<div>
					{
						this.state.items.map(item => 
							<Link to={'/transdetail/'+item.id} className="m-trans-item" key={item.id}>
								<div className="m-left-wrapper">
									<div className="u-title">{this._mapState(item.type)}</div>
									<div className="u-money">
										{item.createdAt}
									</div>
								</div>
								<div className={'m-right-wrapper'+' '+(item.money>0?'income':'')}>
									{item.money>0?'+'+item.money:item.money}
								</div>
							</Link>
						)
					}
				</div>
			</div>
		)
	}
}

export default BanlanceDetail;