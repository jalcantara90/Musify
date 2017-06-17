'use strict'

const express = require('express');
const AlbumController = require('../controllers/album');
const api = express.Router();
const md_auth = require('../middlewares/authenticated');

const multipart = require('connect-multiparty'); // librería que sirve enviar ficheros por http
const md_upload = multipart({ uploadDir: './uploads/album' })

api.get('/album/:id', md_auth.ensureAuth, AlbumController.getAlbum );
api.post('/album', md_auth.ensureAuth, AlbumController.saveAlbum );
api.get('/albums/:artist?', md_auth.ensureAuth, AlbumController.getAlbums );
api.put('/update-album/:id', md_auth.ensureAuth, AlbumController.updateAlbum );
api.delete('/album/:id', md_auth.ensureAuth, AlbumController.deleteAlbum );
api.post('/upload-image-album/:id', [md_auth.ensureAuth, md_upload] ,AlbumController.uploadImage );
api.get('/get-image-album/:imageFile' ,AlbumController.getImageFile );


module.exports = api;