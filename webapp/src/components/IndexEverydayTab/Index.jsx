import './index.css'
import PropTypes from 'prop-types'
import React,{Component} from 'react'
import {Tabs} from 'antd-mobile'
import GoodsItem from '../GoodsItem/Index.jsx'
import Util from '../../utils/Util'

const timeChunks = [
    {
        startTime: '9:00',
        endTime: '12:00'
    },
    {
        startTime: '12:00',
        endTime: '15:00'
    },
    {
        startTime: '15:00',
        endTime: '18:00'
    },
    {
        startTime: '18:00',
        endTime: '21:00'
    }
];

const makeTabPane = (text,key,data,timeChunk) => {
	const date = new Date(),
			curDate = date.getFullYear() +'-'+ Util.fillZero(date.getMonth()+1)+'-'+Util.fillZero(date.getDate()),
			goods = [];
	for (var j = 0; j < data.length; j++) {
		var dataItem = data[j];
		if (dataItem.timeChunk === (timeChunk.startTime+':00'+'~'+timeChunk.endTime+':00')) {
			goods.push(<GoodsItem 
				speText="特卖价：¥"
				data={
					GoodsItem.ormParams(dataItem.drinkId,dataItem.drink.name,dataItem.drink.imgPath,dataItem.price,dataItem.drink.originPrice,dataItem.backProfit)
				}
				key={dataItem.id}
			/>)
		}
	}
	return (
		<Tabs.TabPane tab={text} key={key}>
			{
				goods
			}
		</Tabs.TabPane>
	)
}


const makeMultiPane = data => {
	const result = [];
	for (var i = 0; i < timeChunks.length; i++) {
		result.push(makeTabPane(timeChunks[i].startTime+'~'+timeChunks[i].endTime,i,data,timeChunks[i]));
	}
	return result
}

class IndexEverydayTab extends Component {

	static propTypes = {
		data: PropTypes.array
	}

	static defaultProps = {
		data: []
	}

	render() {
		// <Tabs 
		// 	swipeable={false}
		// 	activeTextColor="#f13030"
		// >
		// 	{makeMultiPane(this.props.data)}
		// </Tabs>
		return (
			<div className="m-everyday">
				{
					this.props.data.map(item => 
						<GoodsItem 
							speText="特卖价：¥"
							data={
								GoodsItem.ormParams(item.id,item.name,item.imgPath,item.price,item.originPrice,item.backProfit)
							}
							key={item.id}
						/>
					)
				}
			</div>
		)
	}
}

export default IndexEverydayTab