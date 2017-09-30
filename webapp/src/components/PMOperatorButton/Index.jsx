import './index.css'
import React,{Component} from 'react'
import PropTypes from 'prop-types'

class PMOperatorButton extends Component {

	static propTypes = {
		onOperateClick: PropTypes.func.isRequired,
		value: PropTypes.number.isRequired,
		onNumChange: PropTypes.func.isRequired

	}

	static defaultProps = {
		onOperateClick: function() {},
		value: 1,
		onNumChange: function() {}
	}

	handleClick(e) {
		e.preventDefault();
		e.stopPropagation();
		return false;
	}

	render() {
		return (
			<div className="m-num-operator" onClick={this.handleClick}>
				<button onClick={()=>this.props.onOperateClick(-1)}>-</button>
				<input value={this.props.value} onChange={this.props.onNumChange}/>
				<button onClick={()=>this.props.onOperateClick(1)}>+</button>
			</div>
		)
	}
}

export default PMOperatorButton