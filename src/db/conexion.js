const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

async function connect() {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Conexión establecida con la base de datos.');
    } catch (err) {
        console.log('Error al conectar con la base de datos: ', err);
        process.exit(1);
    }
}

function disconnect() {
    mongoose.disconnect().then(() => {
        console.log('Desconectado de la base de datos.')
    }).catch((err) => {
        console.log('Error al desconectar de la base de datos: ', err);
    });
}

module.exports = { connect, disconnect }