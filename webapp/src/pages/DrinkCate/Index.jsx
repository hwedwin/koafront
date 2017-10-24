import './index.css';
import React,{Component} from 'react';
import GoodsItem from '../../components/GoodsItem/Index.jsx';
import CommonNavbar from '../../components/CommonNavbar/Index.jsx';
import ButtonLoadMore from '../../components/ButtonLoadMore/Index.jsx';
import {Toast} from 'antd-mobile';
import Ajax from '../../utils/Ajax';
import Config from '../../config/Config';
import Util from '../../utils/Util';
import {connect} from 'react-redux';
import Wrapper from '../Wrapper.jsx';

class SearchResult extends Component {

	constructor(props) {
		super(props);
		this.handleSortItemClick = this.handleSortItemClick.bind(this);
		var url = '';
		var type = '';
		var navTitle = '';
		var pathname = this.props.location.pathname;
		if (/^\/cate/.test(pathname)) {
			url = Config.API.DRINK_CATE;
			navTitle = Util.getCateById(this.props.match.params.id);
		}else if(/^\/brand/.test(pathname)) {
			url = Config.API.DRINK_BRAND;
			navTitle = Util.getSearch(this.props.location.search,'brand');
		}
		this.state = {
			url: url,
			navTitle: navTitle,
			query: this.props.match.params.id,
			sortBy: 'all',
			sortPriceTag: 0, //0：不是价格，1: 降序，-1升序
			pageIndex: 0,
			pageSize: 20,
			goods: [],
			displayLoadMore: false
		}
	}

	componentWillMount() {
		Toast.loading('加载中...',0);
	}

	componentDidMount() {
		this._request();
	}

	_request() {
		Toast.loading('加载中...',0);
		Ajax.post({url: this.state.url,data: {
		 	categoryId: this.state.query,
		 	brandId: this.state.query,
		 	orderTag: this.state.sortBy,
		 	orderRule: this.state.sortPriceTag === 1 ? 'DESC' : 'ASC',
		 	pageIndex: this.state.pageIndex,
		 	pageSize: this.state.pageSize
		 }},this.props.member.isPaidAgent)
		.then((res) => {
			Toast.hide();
			if (res.status === 200) {
				this.setState({
					goods: this.state.goods.concat(res.data.rows),
					displayLoadMore: (this.state.pageSize * (this.state.pageIndex+1) < res.data.count)
				});
			}
		}).catch(function(error){
			Toast.hide();
			Toast.info('请求超时');
		});
	}

	handleSortItemClick(sortBy) {
		let sortPriceTag = 0
		if (sortBy === 'price') {
			if (this.state.sortPriceTag != -1) {
				sortPriceTag = -1
			}else{
				sortPriceTag = 1
			}
		}
		this.setState({
			sortBy,
			sortPriceTag,
			pageIndex: 0,
			pageSize: 20,
			goods: []
		},() => {
			this._request();
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
			<div className="m-page-result">
				<CommonNavbar 
					showLeftIcon={false}
					leftContent="首页"
					onBackbarClick={()=>this.props.history.replace('/')}
					centerText={this.state.navTitle}
				/>
				<div className="m-sortbar">
					<div 
						className={this.state.sortBy === 'all' ? "u-sort-item is-active" : 'u-sort-item'} 
						onClick={() => this.handleSortItemClick('all')}>
						综合
					</div>
					<div 
						className={this.state.sortBy === 'new' ? "u-sort-item is-active" : 'u-sort-item'} 
						onClick={() => this.handleSortItemClick('new')}
					>
						新品
					</div>
					<div 
						className={this.state.sortBy === 'sale' ? "u-sort-item is-active" : 'u-sort-item'} 
						onClick={() => this.handleSortItemClick('sale')}
					>
						销量
					</div>
					<div 
						className={this.state.sortBy === 'price' ? "u-sort-item u-sort-price is-active" : 'u-sort-item u-sort-price'}
						onClick={() => this.handleSortItemClick('price')}
					>
						价格
						<div className="m-pt-box">
							<span 
								className={this.state.sortPriceTag === -1 ? "u-pt u-pt-up is-active" : 'u-pt u-pt-up'} 
							></span>
							<span 
								className={this.state.sortPriceTag === 1 ? "u-pt u-pt-down is-active" : 'u-pt u-pt-down'} 
							></span>
						</div>
					</div>
				</div>

				<div className="m-goods-list">
					{
						this.state.goods.map(el => (
							<GoodsItem 
								key={el.id}
								speText="¥"
								data={GoodsItem.ormParams(el.id,el.name,el.imgPath,el.price,el.originPrice,el.backProfit)}
							/>
						))
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

// export default SearchResult;
const mapStateToProps = (state) => {
  return {
    member: state.member
  }
}

export default connect(mapStateToProps)(Wrapper(SearchResult));