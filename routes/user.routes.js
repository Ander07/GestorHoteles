'use strict'

var express = require('express');
var userController = require('../controller/user.controller');
var hotelController = require('../controller/hotel.controller');
var api = express();
var middlewareAuth = require('../middlewares/authenticated');

api.post('/saveUser', userController.saveUser);
api.post('/login', userController.login);
api.put('/updateUser/:id', middlewareAuth.ensureAuth, userController.updateUser);
api.delete('/deleteUser/:id', middlewareAuth.ensureAuth, userController.deleteUser);
api.get('/listHotelsMa', middlewareAuth.ensureAuth,userController.listHotelMa);
api.get('/listHotelsMe', middlewareAuth.ensureAuth, userController.listHotelMe);
api.get('/orderHotels', middlewareAuth.ensureAuth,userController.orderHoteles);
api.get('/disponibility', middlewareAuth.ensureAuth, userController.searchDisponibility);
api.get('/score', middlewareAuth.ensureAuth, userController.searchScore);


api.post('/saveHotel', middlewareAuth.ensureAuthAdmin, hotelController.saveHotel);

module.exports = api;