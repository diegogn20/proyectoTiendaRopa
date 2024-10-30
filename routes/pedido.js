const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middleware/auth');
const {
    crearPedido,
    obtenerPedidos,
    obtenerPedidosCliente,
    asignarRepartidor,
    cambiarEstadoPedido
} = require('../controllers/pedido');

router.post('/', verificarToken, crearPedido);
router.get('/', verificarToken, obtenerPedidos);
router.get('/cliente', verificarToken, obtenerPedidosCliente);
router.put('/asignar-repartidor', verificarToken, asignarRepartidor);
router.put('/cambiar-estado', verificarToken, cambiarEstadoPedido);

module.exports = router;

