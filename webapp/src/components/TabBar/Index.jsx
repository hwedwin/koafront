import React,{Component} from 'react'
import PropTypes from 'prop-types'
import {TabBar,Icon} from 'antd-mobile'
import svgHome from '../../assets/svg/home.svg'
import svgList from '../../assets/svg/list.svg'
import svgCart from '../../assets/svg/cart.svg'
import svgUser from '../../assets/svg/user.svg'
import svgHomeActive from '../../assets/svg/homeActive.svg'
import svgListActive from '../../assets/svg/listActive.svg'
import svgCartActive from '../../assets/svg/cartActive.svg'
import svgUserActive from '../../assets/svg/userActive.svg'

class IndexTabBar extends Component {

	static propTypes = {
		onTabBarClick: PropTypes.func
	}

	static defaultPropTypes = {
		onTabBarClick: function(){}
	}

	constructor(props) {
		super(props);
		var pathname = props.location.pathname.replace('/home','')
		pathname = pathname === '' ? '/' : pathname
		pathname = pathname === '/'? 'home' : pathname.slice(1)
		this.state = {
			hidden: false,
			selectedTab: pathname
		}
	}

	render() {
		return (
			<TabBar
				unselectedTintColor="#949494"
				tintColor="#f13030"
				barTintColor="white"
				hidden={this.state.hidden}
			>
				<TabBar.Item
					title="首页"
					key="home"
					icon={<Icon type={svgHome}/>}
					selectedIcon={<Icon type={svgHomeActive}/>}
					selected={this.state.selectedTab === 'home'}
					onPress={()=>{
						this.setState({
							selectedTab : 'home'
						})
						this.props.onTabBarClick('')
					}}
				/>

				<TabBar.Item
					title="分类"
					key="list"
					icon={<Icon type={svgList}/>}
					selectedIcon={<Icon type={svgListActive}/>}
					selected={this.state.selectedTab === 'list'}
					onPress={()=>{
						this.setState({
							selectedTab : 'list'
						})
						this.props.onTabBarClick('list')
					}}
				/>

				<TabBar.Item
					title="购物车"
					key="cart"
					icon={<Icon type={svgCart}/>}
					selectedIcon={<Icon type={svgCartActive}/>}
					selected={this.state.selectedTab === 'cart'}
					onPress={()=>{
						this.setState({
							selectedTab : 'cart'
						})
						this.props.onTabBarClick('cart')
					}}
				/>

				<TabBar.Item
					title="我"
					key="user"
					icon={<Icon type={svgUser}/>}
					selectedIcon={<Icon type={svgUserActive}/>}
					selected={this.state.selectedTab === 'user'}
					onPress={()=>{
						this.setState({
							selectedTab : 'user'
						})
						this.props.onTabBarClick('user')
					}}
				/>
			</TabBar>
		)
	}
}

export default IndexTabBar
