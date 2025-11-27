import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./dataBase.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Configurar __dirname para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: join(__dirname, ".env") });

console.log('🔍 Iniciando servidor...');

const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conectar a MongoDB Atlas
connectDB();

// Cargar rutas con importación dinámica
console.log('🔄 Intentando cargar rutas...');

let rangoEdadRoutes;
let categoriasRoutes;

// Cargar rutas de rangoEdad
try {
  const rangoEdadModule = await import("./src/examen/rangoEdad/rangoEdad.routes.js");
  rangoEdadRoutes = rangoEdadModule.default;
  console.log('✅ RangoEdad routes cargado correctamente');
} catch (error) {
  console.log('❌ ERROR cargando RangoEdad routes:', error.message);
  const { Router } = await import("express");
  const router = Router();
  router.get("/", (req, res) => {
    res.json({ message: "Ruta temporal de rangos-edad - FALLBACK" });
  });
  router.post("/", (req, res) => {
    res.json({ 
      message: "Crear rango temporal - FALLBACK",
      body: req.body 
    });
  });
  rangoEdadRoutes = router;
  console.log('🆘 Rutas temporales creadas para rangoEdad');
}

// Cargar rutas de categorias
try {
  const categoriasModule = await import("./src/examen/categorias/categorias.routes.js");
  categoriasRoutes = categoriasModule.default;
  console.log('✅ Categorias routes cargado correctamente');
} catch (error) {
  console.log('❌ ERROR cargando Categorias routes:', error.message);
  const { Router } = await import("express");
  const router = Router();
  router.get("/", (req, res) => {
    res.json({ message: "Ruta temporal de categorias - FALLBACK" });
  });
  router.post("/", (req, res) => {
    res.json({ 
      message: "Crear categoría temporal - FALLBACK",
      body: req.body 
    });
  });
  categoriasRoutes = router;
  console.log('🆘 Rutas temporales creadas para categorias');
}

// Rutas
app.get("/", (req, res) => {
  res.json({ 
    message: "Servidor funcionando con MongoDB Atlas 🔥",
    status: "OK",
    database: mongoose.connection.readyState === 1 ? "Conectada" : "Desconectada",
    endpoints: {
      rangosEdad: "/api/rangos-edad",
      categorias: "/api/categorias"
    }
  });
});

app.use("/api/rangos-edad", rangoEdadRoutes);
app.use("/api/categorias", categoriasRoutes);

// Ruta de debug
app.get("/api/debug", (req, res) => {
  res.json({
    message: "Debug route working",
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected"
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ 
    error: "Ruta no encontrada",
    path: req.path,
    availableRoutes: [
      "GET /",
      "GET /api/debug", 
      "GET /api/rangos-edad",
      "POST /api/rangos-edad",
      "GET /api/categorias",
      "POST /api/categorias"
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
  console.log(`📊 Endpoints disponibles:`);
  console.log(`   - http://localhost:${PORT}/`);
  console.log(`   - http://localhost:${PORT}/api/debug`);
  console.log(`   - http://localhost:${PORT}/api/rangos-edad`);
  console.log(`   - http://localhost:${PORT}/api/categorias`);
});