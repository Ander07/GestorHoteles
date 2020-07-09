'use strict'

var Hotel = require('../models/hotel.model');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt'); 

function saveHotel(req, res){
    var params = req.body;
    var hotel = new Hotel();

    if(params.name &&
        params.address &&
        params.phone &&
        params.userHotel &&
        params.password &&
        params.score &&
        params.price &&
        params.entryDate &&
        params.departureDate){
            Hotel.findOne({$or:[{userHotel: params.userHotel},{name: params.name}]}, (err, hotelFind)=>{
                if(err){
                    res.status(500).send({message: 'Error general.'});
                }else if(hotelFind){
                    res.send({message: 'Hotel ya registrado.'});
                }else{
                    hotel.name = params.name;
                    hotel.address = params.address;
                    hotel.phone = params.phone;
                    hotel.userHotel = params.userHotel;
                    hotel.password = params.password;
                    hotel.score = params.score;
                    hotel.price = params.price;
                    hotel.disponibility.entryDate = params.entryDate;
                    hotel.disponibility.departureDate = params.departureDate;

                    bcrypt.hash(params.password, null, null, (err, hashPass)=>{
                        if(err){
                            res.status(500).send({message: 'Error general.'});
                        }else{
                            hotel.password = hashPass;

                            hotel.save((err, hotelSaved)=>{
                                if(err){
                                    res.status(500).send({message: 'Error general.'});
                                }else if(hotelSaved){
                                    res.send({hotelSaved: hotelSaved});
                                }else{
                                    res.s(418).send({message: 'Error al guardar el hotel.'});
                                }
                            });
                        }
                    });
                }
            });
        }else{
            res.send({message: 'Ingrese todos los datos.'});
        }
}

function login(req, res){
    var params = req.body;

    if(params.userHotel){
        if(params.password){
            Hotel.findOne({$or:[{userHotel: params.userHotel}]}, (err, hotelFind)=>{
                if(err){
                    res.status(500).send({message: 'Error general.'});
                }else if(hotelFind){
                    bcrypt.compare(params.password, hotelFind.password, (err, checkPass)=>{
                        if(err){
                            res.status(500).send({message: 'Error general.'});
                        }else if(checkPass){
                            if(params.getToken){
                                res.send({token: jwt.createTokenH(hotelFind)});
                            }else{
                                res.send({hotel: hotelFind});
                            }
                        }else{
                            res.status(401).send({message: 'Contraseña incorrecta.'});
                        }
                    });
                }else{
                    res.send({message: 'Usuario no econtrado.'});
                }
            });
        }else{
            res.send({message: 'Ingresa tu contraseña.'});
        }
    }else{
        res.send({message: 'Ingresa tu usuario.'});
    }
}

function updatehotel(req, res){
    var hotelId = req.params.id;
    var update = req.body;

    if(hotelId != req.hotel.sub){
        res.status(403).send({message: 'Erro de permisos, usuario no logueado'});
    }else{
        Hotel.findByIdAndUpdate(hotelId, update, {new: true}, (err, hotelUpdate)=>{
            if(err){
                res.status(500).send({message: 'Error general al actualizar'});
            }else if(hotelUpdate){
                res.send({hotel: hotelUpdate});
            }else{
                res.status(404).send({message: 'No se ha podido actualizar'});
            }
        });
    }
}

function deleteHotel(req, res){
    var hotelId = req.params.id;

    Hotel.findByIdAndRemove(hotelId, (err, hotelDeleted)=>{
        if(err){
            res.status(500).send({message: 'Error general'})
        }else if(hotelDeleted){
            res.send({message: 'Usuario eliminado', hotelDeleted})
        }else{
            res.status(404).send({message: 'Error al eliminar el usuario'});
        }
    });
}


module.exports = {
    saveHotel,
    login,
    updatehotel,
    deleteHotel
}