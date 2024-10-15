const express = require('express');
const router = express.Router();
const { getTodos, getById, add, updateById, deleteById } = require('../controllers/ropa');

router.get('/', getTodos);
router.get('/:id', getById);
router.post('/', add);
router.put('/:id', updateById);
router.delete('/:id', deleteById);

module.exports = router;
