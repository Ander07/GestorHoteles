'use strict'

var User = require('../models/user.model');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
var Hotel = require('../models/hotel.model');

function saveUser(req, res){
    var params = req.body;
    var user = new User();
    
    if(params.name &&
        params.email &&
        params.username &&
        params.password 
        //params.role
        ){
            
            User.findOne({$or:[{username: params.username},{email: params.email}]},(err, userFind)=>{
                if(err){
                    res.status(500).send({message: 'Error general.'});
                }else if(userFind){
                    res.send({message: 'Correo o usuario ya utilizado.'});
                }else{
                    user.name = params.name;
                    user.email = params.email;
                    user.username = params.username;
                    user.password = params.password;
                    user.role = params.role;

                    bcrypt.hash(params.password, null, null, (err, hashPassword)=>{
                        if(err){
                            res.status(500).send({message: 'Error al encriptar.'});
                        }else{
                            user.password = hashPassword;

                            user.save((err, userSaved)=>{
                                if(err){
                                    res.status(500).send({message: 'Error general.'});
                                }else if(userSaved){
                                    res.send({user: userSaved});
                                }else{
                                    res.status(418).send({message: 'Error al guardar usuario.'});
                                }
                            });
                        }
                    });
                }
            });
        }else{
            res.send({message: 'Ingresa todos los datos'});
        }
}

function login(req, res){
    var params = req.body;

    if(params.username || params.email){
        if(params.password){
            User.findOne({$or:[{username: params.username}, {email: params.email}]}, (err, userFind)=>{
                if(err){
                    res.status(500).send({message: 'Error general.'});
                }else if(userFind){
                    bcrypt.compare(params.password, userFind.password, (err, checkPass)=>{
                        if(err){
                            res.status(500).send({message: 'Error general.'});
                        }else if(checkPass){
                            if(params.getToken){
                                res.send({token: jwt.createToken(userFind)});
                            }else{
                                res.send({user: userFind});
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
        res.send({message: 'Ingresa tu usuario o correo.'});
    }
}

function updateUser(req, res){
    var userId = req.params.id;
    var update = req.body;

    if(userId != req.user.sub){
        res.status(403).send({message: 'Usuario no logueado.'});
    }else{
        User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated)=>{
            if(err){
                res.status(500).send({message: 'Error general.'});
            }else if(userUpdated){
                res.send({user: userUpdated});
            }else{
                res.status(418).send({message: 'No se pudo actualizar.'});
            }
        });
    }
}

function deleteUser(req, res){
    var userId = req.params.id;
    
    if(userId != req.user.sub){
        res.status(403).send({message: 'Usuario no logueado.'});
    }else{
        User.findByIdAndRemove(userId, (err, userDeleted)=>{
            if(err){
                res.status(500).send({message: 'Error general.'});
            }else if(userDeleted){
                res.send({userDeleted: userDeleted});
            }else{
                res.status(418).send({message: 'No se pudo eliminar.'});
            }
        });
    }
}

function orderHoteles(req, res){
    var userId = req.params.id;
    
    if(userId != req.user.sub){
        res.status(403).send({message: 'Usuario no logueado.'});
    }else{
        Hotel.find((err, orderHotel)=>{
            if(err){
                res.status(500).send({message: 'Error general.'});
            }else if(orderHotel){
                res.send({hotels: orderHotel});
            }else{
                res.status(418).send({message: 'Error al listar'});
         }
        }).sort({name:1});
    }
}

function listHotelMa(req, res){
    var userId = req.params.id;
    
    if(userId != req.user.sub){
        res.status(403).send({message: 'Usuario no logueado.'});
    }else{
    Hotel.find({}, (err, hotel)=>{
        if(err){
            res.status(500).send({message: 'Error en servidor'});
        }else if(hotel){
                res.send({hotel: hotel});
            }else{  
                res.status(200).send({message: 'No hay registros'});
            }
        }).sort({price:1});
    }
}

function listHotelMe(req, res){

    var userId = req.params.id;
    
    if(userId != req.user.sub){
        res.status(403).send({message: 'Usuario no logueado.'});
    }else{
    Hotel.find({}, (err, hotel)=>{
        if(err){
            res.status(500).send({message: 'Error en servidor'});
        }else if(hotel){
                res.send({hotel: hotel});
            }else{  
                res.status(200).send({message: 'No hay registros'});
            }
        
        }).sort({price:-1});
    }
}

function searchDisponibility(req,res){
    var params = req.body;
    var userId = req.params.id;
    
    if(userId != req.user.sub){
        res.status(403).send({message: 'Usuario no logueado.'});
    }else{
        Hotel.find({$or:[{disponibility:{$gte:new Date(params.entryDate),$lte:new Date(params.departureDate)}}]},
                    (err, disponibility)=>{
                        if(err){
                            res.status(500).send({message:'Error general'});
                        }else if(disponibility){
                            res.send({hotels:disponibility});
                        }else{
                            res.status(418).send({message: 'No se encuentran disponibles.'});
                        }
                    });
                }           
}


function searchScore(req, res){

    const coincidence = req.body.search;
    var id = req.params.id;

        if(id){
            res.status(500).send({message: 'Error general'});
        }else if(coincidence){
            Hotel.find({$or:[{'score':{$regex: coincidence,$options:'i'}}]},(err, scoreFind) => {
        if(err){
            res.status(500).send({message: 'Error general.'});
        }else if(scoreFind){
            res.status(200).send({hotel: scoreFind});
        }else{
            res.status(200).send({message: 'No se encontraron hoteles.'});
        }
    });
        }else{
            res.send({message: 'No hay datos para mostrar'});
    }
}



module.exports = {
    saveUser,
    login,
    updateUser,
    deleteUser,
    listHotelMa,
    listHotelMe,
    orderHoteles,
    searchDisponibility,
    searchScore
}