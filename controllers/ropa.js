const Ropa = require('../models/ropa');

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


