const express = require('express');
const router = express.Router();
const { verificarToken, autorizarRol } = require('../middleware/auth');
const {crearPedido,obtenerPedidos,obtenerPedidosCliente,asignarRepartidor,cambiarEstadoPedido} = require('../controllers/pedido');

//solo (cliente) puede crear pedido
router.post('/crear', verificarToken, autorizarRol('cliente'), crearPedido);
//(administrador)
router.put('/asignarRepartidor', verificarToken, autorizarRol('administrador'), asignarRepartidor);
//(administrador y repartidor)
router.put('/CambiarEstado', verificarToken, autorizarRol('administrador', 'repartidor'), cambiarEstadoPedido);
//get all pedidos (administrador y repartidor): //http://localhost:3000/api/pedido/
router.get('/', verificarToken, autorizarRol('administrador', 'repartidor'), obtenerPedidos);
//get cliente autenticado: http://localhost:3000/api/pedido/cliente
router.get('/cliente', verificarToken, autorizarRol('cliente'), obtenerPedidosCliente);

module.exports = router;

/*crearPedido: http://localhost:3000/api/pedido/crear
{
	"productoId": "6724d6740cc1ec3d72b62e01",
    "direccion": "calle falsa 1400"
}*/

/*asignarRepartidor: http://localhost:3000/api/pedido/asignarRepartidor
{
    "pedidoId": "6726ea3526b85818dbe0450f",
    "repartidorId": "672688649e1f81e30f18f116"
}*/

/*cambiarEstado: http://localhost:3000/api/pedido/CambiarEstado
{
    "pedidoId": "6726ea3526b85818dbe0450f",
	"estado": "enviado"
}*/



