const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ mensaje: 'Acceso denegado. Token no proporcionado.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded;
        next();
    } catch (error) {
        res.status(400).json({ mensaje: 'Token inválido' });
    }
};


// Middleware de autorización para verificar roles específicos
const autorizarRol = (...rolesPermitidos) => {
    return (req, res, next) => {
        if (!rolesPermitidos.includes(req.usuario.rol)) {
            return res.status(403).json({ mensaje: 'No tienes permisos para acceder a esta ruta' });
        }
        next();
    };
};

module.exports = { verificarToken, autorizarRol };



