const express = require('express');
const router = express.Router();
const { verificarToken, autorizarRol } = require('../middleware/auth');
const {crearPedido,eliminarPedido,modificarPedido,obtenerPedidos,obtenerPedidosCliente,asignarRepartidor} = require('../controllers/pedido');

//alta solo para (cliente) 
router.post('/alta', verificarToken, autorizarRol('cliente'), crearPedido);
router.delete('/baja/:id', verificarToken, autorizarRol('cliente'), eliminarPedido);
router.put('/modificar/:id', verificarToken, autorizarRol('administrador'),modificarPedido);
router.put('/asignarRepartidor', verificarToken, autorizarRol('administrador'), asignarRepartidor);
//get all pedidos (administrador y repartidor): //http://localhost:3000/api/pedido/
router.get('/', verificarToken, autorizarRol('administrador', 'repartidor'), obtenerPedidos);
//get cliente autenticado: http://localhost:3000/api/pedido/cliente
router.get('/cliente', verificarToken, autorizarRol('cliente'), obtenerPedidosCliente);

module.exports = router;

/*alta: http://localhost:3000/api/pedido/alta
{
	"productoId": "6724d6740cc1ec3d72b62e01",
    "direccion": "calle falsa 1400"
}*/

/*asignarRepartidor: http://localhost:3000/api/pedido/asignarRepartidor
{
    "pedidoId": "6726ea3526b85818dbe0450f",
    "repartidorId": "672688649e1f81e30f18f116"
}*/




