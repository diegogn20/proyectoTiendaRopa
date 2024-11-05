const Pago = require('../models/pago');
const Pedido = require('../models/pedido');

const crearPago = async (req, res) => {
    try {
        const { pedidoId, monto, metodo, estado } = req.body;
        const clienteId = req.usuario.id;

        const pedido = await Pedido.findById(pedidoId).populate('cliente');
        if (!pedido) {
            return res.status(404).json({ mensaje: 'Pedido no encontrado' });
        }

        // Verificar que el cliente del pedido coincida con el cliente autenticado
        if (pedido.cliente.toString() !== clienteId) {
            return res.status(403).json({ mensaje: 'No tienes permisos para realizar el pago de este pedido' });
        }

        const nuevoPago = new Pago({
            pedido: pedidoId,
            cliente: clienteId,
            monto,
            metodo,
            estado // Estado inicial del pago
        });

        // Guardar el pago en la base de datos
        await nuevoPago.save();

        res.status(201).json(nuevoPago);
    } catch (error) {
        console.error('Error al crear el pago:', error);
        res.status(500).json({ mensaje: 'Error al crear el pago', error: error.message });
    }
};

const modificarPago = async (req, res) => {
    try {
        const { pagoId } = req.params;
        const { estado, monto, metodo } = req.body; 

        // Validación de los campos a actualizar
        const actualizaciones = {};
        if (estado) {
            const estadosPermitidos = ['pendiente', 'completado', 'fallido', 'reembolsado'];
            if (!estadosPermitidos.includes(estado)) {
                return res.status(400).json({ mensaje: 'Estado no válido' });
            }
            actualizaciones.estado = estado;
        }
        if (monto !== undefined) {
            if (typeof monto !== 'number' || monto <= 0) {
                return res.status(400).json({ mensaje: 'Monto no válido' });
            }
            actualizaciones.monto = monto;
        }
        if (metodo) {
            const metodosPermitidos = ['tarjeta', 'paypal', 'transferencia', 'efectivo'];
            if (!metodosPermitidos.includes(metodo)) {
                return res.status(400).json({ mensaje: 'Método de pago no válido' });
            }
            actualizaciones.metodo = metodo;
        }

        // Buscar y actualizar el pago
        const pagoActualizado = await Pago.findByIdAndUpdate(
            pagoId,
            { $set: actualizaciones },
            { new: true } // Para devolver el documento actualizado
        );

        // Si el pago no existe
        if (!pagoActualizado) {
            return res.status(404).json({ mensaje: 'Pago no encontrado' });
        }

        res.json(pagoActualizado);
    } catch (error) {
        console.error('Error al modificar el pago:', error);
        res.status(500).json({ mensaje: 'Error al modificar el pago', error: error.message });
    }
};


module.exports = { crearPago, modificarPago};
