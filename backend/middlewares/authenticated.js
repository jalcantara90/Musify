'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');
const secret = 'clave_secreta_curso';

exports.ensureAuth = function(req, res, next) {  //exportamos el método ensureAuth del middleware, que se encargará de comprobar si hay un token válido

    if (!req.headers.authorization) { 
        // si la petición no tiene el header authorization mostramos error y cerramos middleware
        return res.status(403).send({mesage: 'La petición no tiene la cabecera de autenticación'});
    }
        // si hay header authorization cogemos el token, y limpiamos posibles '," para evitar errores
    const token = req.headers.authorization.replace(/['"]+/g,'');

    try {
        // decodificamos el token y lo pasamos a la variable payload
        var payload = jwt.decode(token, secret);

        if( payload.exp <= moment().unix() ) {
            // comprobamos si el token ha expirado
            return res.status(401).send({mesage: 'El token ha expirado'});
        }
    }catch(ex){
        // si el token no es válido salimos del middleware y mostramos mensaje de error
        // console.log(ex);
        return res.status(403).send({mesage: 'El token no es válido'});
    }

    // si todo es correcto le añadimos a la request el método user donde tendrá toda la información del payload
    req.user = payload;

    // llamamos al siguiente middleware
    next();

};