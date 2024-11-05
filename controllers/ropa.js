const Ropa = require('../models/ropa');
const fs = require('fs');
const path = require('path');

exports.crearRopa = async (req, res) => {
    const { nombre, categoria, marca, precio, talle, stock } = req.body;
    const imagenURL = req.files.map(file => `/uploads/${file.filename}`);//imagenes

    const nuevaRopa = new Ropa({
        nombre,
        categoria,
        marca,
        precio,
        talle,
        stock,
        imagenURL //que coincida con el esquema
    });

    try {
        await nuevaRopa.save();
        res.status(201).json(nuevaRopa);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear ropa', error });
    }
};

exports.eliminarRopa = async (req, res) => {
    const { id } = req.params; 

    try {
        const ropaEliminada = await Ropa.findById(id);

        if (!ropaEliminada) {
            return res.status(404).json({ message: 'Prenda no encontrada' });
        }

        // Crear una lista de promesas para eliminar cada imagen
        const promesasEliminarImagenes = ropaEliminada.imagenURL.map(async (imagenPath) => {
            try {
                const rutaImagen = path.join(__dirname, '..', imagenPath);
                await fs.unlink(rutaImagen); // Eliminar la imagen de manera asíncrona
            } catch (error) {
                console.error(`Error al eliminar la imagen ${imagenPath}:`, error);
            }
        });

        // Esperar a que todas las imágenes se eliminen
        await Promise.all(promesasEliminarImagenes);

        await Ropa.findByIdAndDelete(id);
        res.status(200).json({ message: 'Prenda e imágenes eliminadas con éxito', ropaEliminada });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la prenda', error });
    }
};

exports.modificarRopa = async (req, res) => {
    const { id } = req.params; 
    const { nombre, categoria, marca, precio, talle, stock } = req.body;

    try {
        const ropa = await Ropa.findById(id);
        if (!ropa) {
            return res.status(404).json({ message: 'Prenda no encontrada' });
        }

        // Actualizar imágenes si se proporcionan nuevas
        if (req.files && req.files.length > 0) {
            // Crear una lista de promesas para eliminar las imágenes anteriores
            const promesasEliminarImagenes = ropa.imagenURL.map(async (imagenPath) => {
                try {
                    const rutaImagen = path.join(__dirname, '..', imagenPath);
                    await fs.unlink(rutaImagen); // Eliminar la imagen de manera asíncrona
                } catch (error) {
                    console.error(`Error al eliminar la imagen ${imagenPath}:`, error);
                }
            });

            // Esperar a que todas las imágenes anteriores se eliminen
            await Promise.all(promesasEliminarImagenes);

            // Agregar las nuevas imágenes al campo `imagenURL`
            ropa.imagenURL = req.files.map(file => `/uploads/${file.filename}`);
        }

        //campo no proporcionado mantiene su valor
        ropa.nombre = nombre || ropa.nombre;
        ropa.categoria = categoria || ropa.categoria;
        ropa.marca = marca || ropa.marca;
        ropa.precio = precio || ropa.precio;
        ropa.talle = talle || ropa.talle;
        ropa.stock = stock || ropa.stock;

        // Guardar los cambios en la base de datos
        const ropaActualizada = await ropa.save();
        res.status(200).json({ message: 'Prenda actualizada con éxito', ropaActualizada });
    } catch (error) {
        console.error('Error al actualizar la prenda:', error);
        res.status(500).json({ message: 'Error al actualizar la prenda', error });
    }
};

exports.obtenerRopa = async (req, res) => {
    try {
        const ropa = await Ropa.find({});
        res.status(200).json(ropa);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener ropa', error });
    }
};

exports.obtenerRopaPorId = async (req, res) => {
    const { ropaId } = req.body;

    try {
        const ropa = await Ropa.findById(ropaId);

        if (!ropa) {
            return res.status(404).json({ message: 'Ropa no encontrada' });
        }

        res.status(200).json(ropa);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener ropa', error });
    }
};

exports.buscarRopaAproximada = async (req, res) => {
    try {
        const { nombre } = req.query; //query se obtiene de los parámetros

        if (!nombre) {
            return res.status(400).json({ error: 'Debe proporcionar un nombre para la búsqueda' });
        }

        //regex busqueda aprox
        const ropaEncontrada = await Ropa.find({
            nombre: { $regex: nombre, $options: 'i' } // 'i' insensible a mayus
        });

        res.json(ropaEncontrada);
    } catch (error) {
        console.error('Error al buscar ropa:', error);
        res.status(500).json({ error: 'Error al buscar ropa' });
    }
};


