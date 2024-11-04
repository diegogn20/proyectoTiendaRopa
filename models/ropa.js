const mongoose = require('mongoose');

const ropaSchema = new mongoose.Schema({
    nombre: {type: String, required: true, trim: true},
    categoria: {type: String, enum: ['dama','caballero','unisex'], required: true},
    marca: {type: String, required: true},
    precio: {type: Number, required: true},
    talle: {type: String, required: true},
    stock: {type: Number, default: 10},
    imagenURL: [{ type: String }] // Array de URLs de imágenes 
},{collection: 'ropa'}); 

module.exports = mongoose.model('Ropa',ropaSchema); 

