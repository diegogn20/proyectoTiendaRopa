const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
    producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Ropa', required: true },
    cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    repartidor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
    fechaCompra: { type: Date, default: Date.now },
    estado: { type: String, enum: ['enviado', 'en proceso'], default: 'en proceso' },
    fechaEnvio: { type: Date },
    direccion: { type: String, required: true }
}, { collection: 'pedido' });

module.exports = mongoose.model('Pedido', pedidoSchema);
  