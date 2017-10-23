import './index.css';
import React,{Component} from 'react';

const ButtonLoadMore = props => (
	<button style={{display: props.display?'block':'none'}} className="u-button-loadmore" onClick={()=>props.onClick()}>
		加载更多
	</button>
);

export default ButtonLoadMore;