const Ajax = {
	formatString: function(data) {
		var str = '',tempStr = '';
		for(var name in data) {
			if (typeof data[name] === 'object') {
				tempStr = name+'='+JSON.stringify(data[name]);
			}else{
				tempStr = name+'='+data[name];
			}
			str += (tempStr+'&');
		}
		return str.replace(/&$/,'');
	},

	getType: function(data) {
		return Object.prototype.toString.call(data).match(/\s([^\]]*)/)[1];
	},

	deepFind: function(data,level) {
		var isAgent = false;
		if (level == 1 || level == 2) {
			isAgent = true;
		}
		if (this.getType(data) === 'Array') {
			for (var i = 0; i < data.length; i++) {
				if (this.getType(data[i]) === 'Object') {
					this.deepFind(data[i],level);
				}
			}
		}else if(this.getType(data) === 'Object'){
			if (data.retailPrice) {
				if (isAgent) {
					data.price = data.supplyPrice;
				}else{
					data.price = data.retailPrice;
				}
			}else if (data.specialPrice) {
				if (isAgent) {
					data.price = data.specialPriceAgent;
				}else{
					data.price = data.specialPrice;
				}
			}
			for (var name in data) {
				if (this.getType(data[name]) === 'Object' || this.getType(data[name]) === 'Array') {
					this.deepFind(data[name],level);
				}
			}
		}else{
			return data;
		}
		return data;
	},

	postFormData: function(options) {
		return new Promise(function(resolve,reject){
			var xhr = new XMLHttpRequest();
			xhr.withCredentials = true;
			xhr.open('POST',options.url,true);
			xhr.setRequestHeader('Cache-Control','no-cache');
			xhr.responseType = 'json';
			xhr.onreadystatechange = function() {
				if (this.readyState === this.DONE) {
					if (this.status === 200 || this.status === 304) {
						resolve(this.response);
					}
				}
			}

			xhr.onload = function() {

			}

			xhr.onerror = function() {
				reject(this.error);
			}
			if (options.data) {
				xhr.send(options.data);
			}else{
				xhr.send();
			}
		});
	},

	post: function(options,level) {
		var self = this;
		return new Promise(function(resolve,reject){
			var xhr = new XMLHttpRequest();
			xhr.withCredentials = true;
			xhr.open('POST',options.url,true);
			xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
			xhr.setRequestHeader('Cache-Control','no-cache');
			xhr.responseType = 'json';
			xhr.onreadystatechange = function() {
				if (this.readyState === this.DONE) {
					if (this.status === 200 || this.status === 304) {
						var data = this.response.data;
						data = self.deepFind(data,level);
						var obj = Object.assign(this.response);
						obj.data = data;
						resolve(obj);
					}
				}
			}

			xhr.onload = function() {

			}

			xhr.onerror = function() {
				reject(this.error);
			}
			if (options.data) {
				xhr.send(self.formatString(options.data));
			}else{
				xhr.send();
			}
		});
	}
}

// console.log(Ajax.deepFind([{retailPrice: 188,supplyPrice: 99},{retailPrice: 288,supplyPrice: 199}]));
// console.log(Ajax.deepFind({name: 'kgh',info: {retailPrice: 188,supplyPrice: 99}}));

export default Ajax;