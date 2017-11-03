import React,{Component} from 'react';
import {Route} from 'react-router-dom';
import { Provider,connect } from 'react-redux';
import TabBar from '../components/TabBar/Index.jsx';
import IndexHome from './IndexHome/Index.jsx';
import IndexList from './IndexList/Index.jsx';
import IndexUser from './IndexUser/Index.jsx';
import IndexCart from './IndexCart/Index.jsx';
import wxUtil from '../utils/wxUtil';
import Ajax from '../utils/Ajax';
import Util from '../utils/Util';
import Config from '../config/Config';
import indexStore from '../store/indexStore';

class Index extends Component{

	constructor(props) {
		super(props)
		this.onTabBarClick = this.onTabBarClick.bind(this)
	}

	componentDidMount() {
        if (!Util.isAndroid()) {
            this._initWxShare();
        }
	}

	onTabBarClick(page) {
		let line = ''
		if (!/\/$/.test(this.props.match.url)) {
			line = '/'
		}
		if (page === 'user') {
			if (!this.props.loginStatus) {
				this.props.history.push('/login');
				return false;
			}
		}
		this.props.history.replace(this.props.match.url+line+page)
	}

	_initWxShare() {
        Ajax.post({url: Config.API.WXJS_SIGN,data:{url: window.escape(window.location.href)}})
                .then((res) => {
                    if (res.status === 200) {
                        var title = window.localStorage.getItem('nickname')+'的麦智商城';
                        var link = 'http://www.baebae.cn/?aid='+window.localStorage.getItem('agentId');
                        var logo = 'http://jiuji-test.gz.bcebos.com/logo_100.png';
                        var desc = '来麦智商城，享受高性价比糖酒食品';
                        wxUtil.share(res.data,title,link,logo,desc);
                    }
                }).catch(function(error){
                    console.log(error);
                });
    }

	render() {
		const {match} = this.props;
		return (
			<div>
				<div>
					<Route exact path={match.url} component={IndexHome}/>
					<Route path={`${match.url}/list`} component={IndexList}/>
					<Route path={`${match.url}/cart`} component={IndexCart}/>
					<Route path={`${match.url}/user`} component={IndexUser}/>
				</div>
				<TabBar onTabBarClick={this.onTabBarClick} {...this.props.history}/>
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		member: state.member,
		loginStatus: state.loginStatus
	}
}

export default connect(mapStateToProps)(Index);