module.exports = {
	/**
	 * 以json格式响应客户端请求
	 * @Author   KuangGuanghu
	 * @DateTime 2017-06-20
	 * @param    {object}     ctx     	koa上下文
	 * @param    {boolean}    success 	是否成功
	 * @param    {string}     message 	提示信息
	 * @param    {object}     data    	返回数据
	 * @param    {data}       error   	错误数据
	 */
	json: function(ctx,success,message,data,error) {
		error = error ? error : null;
		data = data ? data : null;
		ctx.type = 'application/json';
		ctx.body = {
			status: (success ? 200 : 400),
			message,
			data,
			error,
		}
	}
}