'use strict'

const express = require('express');
const SongController = require('../controllers/song');
const api = express.Router();
const md_auth = require('../middlewares/authenticated');

const multipart = require('connect-multiparty'); // librería que sirve enviar ficheros por http
const md_upload = multipart({ uploadDir: './uploads/songs' })

api.get('/song/:id', md_auth.ensureAuth, SongController.getSong );
api.post('/song', md_auth.ensureAuth, SongController.saveSong );
api.get('/songs/:album?', md_auth.ensureAuth, SongController.getSongs );
api.put('/update-song/:id', md_auth.ensureAuth, SongController.updateSong );
api.delete('/song/:id', md_auth.ensureAuth, SongController.deleteSong );
api.post('/upload-file-song/:id', [md_auth.ensureAuth, md_upload] ,SongController.uploadFile );
api.get('/get-song-file/:songFile' ,SongController.getSongFile );


module.exports = api;