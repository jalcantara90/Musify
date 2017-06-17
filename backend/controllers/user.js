'use strict'

const fs = require('fs'); // requerimos filesistem para poder trabajar con los ficheros del servidor
const path = require('path'); // requerimos path para poder trabajr con las rutas del servidor

const bcrypt = require('bcrypt-nodejs');
const User = require('../models/user');
const jwt = require('../services/jwt');

function pruebas (req, res) {
    res.status(200).send({ 
        message: 'Probando el controlador de usuario'
    });
}

function saveUser(req, res) {
    let user = new User(); // instanciamos el objeto user con el modelo correspondiente
    
    let params = req.body; // recogemos todas las variables que nos lleguen por post

    console.log(params);

    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_USER';
    user.image = 'null';

    if ( params.password ) {
        // encriptar contraseña y guardar datos

        bcrypt.hash(params.password, null, null, function (err, hash) {
            user.password = hash;
            if ( user.name != null && user.surname !=null && user.email != null ) {
                // guardar el usuario

                user.save( (err, userStored) => {
                    if ( err ) {
                        res.status(500).send({ message: 'Error al guardar el usuario'});
                    }else {
                        if ( !userStored ) {
                            res.status(404).send({ message: 'No se ha registrado el usuario'});
                        }else {
                            res.status(200).send({ user: userStored });
                        }
                    }
                });

            }else {
                res.status(200).send({ message: 'Rellena todos los campos'});
            }
        });

    }else {
        res.status(200).send({ message: 'Introduce la contraseña'});
    }
}

function loginUser(req, res) {
    let params = req.body;

    let email = params.email;
    let password = params.password;

    User.findOne({ email: email.toLowerCase() }, (err, user)=> {
        if( err ) {
            res.status(500).send({message: ' Error en la petición'});
        }else {
            if(!user) {
                res.status(404).send({ message: 'El usuario no existe '});
            }else{
                // comprobar contraseña si el user existe
                bcrypt.compare(password, user.password, (err, check)=>{
                    if (check) {
                        // devolver los datos del usuario logueado
                        if ( params.gethash ) {
                            // devolver un token de jwt
                            res.status(200).send({
                                token: jwt.createToken(user)
                            });
                        }else {
                            res.status(200).send({user});
                        }
                    }else {
                        res.status(404).send({ message: ' el usuario no ha podido loguearse'});
                    }
                });
            }
        }
    })
}


function updateUser(req, res) {
    let userId = req.params.id;
    let update = req.body;

    User.findByIdAndUpdate(userId, update, (err, userUpdated )=> {
        if ( err ) {
            res.status(500).send({ message: 'Error al actualizar el usuario'});
        }else {
            if (!userUpdated) {
                res.status(404).send({ message: 'no se ha podido actualizar el usuario'});
            }else {
                res.status(200).send({user: userUpdated});
            }
        }
    });
}

const uploadImage = (req, res) => {
    let userId = req.params.id;
    let file_name = 'No subido...';

    if(req.files) {
        let file_path = req.files.image.path;

        let file_split = file_path.split('/');
        let file_name = file_split[2];

        let ext_split = file_name.split('\.');
        let file_ext = ext_split[1];

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {

            User.findByIdAndUpdate( userId, { image: file_name } , (err, userUpdated) => {

                 if (!userUpdated) {
                    res.status(404).send({ message: 'no se ha podido actualizar el usuario'});
                }else {
                    res.status(200).send({ image: file_name, user: userUpdated });
                }
            })

        }else {
            res.status(200).send({ message: 'Extensión del archivo incorrecta'});
        }

    }else{
        res.status(200).send({ message: 'No se ha podido subir la imagen...'});
    }
}

const getImageFile = (req, res) =>{
    let imageFile = req.params.imageFile;
    let path_file = './uploads/users/' + imageFile;

    fs.exists( path_file, (exists)=>{
        if (exists) {
            res.sendFile(path.resolve( path_file ))
        }else {
            res.status(200).send({ message: 'No existe la imagen...'});
        }
    })
}

module.exports = {
    pruebas,
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
    getImageFile
};