'use strict'

const fs = require('fs'); // requerimos filesistem para poder trabajar con los ficheros del servidor
const path = require('path'); // requerimos path para poder trabajr con las rutas del servidor
const mongoosePaginate = require('mongoose-pagination');

const Artist = require('../models/artist');
const Album = require('../models/album');
const Song = require('../models/song');

const getArtist = (req, res) => {

    let artistId = req.params.id;
    Artist.findById(artistId, (err, artist)=>{
        if(err) {
            res.status(500).send({message: 'Error en la petición'});
        }else {
            if (!artist) {
                res.status(404).send({ message: 'El artista no existe'});
            }else{
                 res.status(200).send({ artist });
            }
        }
    })
}

const saveArtist = (req, res) => {
    let artist = new Artist();

    let params = req.body;
    artist.name = params.name;
    artist.description = params.description;
    artist.image = 'null';

    artist.save( (err, artistStored) => {
        if (err) {
            res.status(500).send({message: 'Error al guardar artista'});
        }else {
            if (!artistStored) {
                res.status(404).send({ message: 'El artista no ha sido guardado'});
            }else {
                res.status(200).send({ artist: artistStored});
            }
        }
    })
}

const getArtists = (req, res) => {

    if (req.params.page) {
        var page = req.params.page;
    }else {
        var page = 1;
    }
    
    let itemsPerPage = 3;

    Artist.find().sort('name').paginate(page, itemsPerPage, (err, artists, total)=> {
        if ( err ) {
            res.status(500).send({ message: 'Error en la petición'});
        }else {
            if (!artists) {
                res.status(404).send({ message: 'No hay artistas'});
            }else {
                return res.status(200).send({
                    total_items:total,
                    artists: artists
                });
            }
        }
    })
}

const updateArtist = (req, res) =>{
    const artistId = req.params.id;
    const update = req.body;

    Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated)=>{
        if ( err ) {
            res.status(500).send({message:'Error al modificar artista'})
        }else {
            if (!artistUpdated) {
                res.status(404).send({ message: 'El artista no ha sido actualizado'})
            }else {
                res.status(200).send({ artist: artistUpdated})
            }
        }
    })
}

const deleteArtist = (req, res) => {
    const artistId = req.params.id;
    
    Artist.findByIdAndRemove(artistId, (err, artistRemoved) => {
        if (err) {
             res.status(500).send({message:'Error al eliminar artista'})
        }else {
            if (!artistRemoved) {
                res.status(404).send({ message: 'El artista no ha sido eliminado'})
            }else {
                // si se elimina el artista se procede a eliminar todos sus albums asociados
                Album.find({ artist: artistRemoved._id}).remove( (err, albumRemoved) => {
                    if (err) {
                        res.status(500).send({message:'Error al eliminar Album'})
                    }else {
                        if (!albumRemoved) {
                            res.status(404).send({ message: 'El Album no ha sido eliminado'})
                        }else {
                            // si se elimina el album se procede a elimianr todas las canciones asociadas
                            Song.find({ album: albumRemoved._id}).remove( (err, songRemoved) => {
                                if (err) {
                                    res.status(500).send({message:'Error al eliminar la cancion'})
                                }else {
                                    if (!songRemoved) {
                                        res.status(404).send({ message: 'La canción no ha sido eliminada'})
                                    }else {
                                        res.status(200).send({ artistRemoved});
                                    }
                                }
                            });
                            // fin eliminación de las canciones 
                        }
                    }
                });
                // Fin  eliminación de albumes asociados
            }
        }
    });
    // fin de eliminación del artista
}


const uploadImage = (req, res) => {
    let artistId = req.params.id;
    let file_name = 'No subido...';

    if(req.files) {
        let file_path = req.files.image.path;

        let file_split = file_path.split('/');
        let file_name = file_split[2];

        let ext_split = file_name.split('\.');
        let file_ext = ext_split[1];

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {

            Artist.findByIdAndUpdate( artistId, { image: file_name } , (err, artistUpdated) => {

                 if (!artistUpdated) {
                    res.status(404).send({ message: 'no se ha podido actualizar el usuario'});
                }else {
                    res.status(200).send({image: file_name, artist: artistUpdated});
                }
            })

        }else {
            res.status(200).send({ message: 'Extensión del archivo incorrecta'});
        }

        console.log(file_split);
    }else{
        res.status(200).send({ message: 'No se ha podido subir la imagen...'});
    }
}


const getImageFile = (req, res) =>{
    let imageFile = req.params.imageFile;
    let path_file = './uploads/artists/' + imageFile;

    fs.exists( path_file, (exists)=>{
        if (exists) {
            res.sendFile(path.resolve( path_file ))
        }else {
            res.status(200).send({ message: 'No existe la imagen...'});
        }
    })
}

module.exports = {
    getArtist,
    saveArtist,
    getArtists,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFile
}