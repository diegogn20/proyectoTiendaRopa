const Pedido = require('../models/pedido');
const Usuario = require('../models/usuario');
const Ropa = require('../models/ropa');
const mongoose = require('mongoose');
 
const crearPedido = async (req, res) => {
    try {
        const { productoId, direccion } = req.body;
        const clienteId = req.usuario.id;

        // Verificar que el producto exista y esté en stock
        const producto = await Ropa.findById(productoId);
        if (!producto || producto.stock <= 0) {
            return res.status(404).json({ mensaje: 'Producto no disponible o fuera de stock' });
        }

        const nuevoPedido = new Pedido({
            producto: productoId,
            cliente: clienteId,
            direccion,
            estado: 'en proceso',
        });

        await nuevoPedido.save();
        producto.stock -= 1;
        await producto.save();

        res.status(201).json(nuevoPedido);
    } catch (error) {
        console.error('Error al crear el pedido:', error);
        res.status(500).json({ mensaje: 'Error al crear el pedido', error: error.message });
    }
};

const eliminarPedido = async (req, res) => {
    try {
        const { id } = req.params; 

        const pedidoEliminado = await Pedido.findById(id);

        if (!pedidoEliminado) {
            return res.status(404).json({ mensaje: 'Pedido no encontrado' });
        }

        const producto = await Ropa.findById(pedidoEliminado.producto);

        if (producto) {
            producto.stock += 1; 
            await producto.save(); 
        }

        await Pedido.findByIdAndDelete(id);

        res.status(200).json({ mensaje: 'Pedido eliminado con éxito', pedidoEliminado });
    } catch (error) {
        console.error('Error al eliminar el pedido:', error);
        res.status(500).json({ mensaje: 'Error al eliminar el pedido', error: error.message });
    }
};

const modificarPedido = async (req, res) => {
    try {
        const { id } = req.params; 
        const { productoId, direccion, estado } = req.body;

        const pedido = await Pedido.findById(id);
        if (!pedido) {
            return res.status(404).json({ mensaje: 'Pedido no encontrado' });
        }

        // Si se proporciona un nuevo producto, actualizar el stock
        if (productoId && productoId !== pedido.producto.toString()) {
            const productoAntiguo = await Ropa.findById(pedido.producto);
            if (productoAntiguo) {
                productoAntiguo.stock += 1; 
                await productoAntiguo.save();
            }

            const nuevoProducto = await Ropa.findById(productoId);
            if (!nuevoProducto || nuevoProducto.stock <= 0) {
                return res.status(404).json({ mensaje: 'Nuevo producto no disponible o fuera de stock' });
            }
            nuevoProducto.stock -= 1;
            await nuevoProducto.save();
            pedido.producto = productoId;
        }

        // Actualizar la dirección si se proporciona
        if (direccion) {
            pedido.direccion = direccion;
        }

        if (estado) {
            pedido.estado = estado;
        }

        const pedidoActualizado = await pedido.save();
        res.status(200).json({ mensaje: 'Pedido actualizado con éxito', pedidoActualizado });
    } catch (error) {
        console.error('Error al modificar el pedido:', error);
        res.status(500).json({ mensaje: 'Error al modificar el pedido', error: error.message });
    }
};

const obtenerPedidos = async (req, res) => {
    try {
        const pedidos = await Pedido.find().populate('producto cliente repartidor');
        res.json(pedidos);
    } catch (error) {
        console.error('Error al obtener pedidos:', error);
        res.status(500).json({ mensaje: 'Error al obtener pedidos', error: error.message });
    }
};

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

const asignarRepartidor = async (req, res) => {
    try {
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

module.exports = {
    crearPedido,
    eliminarPedido,
    modificarPedido,
    obtenerPedidos,
    obtenerPedidosCliente,
    asignarRepartidor
};

/*
crearPedido: Crea un nuevo pedido para un cliente autenticado y reduce el stock del producto.
obtenerPedidos: Obtiene todos los pedidos de la base de datos.
obtenerPedidosCliente: Obtiene todos los pedidos asociados a un cliente autenticado.
asignarRepartidor: Permite a un administrador asignar un repartidor a un pedido específico.
cambiarEstadoPedido: Permite actualizar el estado de un pedido, y registra la fecha de envío si se establece como 'enviado'.
*/