import React,{Component} from 'react';
import {Route} from 'react-router-dom';
import {connect} from 'react-redux';

import TabBar from '../components/TabBar/Index.jsx';
import IndexHome from './IndexHome/Index.jsx';
import IndexList from './IndexList/Index.jsx';
import IndexUser from './IndexUser/Index.jsx';
import IndexCart from './IndexCart/Index.jsx';

class Index extends Component{

	constructor(props) {
		super(props)
		this.onTabBarClick = this.onTabBarClick.bind(this)
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