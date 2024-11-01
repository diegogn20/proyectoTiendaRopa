const express = require('express');
const router = express.Router();
const { verificarToken, autorizarRol } = require('../middleware/auth');
const {
    crearPedido,
    obtenerPedidos,
    obtenerPedidosCliente,
    asignarRepartidor,
    cambiarEstadoPedido
} = require('../controllers/pedido');

// Solo los clientes pueden crear pedidos
router.post('/', verificarToken, autorizarRol('cliente'), crearPedido);
router.get('/', verificarToken, obtenerPedidos);
router.get('/cliente', verificarToken, obtenerPedidosCliente);
router.put('/asignar-repartidor', verificarToken, asignarRepartidor);
// Solo el administrador y repartidor pueden actualizar el estado de los pedidos
router.put('/:id-pedido', verificarToken, autorizarRol('administrador', 'repartidor'), cambiarEstadoPedido);

module.exports = router;

