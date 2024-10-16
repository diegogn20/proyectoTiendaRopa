const express = require("express");
const ropaRoutes = require("./routes/ropa");
const mongoose = require("mongoose");

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

  async conectarBaseDeDatos() {
    try {
      // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
      await mongoose.connect(process.env.MONGODB_URI);
      console.log("Conectado a BD en la nube!");
    } catch (e) {
      console.log("Error al conectar BD en la nube!");
      console.log(e);
    }
  }

  cargarMiddlewares() {
    this.app.use(express.json()); // Habilitar parsing de JSON
  }

  cargarRutas() {//http://localhost:3000/api/ropa
    this.app.use("/api/ropa", ropaRoutes); //Rutas de la API de ropa
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Servidor corriendo en http://localhost:${this.port}`);
    });
  }
}

module.exports = Server;
