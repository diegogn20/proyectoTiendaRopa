const Ropa = require('../models/ropa');

const getTodos = async (req, res) => {
  try {
      const prendas = await Ropa.find(); 
      res.json(prendas);
  } catch (error) {
      console.error("Error al obtener las prendas:", error); 
      res.status(500).json({ mensaje: 'Error al obtener las prendas', error: error.message });
  }
}; 

const getById = async (req, res) => {
    const {id} = req.params;
    const prenda = await Ropa.findById(id);

    if(prenda){
        res.json(prenda);
    }else{
        res.status(404).json({mensaje:'Prenda no encontrada'});
    }
};

const getByNombre = async (req, res) => {
    const { nombre } = req.params;
    const prenda = await Ropa.findOne({ nombre: new RegExp(nombre, 'i') }); //búsqueda insensible a mayúsculas

    if (prenda) {
        res.json(prenda);
    } else {
        res.status(404).json({ mensaje: 'Prenda no encontrada' });
    }
};

const getByNombreYTalle = async (req, res) => {
  const { nombre, talle } = req.params;
  try {
      const prenda = await Ropa.findOne({ nombre: new RegExp(nombre, 'i'), talle: talle });
      if (prenda) {
          res.json(prenda);
      } else {
          res.status(404).json({ mensaje: 'Prenda no encontrada' });
      }
  } catch (error) {
      console.error("Error al obtener la prenda:", error);
      res.status(500).json({ mensaje: 'Error al obtener la prenda', error: error.message });
  }
};

const getImagenByNombre = async (req, res) => {
    const { nombre } = req.params;
    const prenda = await Ropa.findOne({ nombre: new RegExp(nombre, 'i') });

    if (prenda && prenda.imagenURL) {
        const rutaImagen = path.join(__dirname, '..', 'uploads', prenda.imagenURL);
        res.sendFile(rutaImagen);
    } else {
        res.status(404).json({ mensaje: 'Imagen no encontrada' });
    }
};

const add = async (req, res) => {
    const nuevaPrenda = new Ropa(req.body);
    await nuevaPrenda.save(); 
    res.status(201).json(nuevaPrenda);
};

const updateById = async (req, res) => {
    const { id } = req.params;
    const prendaActualizada = await Ropa.findByIdAndUpdate(id, req.body, { new: true });
  
    if (prendaActualizada) {
      res.json(prendaActualizada);
    } else {
      res.status(404).json({ mensaje: 'Prenda no encontrada' });
    }
  };

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
    getByNombre,
    getByNombreYTalle,
    add,
    updateById,
    deleteById,
    getImagenByNombre,
}; 
