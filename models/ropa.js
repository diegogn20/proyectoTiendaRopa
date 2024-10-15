const mongoose = require('mongoose');

const ropaSchema = mongoose.Schema({
  id:{type: Number, required: true}, 
  nombre: { type: String, required: true },
  categoria: { type: String, enum: ['dama', 'caballero', 'unisex'], required: true },
  color: { type: String, required: true },
  precio: { type: Number, required: true },
  talle: { type: String, required: true },
  stock: { type: Number, default: 0 }
});

const Ropa = mongoose.model('Ropa', ropaSchema);

module.exports = Ropa; 

