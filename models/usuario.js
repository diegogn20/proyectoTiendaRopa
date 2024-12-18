const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    rol: { type: String, enum: ['cliente', 'repartidor', 'administrador'], required: true }
}, { collection: 'usuario' });

module.exports = mongoose.model('Usuario', usuarioSchema);


/*
Diagrama de Entidades
Usuarios -> Pedidos: Los usuarios tendrán pedidos, y cada pedido tendrá referencias a cliente y repartidor.
Pedidos -> Ropa: Cada pedido está asociado a un tipo de ropa.
*/