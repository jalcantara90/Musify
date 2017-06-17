'use strict'

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// cargar rutas

const user_routes = require('./routes/user');
const artist_routes = require('./routes/artist');
const album_routes = require('./routes/album');
const song_routes = require('./routes/song');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// configurar cabeceras http
app.use(( (req, res, next)=> {
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-Width, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow' , 'GET, POST, OPTIONS, PUT, DELETE');

    next();
}))
// rutas base

app.use('/api', user_routes );
app.use('/api', artist_routes);
app.use('/api', album_routes);
app.use('/api', song_routes);


module.exports = app;