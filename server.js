const express = require("express"); 
const ropaRoutes = require('./routes/ropa');
const usuarioRoutes = require('./routes/usuario');
const pedidoRoutes = require('./routes/pedido');
const pagoRoutes = require('./routes/pago');
const mongoose = require("mongoose");
const path = require("path"); 

class Server {
    constructor() {
        this.port = process.env.PORT || 3000;
        this.app = express();
        this.conectarBD();
        this.cargarMiddleWares();
        this.cargarRutas();
    }   

    async conectarBD() {
        try {
            await mongoose.connect(process.env.MONGODB_URI); 
            console.log('Conectado a BD en la nube!');
        } catch (e) {
            console.error('Error al conectar BD en la nube:', e);
        }
    } 
    

    cargarMiddleWares() {
        this.app.use(express.json()); // Habilitar parsing de JSON
        // Servir la carpeta de imágenes 'uploads' de forma estática
        this.app.use('/uploads', express.static('uploads'));
    }

    cargarRutas() {
        this.app.use("/api/ropa", ropaRoutes); //Rutas de la API de ropa
        this.app.use("/api/usuario", usuarioRoutes);
        this.app.use("/api/pedido", pedidoRoutes); 
        this.app.use("/api/pago", pagoRoutes);
    }

    listen() {
        this.app.listen(this.port, () => {
          console.log(`Servidor corriendo en http://localhost:${this.port}`);
        });
    }
}

module.exports = Server;