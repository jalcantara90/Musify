'use strict'

const fs = require('fs'); // requerimos filesistem para poder trabajar con los ficheros del servidor
const path = require('path'); // requerimos path para poder trabajr con las rutas del servidor
const mongoosePaginate = require('mongoose-pagination');

const Album = require('../models/album');
const Song = require('../models/song');

const getAlbum = (req, res)=>{
    let albumId = req.params.id;

    Album.findById(albumId).populate({ path: 'artist' }).exec( (err, album)=> { // con populate hacemos que en la propiedad que mostremos nos muestre toda la información de la colección asociada
        if(err) {
            res.status(500).send({ message: 'Error en la petición'});
        }else {
            if(!album) {
                res.status(404).send( {message: 'No existe el album'});
            }else {
                 res.status(200).send({ album });
            }
        }
    });
} 

const getAlbums = (req, res)=> {

    let artistId = req.params.artist;

    if ( !artistId ) {
        // sacar todos los albums de la bbdd
        var find = Album.find({}).sort('title');
    }else {
        // sacar los albums de un artista concreto
        var find = Album.find({ artist: artistId }).sort('year');
    }

    find.populate({ path: 'artist' }).exec( (err, albums )=>{
        if(err) {
            res.status(500).send({message: 'error en la petición'})
        }else {
            if(!albums) {
                res.status(404).send({message: 'No hay albums'});
            }else {
                res.status(200).send({ albums });
            }
        }
    });
}     

const saveAlbum = (req, res) => {
    let album = new Album();

    let params = req.body;

    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = 'null';
    album.artist = params.artist;

    album.save( (err, albumStored) =>{
        if ( err ) {
            res.status(500).send({ message: 'Ha habido un error al crear el album'});
        }else {
            if ( !albumStored ) {
                res.status(404).send( {message: 'No se ha podido guardar el album'});
            }else {
                res.status(200).send({ album : albumStored })
            }
        }
    })

}

const updateAlbum = (req, res)=> {
    let albumId = req.params.id;

    let update = req.body;

    Album.findByIdAndUpdate(albumId, update ,(err, albumUpdated)=> {
        if (err) {
            res.status(500).send({message:'error en la petición'});
        }else {
            if (!albumUpdated) {
                res.status(404).send({ message: 'No se pudo actualizar el album'});
            }else {
                res.status(200).send({ album : albumUpdated});
            }
        }
    })
}

const deleteAlbum = (req, res) => {
    let albumId = req.params.id;

    Album.findByIdAndRemove(albumId, (err, albumDeleted) =>{
        if (err) {
            res.status(500).send({ message: 'error en la petición'});
        }else {
            if(!albumDeleted) {
                res.status(404).send({ message: 'No se pudo eliminar el album'});
            }else {
                Song.find({album: albumDeleted._id}).remove((err, songsRemoved) => {
                    if (err) {
                        res.status(500).send({ message: 'error en la petición'});
                    }else {
                        if(!songsRemoved) {
                            res.status(404).send({ message: 'No se pudo eliminar el album'});
                        }else {
                            res.status(200).send({ album: albumDeleted});
                        }
                    }
                })
            }
        }
    })
}

const uploadImage = (req, res) => {
    let albumId = req.params.id;
    let file_name = 'No subido...';

    if(req.files) {
        let file_path = req.files.image.path;

        let file_split = file_path.split('/');
        let file_name = file_split[2];

        let ext_split = file_name.split('\.');
        let file_ext = ext_split[1];

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {

            Album.findByIdAndUpdate( albumId, { image: file_name } , (err, albumUpdated) => {

                if (!albumUpdated) {
                    res.status(404).send({ message: 'no se ha podido actualizar el album'});
                }else {
                    res.status(200).send({image: file_name, album: albumUpdated});
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
    let path_file = './uploads/album/' + imageFile;

    fs.exists( path_file, (exists)=>{
        if (exists) {
            res.sendFile(path.resolve( path_file ))
        }else {
            res.status(200).send({ message: 'No existe la imagen...'});
        }
    })
}


module.exports = {
    getAlbum,
    saveAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile
}