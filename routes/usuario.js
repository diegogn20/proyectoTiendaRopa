const express = require('express');
const router = express.Router();
const { registrarUsuario,eliminarUsuario,modificarUsuario,loginUsuario } = require('../controllers/usuario');

router.post('/registrar', registrarUsuario);//http://localhost:3000/api/usuario/registrar
router.delete('/baja/:id',eliminarUsuario);
router.put('/modificar/:id',modificarUsuario);
router.post('/login', loginUsuario);//http://localhost:3000/api/usuario/login  -> credenciales usr/pwd en body 

module.exports = router;

/*registrar usr
{
    "nombre": "ton",
    "password": "ton",
    "rol": "cliente"
}*/

/*login 
{
    "nombre": "ton",
    "password": "ton"
}*/

