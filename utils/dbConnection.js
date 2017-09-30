const Sequelize = require('sequelize');
const config = require('../config/db');

var sequelize = new Sequelize(config.database,config.username,config.password,{
	host: config.host,
	dialect: 'mysql',
	pool: {
		max: 5,
		min: 0,
		idle: 10000
	}
});

sequelize
	.authenticate()
	.then(()=>{
		console.log('Connection Database Successful!')
	})
	.catch(()=>{
		console.log('Connection Database Failed!')
	});

module.exports = sequelize;