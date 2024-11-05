const express = require('express');
const router = express.Router();
const { buscarRopaAproximada,obtenerRopa,obtenerRopaPorId,crearRopa,eliminarRopa,modificarRopa } = require('../controllers/ropa');
const upload = require('../middleware/upload');
const { verificarToken, autorizarRol } = require('../middleware/auth');

router.post('/alta',verificarToken,autorizarRol('administrador'), upload.array('imagenURL'), crearRopa);
router.delete('/baja/:id', verificarToken, autorizarRol('administrador'), eliminarRopa);
router.put('/modificar/:id', verificarToken, autorizarRol('administrador'), upload.array('imagenURL'), modificarRopa);
router.get('/', obtenerRopa);//get all http://localhost:3000/api/ropa/
router.get('/porId', obtenerRopaPorId);//http://localhost:3000/api/ropa/porId
router.get('/buscar', buscarRopaAproximada);//http://localhost:3000/api/ropa/buscar?nombre=camisaejemplo

module.exports = router; 

/* http://localhost:3000/api/ropa/
{alta/modif -> body form-data: 
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