'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AlbumSchema = Schema({
    title:String,
    description: String,
    year: Number,
    image: String,
    artist: { type: Schema.ObjectId, ref: 'Artist' }
});

module.exports = mongoose.model('Album', AlbumSchema);