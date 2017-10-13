import './index.css'
import React,{Component} from 'react';
import {Icon,Toast} from 'antd-mobile';
import CommonNavbar from '../../components/CommonNavbar/Index.jsx';
import svgMapMarker from '../../assets/svg/map-marker.svg';

import Ajax from '../../utils/Ajax';
import Config from '../../config/Config';
import Util from '../../utils/Util';


class OrderDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			consignee: {},
			drinks: [],
			details: {},
			remainTime: 0
		}
	}

	componentWillMount() {
		Toast.loading('加载中...');
	}

	componentDidMount() {
		Ajax.post({url: Config.API.ORDER_DETAIL,data: {id: this.props.match.params.id}})
		.then((res) => {
			Toast.hide();
			if (res.status === 200) {
				if (res.data.code === 200) {
					var o = res.data.data;
					this.setState({
						consignee: o.consignee, 
						drinks: o.drinks,
						details: o,
						remainTime: (o.createdTimestamp+24*60*60*1000)-Date.now()
					},()=>{
						if (this.state.remainTime > 1000) {
							this._startTimer();
						}
					});
				}
			}else{
				Toast.info(res.message);
			}
		}).catch(function(error){
			console.log(error);
		});
	}

	_startTimer() {
		this.timer = window.setInterval(()=>{
			var remain = this.state.remainTime - 1000;
			if (remain > 1000) {
				this.setState({
					remainTime: remain
				});
			}else{
				window.clearInterval(this.timer);
			}
		},1000);
	}

	_format(millsecond) {
		var hour = parseInt(millsecond / 3600000,10);
		var minute = parseInt((millsecond - hour * 3600000) / 60000, 10);
		var str = '';
		if (hour > 0) {
			str = hour + '小时';
		}
		str += minute + '分钟';
		return str;
	}

	componentWillUnmount() {
		window.clearInterval(this.timer);
	}

	render() {
		var c = this.state.consignee;
		var ds = this.state.drinks;
		var o = this.state.details;
		return (
			<div className="page-order-detail">
				<CommonNavbar 
					centerText="订单详情"
					onBackbarClick={()=>this.props.history.goBack()}
				/>
				<div>
					<div className="m-address-detail">
						<div className="m-receiver">
							<Icon type={svgMapMarker} size="xxs"/>
							<span className="u-name">{c.consigneeName}</span>
							<span className="u-phone">{c.consigneeMobile}</span>
						</div>
						<div className="u-address">
							地址：{c.province+c.city+c.county+c.address}
						</div>
					</div>
					<div>
						{
							ds.map(el => (
								<div key={el.id} className="m-goods-item">
									<img src={el.drink.imgPath}/>
									<div className="m-desc">
										<div className="u-name">{el.drink.name}</div>
										<div className="u-count">数量：{el.nums}</div>
										<div className="u-money">¥{el.price}</div>
									</div>
								</div>

							))
						}
					</div>
					<div className="u-order-list">
						<div className="u-item">订单编号：{o.id}</div>
						<div className="u-item">下单时间：{Util.formatDate('yyyy-MM-dd hh:mm:ss',o.createdTimestamp)}</div>
						<div className="u-item">支付方式：{o.progressState=='1'?'未支付':(o.paidCode!='balance'?'微信支付':'余额支付')}</div>
						<div className="u-item">商品总额：¥{o.orderTotalPrice}</div>
						{
							this.state.remainTime > 1000 && o.progressState == '1' ? <div className="u-item">剩余支付时间：{this._format(this.state.remainTime)}</div>:''
						}
					</div>
				</div>
			</div>
		)
	}
}

export default OrderDetail;