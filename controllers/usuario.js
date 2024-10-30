const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registrarUsuario = async (req, res) => {
    try {
        const { nombre, password, clasificacion } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const nuevoUsuario = new Usuario({ nombre, password: hashedPassword, clasificacion });
        await nuevoUsuario.save();
        res.status(201).json(nuevoUsuario);
    } catch (error) {
        console.error("Error al registrar usuario:", error);
        res.status(500).json({ mensaje: 'Error al registrar usuario', error: error.message });
    }
};

const loginUsuario = async (req, res) => {
    try {
        const { nombre, password } = req.body;
        const usuario = await Usuario.findOne({ nombre });

        if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }

        const token = jwt.sign({ id: usuario._id, clasificacion: usuario.clasificacion }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        res.status(500).json({ mensaje: 'Error al iniciar sesión', error: error.message });
    }
};

module.exports = { registrarUsuario, loginUsuario };

