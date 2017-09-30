import React,{Component} from 'react'
import PropTypes from 'prop-types'
import './index.css'

class BlockTitle extends Component {

	static propTypes = {
		title: PropTypes.string
	}

	static defaultPropTypes = {
		title: 'Title'
	}

	render() {
		return (
			<div className="m-block-title">
				{this.props.title}
			</div>
		)
	}
}

export default BlockTitle