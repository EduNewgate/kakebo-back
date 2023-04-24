// Importamos las dependencias necesarias
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const db = require('./db/conexion')

// Creamos la aplicación express
const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var appRoutes = require('./routes/app');
var usuariosRoutes = require('./routes/usuarios');
app.use('/usuarios', usuariosRoutes);
app.use('/', appRoutes);

db.connect();

// Iniciamos la aplicación
app.listen(process.env.PORT || 3000, () => {
  console.log(`La aplicación está corriendo en ${process.env.ENV_LOCAL}${process.env.PORT || 3000}`);
});
