import React,{Component} from 'react'
import PropTypes from 'prop-types'
import {Grid} from 'antd-mobile'
import './index.css'

class IndexGridGoods extends Component {

	static propTypes = {
		data: PropTypes.array
	}

	static defaultProps = {
		data: [
			{
				imgPath: "http://jiuji-test.gz.bcebos.com/2017-08-01/3005ea10769811e7adaecd5df44179cb.jpeg",
				name: '剑南春 水晶剑 52度 单瓶装白酒 500ml 口感浓香型',
				retailPrice: '99',
				id: 'jfskjfsk'
			}
		]
	}

	constructor(props) {
		super(props);
		this.state = {
		}
	}

	handleGridItemClick(el,index) {
		this.props.history.push('/goods/'+el.key)
	}

	formatGoods() {
		var goods = [];
		for (var i = 0; i < this.props.data.length; i++) {
			var item = this.props.data[i];
			goods.push({
				icon: item.imgPath,
				text: <div><div className="u-title">{item.name}</div><div className="u-price">¥{item.price}{item.backProfit?',赚:¥'+item.backProfit:''}</div></div>,
				key: item.id
			})
		}
		return goods;
	}

	render() {
		return (
			<div className="m-index-grid">
				<Grid
					className="m-grid-goods"
					data={this.formatGoods()}
					columnNum={2}
					hasLine={true}
					onClick={this.handleGridItemClick.bind(this)}
				/>
			</div>
		)
	}
}

export default IndexGridGoods