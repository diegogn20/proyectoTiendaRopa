const express = require('express');
const router = express.Router();
const { registrarUsuario, loginUsuario } = require('../controllers/usuario');

router.post('/registrar', registrarUsuario);//http://localhost:3000/api/usuario/registrar
router.post('/login', loginUsuario);//http://localhost:3000/api/usuario/login  -> credenciales usr/pwd en body 

module.exports = router;

/*
{
    "nombre": "ton",
    "password": "ton"
}
*/

/*
{
    "nombre": "ton",
    "password": "ton",
    "rol": "cliente"
}
*/