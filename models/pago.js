const mongoose = require('mongoose');

const pagoSchema = new mongoose.Schema({
    pedido: {type: mongoose.Schema.Types.ObjectId,ref: 'Pedido',required: true},
    cliente: {type: mongoose.Schema.Types.ObjectId,ref: 'Usuario',required: true},
    monto: {type: Number,required: true},
    metodo: {
        type: String,
        enum: ['tarjeta', 'paypal', 'transferencia', 'efectivo'], 
        required: true
    },
    estado: {
        type: String,
        enum: ['pendiente', 'completado', 'fallido', 'reembolsado'], 
        default: 'pendiente'
    },
    fecha: {type: Date,default: Date.now}//(Date.now), mongoDB automáticamente almacenará la fecha
}, { collection: 'pago' });

module.exports = mongoose.model('Pago', pagoSchema);
