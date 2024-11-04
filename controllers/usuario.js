const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registrarUsuario = async (req, res) => {
    const { nombre, password, rol } = req.body;
    try {
        const salt = await bcrypt.genSalt(10); 
        const hashedPassword = await bcrypt.hash(password, salt);//encriptar passw

        const nuevoUsuario = new Usuario({
            nombre,
            password: hashedPassword,
            rol, 
        });

        await nuevoUsuario.save();

        res.status(201).json({ mensaje: 'Usuario registrado con éxito' });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ mensaje: 'Error al registrar el usuario', error: error.message });
    }
};

const loginUsuario = async (req, res) => {
    const { nombre, password } = req.body;//body obtiene del json
    try {
        const usuario = await Usuario.findOne({ nombre });
        if (!usuario) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }

        //verificar passw
        const esPasswordValido = await bcrypt.compare(password, usuario.password);
        if (!esPasswordValido) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }

        //genera el token JWT con el rol incluido
        const token = jwt.sign({ id: usuario._id, rol: usuario.rol }, 
            process.env.JWT_SECRET, 
            {expiresIn: '1h',} //expira en 1hora
        );
        res.json({ mensaje: 'Inicio de sesión exitoso', token });
    } catch (error) {
        console.error("Error en loginUsuario:", error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

module.exports = { registrarUsuario, loginUsuario };

