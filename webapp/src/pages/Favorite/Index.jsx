import './index.css';
import React,{Component} from 'react';
import CommonNavbar from '../../components/CommonNavbar/Index.jsx';
import GoodsItem from '../../components/GoodsItem/Index.jsx';
import {Toast} from 'antd-mobile';
import Ajax from '../../utils/Ajax'
import Config from '../../config/Config'

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
		 Ajax.post({url: Config.API.FAV_LIST})
		.then((data) => {
			Toast.hide();
			if (data.status === 200) {
				if (data.data.code === 203) {
					Toast.info(data.data.message);
				}else{
					this.setState({
						goods: data.data.data
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
				/>
				<div>
					{
						this.state.goods.map(
								el => 
								<GoodsItem 
									key={el.id}
									data={GoodsItem.ormParams(el.drink.id,el.drink.name,el.drink.imgPath,el.drink.price,el.drink.originPrice)}
								/>
							)
					}
				</div>
			</div>
		)
	}
}

export default Favorite;