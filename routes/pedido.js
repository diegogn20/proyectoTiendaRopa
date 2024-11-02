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
router.post('/', verificarToken, autorizarRol('cliente'), crearPedido);//http://localhost:3000/api/pedido/

// Obtener todos los pedidos (administrador y repartidor)
router.get('/', verificarToken, autorizarRol('administrador', 'repartidor'), obtenerPedidos);//http://localhost:3000/api/pedido/

// Obtener pedidos específicos del cliente autenticado
router.get('/cliente', verificarToken, autorizarRol('cliente'), obtenerPedidosCliente);//http://localhost:3000/api/pedido/cliente

// Asignar repartidor a un pedido (administrador)
router.put('/asignar-repartidor', verificarToken, autorizarRol('administrador'), asignarRepartidor);//http://localhost:3000/api/pedido/asignar-repartidor

// Cambiar el estado de un pedido específico (administrador y repartidor)
router.put('/:id-pedido', verificarToken, autorizarRol('administrador', 'repartidor'), cambiarEstadoPedido);//http://localhost:3000/api/pedido/:id-pedido

module.exports = router;

/*crear pedido
{
    "productoId": "ID_DEL_PRODUCTO",
    "direccion": "Dirección de entrega"
}*/

/*asignar repartidor
{
    "pedidoId": "ID_DEL_PEDIDO",
    "repartidorId": "ID_DEL_REPARTIDOR"
}*/

/*cambiar estado pedido
 {
    "estado": "enviado" // o "en proceso"
}*/


