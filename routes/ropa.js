const express = require('express');
const router = express.Router();
const { buscarRopaAproximada,obtenerRopa,obtenerRopaPorId,crearRopa } = require('../controllers/ropa');
const upload = require('../middleware/upload');
const { verificarToken, autorizarRol } = require('../middleware/auth');

router.post('/crear',verificarToken,autorizarRol('administrador'), upload.array('imagenURL'), crearRopa);
router.get('/', obtenerRopa);//get all http://localhost:3000/api/ropa/
router.get('/porId', obtenerRopaPorId);//http://localhost:3000/api/ropa/porId
router.get('/buscar', buscarRopaAproximada);//http://localhost:3000/api/ropa/buscar?nombre=camiseta

module.exports = router; 

/*
{/crear body form-data: //http://localhost:3000/api/ropa/
    "nombre": "Camisa Casual",
    "categoria": "caballero",
    "marca": "MarcaEjemplo",
    "precio": 29.99,
    "talle": "L",
    "stock": 15,
    "imagenURL": [
        "camisa_casual_1.jpg",
        "camisa_casual_2.jpg"
    ]
}*/ 