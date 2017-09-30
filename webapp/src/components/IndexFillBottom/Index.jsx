import React,{Component} from 'react'

const IndexFillBottom = (props) => {
	const height = props.height ? props.height + 'rem' : '1rem'
	return(
		<div style={{height: height}}></div>
	)
}

export default IndexFillBottom