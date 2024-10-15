const Ropa = require('../models/ropa');

// Obtener todas las prendas
const getTodos = async (req, res) => {
  const prendas = await Ropa.find();
  res.json(prendas);
};

// Obtener prenda por ID
const getById = async (req, res) => {
  const { id } = req.params;
  const prenda = await Ropa.findById(id);
  
  if (prenda) {
    res.json(prenda);
  } else {
    res.status(404).json({ mensaje: 'Prenda no encontrada' });
  }
};

// Agregar nueva prenda
const add = async (req, res) => {
  const nuevaPrenda = new Ropa(req.body);
  await nuevaPrenda.save();
  res.status(201).json(nuevaPrenda);
};

// Actualizar prenda por ID
const updateById = async (req, res) => {
  const { id } = req.params;
  const prendaActualizada = await Ropa.findByIdAndUpdate(id, req.body, { new: true });

  if (prendaActualizada) {
    res.json(prendaActualizada);
  } else {
    res.status(404).json({ mensaje: 'Prenda no encontrada' });
  }
};

// Eliminar prenda por ID
const deleteById = async (req, res) => {
  const { id } = req.params;
  const prendaEliminada = await Ropa.findByIdAndDelete(id);

  if (prendaEliminada) {
    res.json({ mensaje: 'Prenda eliminada correctamente' });
  } else {
    res.status(404).json({ mensaje: 'Prenda no encontrada' });
  }
};

module.exports = {
  getTodos,
  getById,
  add,
  updateById,
  deleteById
};
