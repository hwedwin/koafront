import './index.css'
import React,{Component} from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'

class GoodsItem extends Component {

	static propTypes = {
		data: PropTypes.object,
		speText: PropTypes.string
	}

	static defaultProps = {
		data: {
			id: 'jfkajfkufsvfjnf78',
			title: '智利进口红酒 智象美露干红葡萄酒 750*6瓶',
			logo: 'https://gw.alipayobjects.com/zos/rmsportal/nywPmnTAvTmLusPxHPSu.png',
			price: '100',
			originPrice: '120'
		},
		speText: '¥'
	}

	static ormParams(id,title,logo,price,originPrice) {
		return {
			id,title,logo,price,originPrice
		}
	}

	render() {
		var data = this.props.data
		return (
			<div className="m-goods-itema">
				<Link to={`/goods/${data.id}`}>
					<div className="u-img-box">
						<img src={data.logo}/>
					</div>
					<div className="m-detail-wrapper">
						<div className="u-title">{data.title}</div>
						<div className="u-price">
							{this.props.speText}{data.price}<span className="u-origin-price">¥{data.originPrice}</span>
						</div>
						<div className="m-tag-box">
							<span className="u-tag">自营</span>
							<span className="u-tag">本地仓</span>
						</div>
					</div>
				</Link>
			</div>
		)
	}
} 

export default GoodsItem