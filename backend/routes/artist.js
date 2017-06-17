'use strict'

const express = require('express');
const ArtistController = require('../controllers/artist');
const api = express.Router();
const md_auth = require('../middlewares/authenticated');

const multipart = require('connect-multiparty'); // librería que sirve enviar ficheros por http
const md_upload = multipart({ uploadDir: './uploads/artists' })

api.get('/artist/:id', md_auth.ensureAuth, ArtistController.getArtist );
api.post('/artist', md_auth.ensureAuth, ArtistController.saveArtist );
api.get('/artists/:page?', md_auth.ensureAuth, ArtistController.getArtists );
api.put('/artist/:id', md_auth.ensureAuth, ArtistController.updateArtist );
api.delete('/artist/:id', md_auth.ensureAuth, ArtistController.deleteArtist );
api.post('/upload-image-artist/:id', [md_auth.ensureAuth, md_upload] ,ArtistController.uploadImage );
api.get('/get-image-artist/:imageFile' ,ArtistController.getImageFile );


module.exports = api;