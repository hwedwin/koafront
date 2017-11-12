import Ajax from '../../utils/Ajax';
import Config from '../../config/Config';
import React,{Component} from 'react';
import {Toast} from 'antd-mobile';
import Carousel from '../../components/IndexCarousel/Index.jsx';
import Searchbar from '../../components/IndexSearchbar/Index.jsx';
import CateBox from '../../components/IndexCateBox/Index.jsx';
import BlockTitle from '../../components/BlockTitle/Index.jsx';
import IndexEverydayTab from '../../components/IndexEverydayTab/Index.jsx';
import IndexGridGoods from '../../components/IndexGridGoods/Index.jsx';
import IndexFillBottom from '../../components/IndexFillBottom/Index.jsx';
import {connect} from 'react-redux';
import Wrapper from '../Wrapper.jsx';
import {initSwipers,initSpecials,initRecs} from '../../store/userStore.js';

class IndexHome extends Component {

	constructor(props) {
		super(props);
		this.state = {
			swipers: props.swipers,
			specials: props.specials,
			recs: props.recs
		}
	}

	componentDidMount() {
		this._request(false);
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.member.isPaidAgent !== prevProps.member.isPaidAgent) {
			setTimeout(()=>this._request(true),500);
		}
	}

	_request(isAsk) {
		if (!isAsk && this.state.swipers.length > 0) {
			return;
		}
		Toast.loading('加载中...',0);
		var self = this;
		var isAgent = this.props.member.isPaidAgent;
		//获取轮播
		var a1 = Ajax.post({url: Config.API.TOPADV_LIST},isAgent)
			a1.then(function(data) {
				if (data.status === 200) {
					self.setState({
						swipers: data.data
					},function(){
						self.props.initSwipers(data.data);
					});
				}
			}).catch(function(error){
				console.log(error);
			});

		// 获取每日特卖
		var a2 = Ajax.post({url: Config.API.DRINK_LISTSPECIAL},isAgent)
			a2.then(function(data) {
				if (data.status === 200) {
					self.setState({
						specials: data.data
					},function(){
						self.props.initSpecials(data.data);
					});
				}
			}).catch(function(error){
				console.log(error);
			});

		// 获取每日推荐
		var a3 = Ajax.post({url: Config.API.DRINK_LISTREC},isAgent)
			a3.then(function(data) {
				if (data.status === 200) {
					self.setState({
						recs: data.data
					},function(){
						self.props.initRecs(data.data);
					});
				}
			}).catch(function(error){
				console.log(error);
			});

		Promise.all([a1,a2,a3]).then(function(){
			Toast.hide();
		},function(){
			Toast.info('请求超时');
		}).catch(function(){});
	}

	handleCateItemClick(id) {
		this.props.history.push('/cate/'+id);
	}

	handleSearchFocus() {
		this.props.history.push('/search');
	}

	render() {
		return (
			<div className="page-index-home">
				<Searchbar
					onSearchFocus={this.handleSearchFocus.bind(this)}
				 />
				<Carousel 
					autoplay={true}
					data={this.state.swipers}
				/>
				<CateBox 
					onItemClick={this.handleCateItemClick.bind(this)}
				/>
				<BlockTitle title="每日特卖"/>
				<IndexEverydayTab 
					data={this.state.specials}
				/>
				<BlockTitle title="精选推荐"/>
				<IndexGridGoods 
					history={this.props.history}
					data={this.state.recs}
				/>
				<IndexFillBottom />
			</div>
		)
	}
}
// export default IndexHome

const mapStateToProps = (state) => {
  return {
  	agentId: state.agentId,
    member: state.member,
    swipers: state.swipers,
    specials: state.specials,
    recs: state.recs
  };
}

const mapDispatchToProps = (dispatch) => {
	return {
		initSwipers: (swipers) => dispatch(initSwipers(swipers)),
		initSpecials: (specials) => dispatch(initSpecials(specials)),
		initRecs: (recs) => dispatch(initRecs(recs))
	};
}

export default connect(mapStateToProps,mapDispatchToProps)(Wrapper(IndexHome));