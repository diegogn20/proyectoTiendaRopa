const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(403).json({ mensaje: 'Acceso denegado, token no proporcionado' });

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = payload;
        next();
    } catch (error) {
        res.status(401).json({ mensaje: 'Token inválido' });
    }
};

module.exports = { verificarToken };

