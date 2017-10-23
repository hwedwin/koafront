import './index.css';
import React,{Component} from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd-mobile';

class PayTip extends Component {

	static propTypes = {
		display: PropTypes.bool,
		text: PropTypes.string,
		money: PropTypes.string,
		displayButton: PropTypes.bool,
		onCloseClick: PropTypes.func,
		onDetailClick: PropTypes.func,
	}

	static defaultProps = {
		display: false,
		text: '支付成功',
		money: 0.01,
		displayButton: true,
		onCloseClick: function(){},
		onDetailClick: function(){}
	}

	render() {
		return (
			<div className="m-paytip-container" style={{display: this.props.display?'block':'none'}}>
				<Icon type="check-circle" size="lg" color="#108ee9" className="u-tip-icon"/>
				<div className="u-tip-text">
					{this.props.text}
				</div>
				<div className="u-pay-money">
					¥{this.props.money}
				</div>
				<div className="m-button-container" style={{display: this.props.displayButton?'block':'none'}}>
					<button onClick={()=>this.props.onDetailClick()} className="u-button primary">查看详情</button>
					<button onClick={()=>this.props.onCloseClick()} className="u-button ghost">我的订单</button>
		        </div>
			</div>
		)
	}
}

export default PayTip