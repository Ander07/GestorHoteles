'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var key = 'user1808Pass123';
var keyH = 'hotel1808Pass123';

exports.ensureAuth = (req, res, next)=>{
    if(!req.headers.authorization){
        return res.status(500).send({message: 'Petición de autorización.'});
    }else{
        var token = req.headers.authorization.replace(/["']+/g, '');
        try{
            var payLoad = jwt.decode(token, key);
            if(payLoad.exp <= moment().unix()){
                return  res.status(401).send({message: 'Token expirado.'});
            }
        }catch(ex){
            return res.status(404).send({message: 'Token no válido.'});
        }
        req.user = payLoad;
        next();
    }
}

exports.ensureAuthAdmin = function(req, res, next){
    if(!req.headers.authorization){
        return res.status(500).send({message: 'Peticion de autorizacion'});
    }else{
        var token = req.headers.authorization.replace(/["']+/g,'');
        try{
            var payLoad = jwt.decode(token, key);
            if(payLoad.exp <= moment().unix()){
               return res.status(401).send({message: 'Token expirado'});
            }else if(payLoad.role != 'ADMIN'){
                return res.status(403).send({message: 'No esta autorizado para esta ruta'});
            }
        }catch(ex){
            return res.status(418).send({message: 'Token no válido'});
        }
        req.user = payLoad;
        next();
    }
}

exports.ensureAuthHotel = (req, res, next)=>{
    if(!req.headers.authorization){
        return res.status(500).send({message: 'Petición de autorización.'});
    }else{
        var token = req.headers.authorization.replace(/["']+/g, '');
        try{
            var payLoad = jwt.decode(token, keyH);
            if(payLoad.exp <= moment().unix()){
                return  res.status(401).send({message: 'Token expirado.'});
            }
        }catch(ex){
            return res.status(404).send({message: 'Token no válido.'});
        }
        req.hotel = payLoad;
        next();
    }
}