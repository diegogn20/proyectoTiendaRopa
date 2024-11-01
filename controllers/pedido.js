const Pedido = require('../models/pedido');
const Usuario = require('../models/usuario');
const Ropa = require('../models/ropa');

// Crear un nuevo pedido
const crearPedido = async (req, res) => {
    try {
        const { productoId, direccion } = req.body;
        const clienteId = req.usuario.id;

        // Verificar que el producto exista y esté en stock
        const producto = await Ropa.findById(productoId);
        if (!producto || producto.stock <= 0) {
            return res.status(404).json({ mensaje: 'Producto no disponible o fuera de stock' });
        }

        // Crear un nuevo pedido
        const nuevoPedido = new Pedido({
            producto: productoId,
            cliente: clienteId,
            direccion,
            estado: 'en proceso',
        });

        await nuevoPedido.save();

        // Reducir el stock del producto
        producto.stock -= 1;
        await producto.save();

        res.status(201).json(nuevoPedido);
    } catch (error) {
        console.error('Error al crear el pedido:', error);
        res.status(500).json({ mensaje: 'Error al crear el pedido', error: error.message });
    }
};

// Obtener todos los pedidos (solo para administradores)
const obtenerPedidos = async (req, res) => {
    try {
        if (req.usuario.rol !== 'administrador') {
            return res.status(403).json({ mensaje: 'Acceso denegado' });
        }

        const pedidos = await Pedido.find().populate('producto cliente repartidor');
        res.json(pedidos);
    } catch (error) {
        console.error('Error al obtener pedidos:', error);
        res.status(500).json({ mensaje: 'Error al obtener pedidos', error: error.message });
    }
};

// Obtener los pedidos de un cliente autenticado
const obtenerPedidosCliente = async (req, res) => {
    try {
        const clienteId = req.usuario.id;
        const pedidos = await Pedido.find({ cliente: clienteId }).populate('producto repartidor');
        res.json(pedidos);
    } catch (error) {
        console.error('Error al obtener los pedidos del cliente:', error);
        res.status(500).json({ mensaje: 'Error al obtener los pedidos', error: error.message });
    }
};

// Asignar un repartidor a un pedido (solo para administradores)
const asignarRepartidor = async (req, res) => {
    try {
        if (req.usuario.rol !== 'administrador') {
            return res.status(403).json({ mensaje: 'Acceso denegado' });
        }

        const { pedidoId, repartidorId } = req.body;

        const repartidor = await Usuario.findById(repartidorId);
        if (!repartidor || repartidor.rol !== 'repartidor') {
            return res.status(404).json({ mensaje: 'Repartidor no encontrado' });
        }

        const pedido = await Pedido.findByIdAndUpdate(pedidoId, { repartidor: repartidorId }, { new: true });
        if (!pedido) {
            return res.status(404).json({ mensaje: 'Pedido no encontrado' });
        }

        res.json(pedido);
    } catch (error) {
        console.error('Error al asignar repartidor:', error);
        res.status(500).json({ mensaje: 'Error al asignar repartidor', error: error.message });
    }
};

// Cambiar el estado de un pedido
const cambiarEstadoPedido = async (req, res) => {
    try {
        const { pedidoId, estado } = req.body;
        const pedido = await Pedido.findByIdAndUpdate(pedidoId, { estado, fechaEnvio: estado === 'enviado' ? new Date() : null }, { new: true });
        
        if (!pedido) {
            return res.status(404).json({ mensaje: 'Pedido no encontrado' });
        }

        res.json(pedido);
    } catch (error) {
        console.error('Error al cambiar estado del pedido:', error);
        res.status(500).json({ mensaje: 'Error al cambiar estado del pedido', error: error.message });
    }
};

module.exports = {
    crearPedido,
    obtenerPedidos,
    obtenerPedidosCliente,
    asignarRepartidor,
    cambiarEstadoPedido
};

/*
crearPedido: Crea un nuevo pedido para un cliente autenticado y reduce el stock del producto.
obtenerPedidos: Obtiene todos los pedidos de la base de datos (solo accesible para administradores).
obtenerPedidosCliente: Obtiene todos los pedidos asociados a un cliente autenticado.
asignarRepartidor: Permite a un administrador asignar un repartidor a un pedido específico.
cambiarEstadoPedido: Permite actualizar el estado de un pedido, y registra la fecha de envío si se establece como 'enviado'.
*/