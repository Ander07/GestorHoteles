'use strict'

var express = require('express');
var bodyparser = require('body-parser');
var app = express();
var userRoutes = require('./routes/user.routes');
var hotelRoutes = require('./routes/hotel.routes');
 
app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
	next();
});

app.use('/user', userRoutes);
app.use('/hotel', hotelRoutes);

module.exports = app;