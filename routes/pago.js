const express = require('express');
const router = express.Router();
const { verificarToken, autorizarRol } = require('../middleware/auth');
const {crearPago, modificarPago} = require('../controllers/pago');

router.post('/alta',verificarToken, autorizarRol('cliente'),crearPago);
router.put('/modificar/:pagoId',verificarToken, autorizarRol('administrador'),modificarPago);

module.exports = router;
