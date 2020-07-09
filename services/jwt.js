'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var key = 'user1808Pass123';
var keyH = 'hotel1808Pass123';

exports.createToken = (user)=>{
    var payload = {
        sub: user._id,
        name: user.name,
        username: user.username,
        role: user.role,
        iat: moment().unix(),
        exp: moment().add(10, "minutes").unix()
    };
    return jwt.encode(payload, key);
}

exports.createTokenH = (hotel)=>{
    var payload = {
        sub: hotel._id,
        name: hotel.name,
        userHotel: hotel.userHotel,
        iat: moment().unix(),
        exp: moment().add(10, "minutes").unix()
    };
    return jwt.encode(payload, keyH);
}