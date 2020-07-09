'use strict'

var express = require('express');
var hotelController = require('../controller/hotel.controller');
var api = express();
var middlewareAuth = require('../middlewares/authenticated');

api.post('/login', hotelController.login);
api.put('/updateHotel/:id', middlewareAuth.ensureAuthHotel, hotelController.updatehotel);
api.delete('/deleteHotel/:id', middlewareAuth.ensureAuthHotel, hotelController.deleteHotel);

module.exports = api;