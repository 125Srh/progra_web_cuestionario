import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./dataBase.js";
import preguntaRoutes from "./src/examen/pregunta/pregunta.routes.js";
import nivelDificultadRoutes from "./src/examen/nivelDificultad/nivelDificultad.routes.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Configurar __dirname para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno desde el archivo .env en la misma carpeta
dotenv.config({ path: join(__dirname, ".env") });

// Verificar que las variables de entorno se cargaron
console.log('📋 Variables de entorno cargadas');
console.log('MONGODB_URI existe:', !!process.env.MONGODB_URI);
console.log('PORT:', process.env.PORT || 3000);

const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conectar a MongoDB Atlas
connectDB();

// Rutas principales
app.get("/", (req, res) => {
  res.json({ 
    message: "Servidor funcionando con MongoDB Atlas 🔥",
    status: "OK",
    database: mongoose.connection.readyState === 1 ? "Conectada" : "Desconectada",
    endpoints: {
      preguntas: "/api/preguntas",
      nivelesDificultad: "/api/niveles-dificultad",
      health: "/api/health"
    }
  });
});

// Rutas de la API
app.use("/api/preguntas", preguntaRoutes);
app.use("/api/niveles-dificultad", nivelDificultadRoutes);

// Ruta de prueba para verificar conexión a DB
app.get("/api/health", (req, res) => {
  res.json({
    server: "Running",
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    timestamp: new Date().toISOString()
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ 
    error: "Ruta no encontrada",
    path: req.path,
    availableRoutes: [
      "GET /",
      "GET /api/health",
      "GET /api/preguntas",
      "POST /api/preguntas",
      "GET /api/niveles-dificultad",
      "POST /api/niveles-dificultad",
      "POST /api/niveles-dificultad/multiples"
    ]
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: "Error interno del servidor",
    message: err.message 
  });
});

// Puerto
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`📚 Base de datos: cuestionarioDB`);
});