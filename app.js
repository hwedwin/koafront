const path = require('path');
const views = require('koa-views');
const logger = require('koa-logger');
const koaBody = require('koa-body');
const koaStatic = require('koa-static');
const session = require('koa-session2');
const cors = require('koa-cors');
const xmlParser = require('koa-xml-body');
const SessionStore = require('./core/SessionStore');
const Koa = require('koa');
const app = new Koa();

var port = 4000;
var env = process.env.NODE_ENV;
console.log(env);
if (env === 'production') {
	port = 80;
}

//连接数据库并设为全局常量
const sequelize = require('./utils/dbConnection');
global.sequelize = sequelize;

//中间件
//日志
app.use(logger());

// 跨域
app.use(cors({
	origin: 'http://localhost:3000',
	methods: ['GET','POST','OPTIONS'],
	credentials: true
}));

//添加公共属性或方法到ctx
// app.use(async function(ctx,next) {
// 	ctx.kgCommon = {
// 		host: 'http://localhost:'+port+'/'
// 	}
// 	await next();
// });

//使用ejs模版
app.use(views(path.join(__dirname,'/webapp/build'),{map:{html:'ejs'}}));
//解析请求体
app.use(xmlParser());
app.use(koaBody({multipart: true}));
//设置静态文件目录
app.use(koaStatic(path.join(__dirname,'/webapp/build')));
//session
app.use(session({
	key: 'SESSIONID',
	store: new SessionStore()
}))
//路由
app.use(require('./routes/index').routes());
app.use(require('./routes/drink').routes());
app.use(require('./routes/brand').routes());
app.use(require('./routes/file').routes());
app.use(require('./routes/member').routes());
app.use(require('./routes/sms').routes());
app.use(require('./routes/cart').routes());
app.use(require('./routes/topadvs').routes());
app.use(require('./routes/order').routes());
app.use(require('./routes/topspe').routes());
app.use(require('./routes/favorite').routes());
app.use(require('./routes/consignee').routes());
app.use(require('./routes/trans').routes());
app.use(require('./routes/balance').routes());

app.listen(port);

module.exports = app