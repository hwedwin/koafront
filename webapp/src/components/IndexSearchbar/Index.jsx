import React,{Component} from 'react'
import {SearchBar} from 'antd-mobile'
import './index.css'

class IndexSearchbar extends Component {

	handleInputFocus(e) {
		// e.preventDefault();
		this.props.onSearchFocus();
	}

	render() {
		return (
			<div className="m-index-searchbar">
				<SearchBar 
					placeholder="搜索"
					onFocus={this.handleInputFocus.bind(this)}
				 />
			</div>
		)
	}
}

export default IndexSearchbar