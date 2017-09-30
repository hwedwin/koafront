/**
 * 参数验证
 *
 * [
 * {
 * 	name: 'name',
 * 	type: paramsVerify.STRING,
 * 	value: 'jjj',
 * 	min: 6,
 * 	max: 12
 * },
 * {
 * 	name: 'age',
 * 	type: paramsVerify.NUMBER,
 * 	value: 20,
 * 	min: 0,
 * 	max: 100
 * },
 * ]
 */
const respond = require('./respond');

const paramsVerify = {
	STRING: 'String',
	NUMBER: 'Number',
	BOOLEAN: 'Boolean',
	ARRAY: 'Array',
	OBJECT: 'Object',
	verify: function(data,ctx) {
		var item = null;
		for (var i = 0; i < data.length; i++) {
			item = data[i];
			this.verifyType(item.value,item.type,item.name,ctx);
			if ((item.type === this.STRING || item.type === this.NUMBER) && item.min || item.max) {
				this.verifyRange(item.value,item.min,item.max,item.name,ctx);
			}
		}
	},

	/**
	 * 验证数据类型
	 * @Author   KuangGuanghu
	 * @DateTime 2017-08-01
	 */
	verifyType: function(value,assume,name,ctx) {
		if (this.getType(value) !== assume){
			respond.json(ctx,false,'参数：'+name+'类型不正确，提供类型为：'+this.getType(value)+'需要：'+assume);
			return false;
		}
		return true;
	},

	/**
	 * 值范围验证
	 * @Author   KuangGuanghu
	 * @DateTime 2017-08-01
	 */
	verifyRange: function(value,min,max,name,ctx) {
		var selfRange = 0;

		var isString = this.getType(value) === this.STRING;
		if (isString) {
			selfRange = value.length;
		}else{
			selfRange = value;
		}

		var pass = true;
		var message = '';
		if (min && max) {
			if (selfRange < min || selfRange > max) {
				pass = false;
				message = '参数：'+name+'值范围不正确，提供值为：'+(isString?value.length:value)+',需要：'+min+'至'+max+'';
			}
		}else if( min && !max){
			if (selfRange < min) {
				pass = false;
				message = '参数：'+name+'值范围不正确，提供值为：'+(isString?value.length:value)+',需要至少：'+min;
			}
		}else{
			if (selfRange > max) {
				pass = false;
				message = '参数：'+name+'值范围不正确，提供值为：'+(isString?value.length:value)+',需要最多：'+max;
			}
		}

		if (!pass) {
			respond.json(ctx,true,message);
			return false;
		}
		
		return true;
	},

	getType: function(value) {
		return Object.prototype.toString.call(value).substr(8).slice(0,-1);
	}
}

module.exports = paramsVerify;