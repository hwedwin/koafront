import './index.css'
import React,{Component} from 'react';
import {Icon,Toast} from 'antd-mobile';
import BlockTitle from '../../components/BlockTitle/Index.jsx';
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
			remainTime: 0,
			express: {}
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
					if (o.progressState === '3') {
						this._requestExpress();
					}
				}
			}else{
				Toast.info(res.message);
			}
		}).catch(function(error){
			console.log(error);
		});
	}

	_requestExpress() {
		Ajax.post({url: Config.API.EXPRESS_GET,data: {orderId: this.props.match.params.id}})
		.then((res) => {
			if (res.status === 200) {
				this.setState({
					express: res.data
				});
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
		var e = this.state.express;
		var display = o.progressState == '3' || o.progressState == '4' || o.progressState == '9';
		var expressStyle = {display: display?'block':'none'};
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
					<BlockTitle title="订单信息"/>
					<div className="u-order-list">
						<div className="u-item">订单编号：{o.id}</div>
						<div className="u-item">下单时间：{Util.formatDate('yyyy-MM-dd hh:mm:ss',o.createdTimestamp)}</div>
						<div className="u-item">支付方式：{o.progressState=='1'?'未支付':(o.paidCode!='balance'?'微信支付':'余额支付')}</div>
						<div className="u-item">商品总额：¥{o.orderTotalPrice}</div>
						{
							this.state.remainTime > 1000 && o.progressState == '1' ? <div className="u-item">剩余支付时间：{this._format(this.state.remainTime)}</div>:''
						}
					</div>
					<div style={expressStyle}>
						<BlockTitle title="物流信息"/>
						<div className="m-express-detail u-order-list">
							<div className="u-item">物流公司：{e.expressName}</div>
							<div className="u-item">物流单号：{e.expressCode}</div>
							<div className="u-item">物流联系电话：{e.expressPhone}</div>
							<div className="u-item">备注：{e.expressInfo}</div>
							<div className="u-item">发货时间：{e.createdAt}</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default OrderDetail;