import './LArea.css'
// import React,{Component} from 'react'
import LArea from './LArea'
import LAreaData from './LAreaData1'

const KGArea = {
	init: function(id) {
		var area1 = new LArea();
	    area1.init({
	        'trigger': id, //触发选择控件的文本框，同时选择完毕后name属性输出到该位置
	        // 'valueTo': '#value1', //选择完毕后id属性输出到该位置
	        'keys': {
	            id: 'id',
	            name: 'name'
	        }, //绑定数据源相关字段 id对应valueTo的value属性输出 name对应trigger的value属性输出
	        'type': 1, //数据源类型
	        'data': LAreaData //数据源
	    });
	}
}

export default KGArea