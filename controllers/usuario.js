const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registrarUsuario = async (req, res) => {
    const { nombre, password, rol } = req.body;
    try {
        // Encriptar la contraseña
        const salt = await bcrypt.genSalt(10); // Genera un "salt" para añadir complejidad
        const hashedPassword = await bcrypt.hash(password, salt);

        // Crear un nuevo usuario con la contraseña encriptada
        const nuevoUsuario = new Usuario({
            nombre,
            password: hashedPassword,
            rol, 
        });

        // Guardar el usuario en la base de datos
        await nuevoUsuario.save();

        res.status(201).json({ mensaje: 'Usuario registrado con éxito' });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ mensaje: 'Error al registrar el usuario', error: error.message });
    }
};

const loginUsuario = async (req, res) => {
    const { nombre, password } = req.body;
    try {
        // Buscar el usuario en la base de datos
        const usuario = await Usuario.findOne({ nombre });
        if (!usuario) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }

        // Verificar la contraseña
        const esPasswordValido = await bcrypt.compare(password, usuario.password);
        if (!esPasswordValido) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }

        // Genera un token JWT con el rol incluido
        const token = jwt.sign({ id: usuario._id, rol: usuario.rol }, 
            process.env.JWT_SECRET, 
            {expiresIn: '1h',} //expira en 1hora
        );
        // Envía el token y el rol del usuario en la respuesta
        res.json({ mensaje: 'Inicio de sesión exitoso', token });
    } catch (error) {
        console.error("Error en loginUsuario:", error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

module.exports = { registrarUsuario, loginUsuario };

