const express = require('express');
const ropaRoutes = require('./routes/ropa');
const mongoose = require('mongoose');

class Server {

    constructor() {
        this.port = process.env.PORT || 3000;
        this.app = express();

        this.conectarBaseDeDatos();

        //cargar middlewares
        this.cargarMiddlewares();

        //definir rutas
        this.cargarRutas();
    }

    conectarBaseDeDatos() {
        // Conectar a MongoDB
        mongoose.connect(process.env.MONGODB_URI)
        .then(() => {})
        .catch((error) => {
            console.log(error) 
        })
    }

    cargarMiddlewares() {
        this.app.use(express.json()); // Habilitar parsing de JSON
    }

    cargarRutas() {
        this.app.use('/api/ropa', ropaRoutes); // Rutas de la API de ropa
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor corriendo en http://localhost:${this.port}`);
        });
    }
}

module.exports = Server;
