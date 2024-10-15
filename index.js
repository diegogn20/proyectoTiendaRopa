require('dotenv').config();
const Server = require('./server');

// Crear instancia del servidor
const server = new Server();

// Iniciar el servidor
server.listen();

