import React,{Component} from 'react';
import {Button} from 'antd-mobile';

class FlexExample extends Component {
	render() {
		return (
			<div className="flex-container">
				<Button type="primary">primary button</Button>
				<Button loading>loading button</Button>
			</div>
		)
	}
}

export default FlexExample