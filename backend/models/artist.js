'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArtistSchema = Schema({
    name:String,
    description: String,
    image: String
});

module.exports = mongoose.model('Artist', ArtistSchema);