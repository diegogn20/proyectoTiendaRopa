const express = require('express');
const router = express.Router();
const {getTodos, getById, add, getByNombre, getByNombreYTalle, getImagenByNombre, updateById, deleteById} = require('../controllers/ropa');

router.get('/', getTodos); 
router.post('/', add);
router.put('/:id', updateById);
router.delete('/:id', deleteById);
router.get('/:id', getById);
router.get('/nombre/:nombre',getByNombre);//http://localhost:3000/api/ropa/nombre/Remera%20River
router.get('/nombre/:nombre/talle/:talle',getByNombreYTalle);//http://localhost:3000/api/ropa/nombre/Remera%20River/talle/M
router.get('/nombre/:nombre/imagen',getImagenByNombre); //http://localhost:3000/uploads/remeraRiver.jpg

module.exports = router; 