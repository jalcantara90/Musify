'use strict'

const fs = require('fs'); // requerimos filesistem para poder trabajar con los ficheros del servidor
const path = require('path'); // requerimos path para poder trabajr con las rutas del servidor
const mongoosePaginate = require('mongoose-pagination');

const Song = require('../models/song');

const getSong = (req, res) => {

    let songId = req.params.id;

    Song.findById(songId, (err, song) => {
        if (err) {
            res.status(500).send({message: 'Error en la petición'});
        }else {
            if (!song) {
                res.status(404).send( { message: 'Canción no encontrada' });
            }else {
                res.status(200).send({ song });
            }
        }
    })
}

const getSongs = (req, res) => {

    let albumId = req.params.album;

    if ( !albumId ) {
        var find = Song.find({}).sort('number');
    }else {
        var find = Song.find({album: albumId}).sort('number');
    }

    find.populate({ 
            path: 'album',
            populate:{
                path: 'artist',
                model: 'Artist'
            }
        }).exec( (err, songs) => {
        if( err ) {
            res.status(500).send({ message: 'Error en la petición'});
        }else {
            if ( !songs ){
                res.status(404).send('No se han podido mostrar las canciones');
            }else {
                res.status(200).send({ songs })
            }
        }
    })
}

const saveSong = (req, res) => {
    let song = new Song();

    let params = req.body;
 
    song.number = params.number;
    song.name = params.name;
    song.duration = params.duration;
    song.file = null;
    song.album = params.album;

    song.save( (err, songStored ) => {
        if( err ) {
            res.status(500).send({ message: 'Error en la petición'});
        }else {
            if ( !songStored ){
                res.status(404).send('No se ha podido guardar la canción');
            }else {
                res.status(200).send({ song: songStored })
            }
        }
    });
}

const updateSong = (req ,res ) => {
    let songId = req.params.id;

    let update = req.body;

    Song.findByIdAndUpdate( songId ,update ,(err, songUpdated) => {
        if ( err ) {
            res.status(500).send( {message: 'Error en la petición'} );
        }else {
            if ( !songUpdated ) {
                res.status(404).send({message: 'canción no encontrada'});
            }else {
                res.status(200).send({ songUpdated });
            }
        }
    })
}

const deleteSong = (req, res) => {
    let songId = req.params.id;

    Song.findByIdAndRemove( songId, (err, songDeleted) => {
        if ( err ) {
            res.status(500).send( {message: 'Error en la petición'} );
        }else {
            if ( !songDeleted ) {
                res.status(404).send({message: 'canción no encontrada'});
            }else {
                res.status(200).send({ songDeleted });
            }
        }
    })
}

const uploadFile = (req, res) => {
    let songId = req.params.id;
    let file_name = 'No subido...';

    if(req.files) {
        let file_path = req.files.file.path;

        let file_split = file_path.split('/');
        let file_name = file_split[2];

        let ext_split = file_name.split('\.');
        let file_ext = ext_split[1];

        if(file_ext == 'mp3' || file_ext == 'ogg') {

            Song.findByIdAndUpdate( songId, { file: file_name } , (err, songUpdated) => {

                if (!songUpdated) {
                    res.status(404).send({ message: 'no se ha podido actualizar el album'});
                }else {
                    res.status(200).send({album: songUpdated});
                }
            })

        }else {
            res.status(200).send({ message: 'Extensión del archivo incorrecta'});
        }
    }else{
        res.status(200).send({ message: 'No se ha podido subir la imagen...'});
    }
}


const getSongFile = (req, res) =>{
    let songFile = req.params.songFile;
    let path_file = './uploads/songs/' + songFile;

    fs.exists( path_file, (exists)=>{
        if (exists) {
            res.sendFile(path.resolve( path_file ))
        }else {
            res.status(200).send({ message: 'No existe la canción...'});
        }
    })
}



module.exports = {
    getSong,
    saveSong,
    getSongs,
    updateSong,
    deleteSong,
    uploadFile,
    getSongFile
}