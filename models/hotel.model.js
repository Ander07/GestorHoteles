'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var hotelSchema = Schema({
    name: String,
    address: String,
    phone: String,
    userHotel: String,
    password: String,
    score: String,
    price: Number,
    disponibility:{
        entryDate: Date,
        departureDate: Date
    }

})

module.exports = mongoose.model('hotel', hotelSchema);