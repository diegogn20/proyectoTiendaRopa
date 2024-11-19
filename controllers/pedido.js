const Pedido = require('../models/pedido');
const Usuario = require('../models/usuario');
const Ropa = require('../models/ropa');
const mongoose = require('mongoose');
 
const crearPedido = async (req, res) => {
    try {
        const { productosIds, direccion } = req.body;
        const clienteId = req.usuario.id;
        console.log(productosIds);
        // Verificar que el producto exista y esté en stock
        const productos = await Promise.all(productosIds.map((prodID) => Ropa.findById(prodID)));
        if (!productos || productos.some((a) => a.stock <= 0)) {
            return res.status(404).json({ mensaje: 'Productos no disponibles o fuera de stock' });
        }

        const nuevoPedido = new Pedido({
            productos: productosIds,
            cliente: clienteId,
            direccion,
            estado: 'en proceso',
        });

        await nuevoPedido.save();
        await Promise.all(productos.map(async (a) => {a.stock -= 1;
            return a.save();})
        );
        

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
            const productosAntiguos = await Promise.all(pedido.producto.map((prodID) => Ropa.findById(prodID)));
            if (productosAntiguos) {
                for(const producto of productosAntiguos) {
                    producto.stocks += 1;   
                    await producto.save();                 
                };
            }

            const nuevosProductos = await Promise.all(productoId.map((prodID) => Ropa.findById(prodID)));
            if (!nuevosProductos || nuevosProductos.some((producto) => producto.stock <= 0)) {
                return res.status(404).json({ mensaje: 'Nuevo producto no disponible o fuera de stock' });
            }
            for(const producto of nuevosProductos) {
                producto.stocks -= 1;   
                await producto.save();  
            }
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
        const pedidos = await Pedido.find({$and: [{cliente: clienteId},{producto: {$ne: null}}] }).populate('producto repartidor');
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