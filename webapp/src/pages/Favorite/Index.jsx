import './index.css';
import React,{Component} from 'react';
import CommonNavbar from '../../components/CommonNavbar/Index.jsx';
import ButtonLoadMore from '../../components/ButtonLoadMore/Index.jsx';
import GoodsItem from '../../components/GoodsItem/Index.jsx';
import {Toast} from 'antd-mobile';
import Ajax from '../../utils/Ajax'
import Config from '../../config/Config'
import {connect} from 'react-redux';
import Wrapper from '../Wrapper.jsx';

class Favorite extends Component {

	constructor(props) {
		super(props);
		this.state = {
			pageIndex: 0,
			pageSize: 20,
			goods: [],
			displayLoadMore: false
		}
	}

	componentDidMount() {
		this._request();
	}

	_request() {
		Toast.loading('加载中...',0)
		// 获取收藏商品
		 Ajax.post({url: Config.API.FAV_LIST,
		 	data:{pageIndex: this.state.pageIndex,pageSize: this.state.pageSize}},this.props.member.isPaidAgent)
		.then((res) => {
			Toast.hide();
			if (res.status === 200) {
				if (res.data.code === 203) {
					Toast.info(res.data.message);
				}else{
					this.setState({
						goods: this.state.goods.concat(res.data.data.rows),
						displayLoadMore: (this.state.pageSize * (this.state.pageIndex+1) < res.data.data.count)
					});
				}
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
			<div className="page-favorite">
				<CommonNavbar 
					centerText="关注商品"
					onBackbarClick={()=>this.props.history.goBack()}
					showRightContent={false}
				/>
				<div>
					{
						this.state.goods.map(
								el => 
								<GoodsItem 
									key={el.id}
									data={GoodsItem.ormParams(el.drink.id,el.drink.name,el.drink.imgPath,el.drink.price,el.drink.originPrice,el.drink.backProfit)}
								/>
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

// export default Favorite;
const mapStateToProps = (state) => {
  return {
  	agentId: state.agentId,
    member: state.member
  }
}

export default connect(mapStateToProps)(Wrapper(Favorite));