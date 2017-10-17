import './index.css';
import React,{Component} from 'react';
import CommonNavbar from '../../components/CommonNavbar/Index.jsx';
import GoodsItem from '../../components/GoodsItem/Index.jsx';
import {Toast} from 'antd-mobile';
import Ajax from '../../utils/Ajax'
import Config from '../../config/Config'
import {connect} from 'react-redux';

class Favorite extends Component {

	constructor(props) {
		super(props);
		this.state = {
			goods: []
		}
	}

	componentWillMount() {
		Toast.loading('加载中...',0)
	}

	componentDidMount() {
		// 获取收藏商品
		 Ajax.post({url: Config.API.FAV_LIST},this.props.member.isPaidAgent)
		.then((res) => {
			Toast.hide();
			if (res.status === 200) {
				if (res.data.code === 203) {
					Toast.info(res.data.message);
				}else{
					this.setState({
						goods: res.data.data
					});
				}
			}
		}).catch(function(error){
			console.log(error);
		});

	}

	render() {
		return (
			<div>
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

export default connect(mapStateToProps)(Favorite);