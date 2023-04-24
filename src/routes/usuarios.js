var express = require('express');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

var Usuario = require('../models/usuario');

var app = express();

// Obtención de usuarios
app.get('/',async (req, res, next) => {
    await Usuario.find({}, 'nombre apellidos email').then((users) => {
        res.status(200).json({
            ok: true,
            users: users
        });
    }).catch((err) => {
        return res.status(500).json({
            ok: false,
            msg: 'Error en la obtención de usuarios',
            errors: err
        });
    })
});

app.post('/registro', async (req, res, next) => {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        apellidos: body.apellidos,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10)
    });

    await Usuario.findOne({email: body.email}).then(async (usuariodb) => {
        if (usuariodb) {
            return res.status(400).json({
                ok: false,
                msg: 'El email ya está en uso.'
            });
        } else {
            await usuario.save().then(usuariodb => {
                return res.status(201).json({
                    ok: true,
                    usuario: {
                        nombre: usuariodb.nombre,
                        apellidos: usuariodb.apellidos,
                        email: usuariodb.email
                    }
                });
            }).catch(error => {
                return res.status(400).json({
                    ok: false,
                    msg: 'Error en el registro.',
                    errors: error
                });
            })
        }
    }).catch(error => {
        return res.status(500).json({
            ok: false,
            msg: 'Error interno.',
            error: error
        });
    });

    
});

app.post('/login', async (req, res, next) => {
    let body = req.body;

    await Usuario.findOne({email: body.email}).then(async (usuariodb) => {
        if (!usuariodb) {
            return res.status(400).json({
                ok: false,
                msg: 'Credenciales incorrectas.'
            });
        }
        if (!bcrypt.compareSync(body.password, usuariodb.password)) {
            return res.status(400).json({
                ok: false,
                msg: 'Credenciales incorrectas.'
            });
        }

        let token = jwt.sign({ usuario: usuariodb }, process.env.SEED, { expiresIn: 14400 });

        res.status(200).json({
            ok: true,
            usuario: {
                nombre: usuariodb.nombre,
                apellidos: usuariodb.apellidos,
                email: usuariodb.email
            },
            token: token,
            id: usuariodb.id
        });
    }).catch(error => {
        return res.status(500).json({
            ok: false,
            msg: 'Error interno.',
            error: error
        });
    })
});

module.exports = app;