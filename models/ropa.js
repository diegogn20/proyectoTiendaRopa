const mongoose = require('mongoose');

const ropaSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  categoria: { type: String, enum: ['dama', 'caballero', 'unisex'], required: true },
  color: { type: String, required: true,type: String,required: true, match: /^#([0-9A-F]{3}){1,2}$/i },
  precio: { type: Number, required: true },
  talle: { type: String, required: true },
  stock: { type: Number, default: 0 }
}, {collection: 'ropa'}); 

const Ropa = mongoose.model('Ropa', ropaSchema);

module.exports = Ropa; 

