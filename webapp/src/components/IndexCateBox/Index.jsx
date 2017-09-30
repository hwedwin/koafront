import React,{Component} from 'react'
import {Grid,Icon} from 'antd-mobile'
import svgWhite from '../../assets/svg/white-wine.svg'
import svgRed from '../../assets/svg/red-wine.svg'
import svgBeer from '../../assets/svg/beer.svg'
import svgOther from '../../assets/svg/wine-glass.svg'

class IndexCateBox extends Component {

	constructor(props) {
		super(props);
		this.state = {
			data: [
				{
				  icon: <Icon type={svgWhite} />,
				  text: `白酒`,
				  id: 1
				},
				{
				  icon: <Icon type={svgRed} />,
				  text: `红酒`,
				  id: 2
				},
				{
				  icon: <Icon type={svgBeer} />,
				  text: `啤酒`,
				  id: 3
				},
				{
				  icon: <Icon type={svgOther} />,
				  text: `其他`,
				  id: 4
				}
			]
		}
	}	

	handleItemClick(e) {
		this.props.onItemClick(e.id);
	}

	render() {
		return (
			<div>
				<Grid
					data={this.state.data}
					columnNum={4}
					hasLine={false}
					onClick={this.handleItemClick.bind(this)}
				/>
			</div>
		)
	}
}

export default IndexCateBox