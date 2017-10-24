import './index.css';
import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import {Toast} from 'antd-mobile';
import CommonNavbar from '../../components/CommonNavbar/Index.jsx';
import ButtonLoadMore from '../../components/ButtonLoadMore/Index.jsx';
import Ajax from '../../utils/Ajax';
import Config from '../../config/Config';
import Util from '../../utils/Util';
import Wrapper from '../Wrapper.jsx';

class BanlanceDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			pageIndex: 0,
			pageSize: 20,
			items: [],
			title: '收支明细',
			displayLoadMore: false
		}
	}

	componentWillMount() {
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
		Toast.loading('加载中...',0);
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
		queryData.pageIndex = this.state.pageIndex;
		queryData.pageSize = this.state.pageSize;
		return Ajax.post({url: Config.API.TRANS_ITEMS,data:queryData})
		.then((res) => {
			Toast.hide();
			if (res.status === 200) {
				if (res.data.code === 200) {
					this.setState({
						items: this.state.items.concat(res.data.data.rows),
						displayLoadMore: (this.state.pageSize * (this.state.pageIndex+1) < res.data.data.count)
					});
				}
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
				<ButtonLoadMore 
					display={this.state.displayLoadMore}
					onClick={this.handleLoadMore.bind(this)}
				/>
			</div>
		)
	}
}

export default Wrapper(BanlanceDetail);