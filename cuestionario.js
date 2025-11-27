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
let nivelDificultadRoutes;
let subcategoriaRoutes;

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
  rangoEdadRoutes = router;
  console.log('🆘 Rutas temporales creadas para rangoEdad');
}

// Cargar rutas de categorias (usa la carpeta que realmente tienes)
try {
  // PRIMERO intenta con "categorias" (si esa es la carpeta correcta)
  const categoriasModule = await import("./src/examen/categorias/categorias.routes.js");
  categoriasRoutes = categoriasModule.default;
  console.log('✅ Categorias routes cargado correctamente');
} catch (error) {
  console.log('❌ ERROR cargando Categorias routes (primer intento):', error.message);
  try {
    // SEGUNDO intento con "categories" (por si la carpeta se llama diferente)
    const categoriesModule = await import("./src/examen/categories/categories.routes.js");
    categoriasRoutes = categoriesModule.default;
    console.log('✅ Categories routes cargado correctamente');
  } catch (error2) {
    console.log('❌ ERROR cargando Categories routes (segundo intento):', error2.message);
    const { Router } = await import("express");
    const router = Router();
    router.get("/", (req, res) => {
      res.json({ message: "Ruta temporal de categorias - FALLBACK" });
    });
    categoriasRoutes = router;
    console.log('🆘 Rutas temporales creadas para categorias');
  }
}

// Cargar rutas de nivelDificultad
try {
  const nivelDificultadModule = await import("./src/examen/nivelDificultad/nivelDificultad.routes.js");
  nivelDificultadRoutes = nivelDificultadModule.default;
  console.log('✅ NivelDificultad routes cargado correctamente');
} catch (error) {
  console.log('❌ ERROR cargando NivelDificultad routes:', error.message);
  const { Router } = await import("express");
  const router = Router();
  router.get("/", (req, res) => {
    res.json({ message: "Ruta temporal de nivel-dificultad - FALLBACK" });
  });
  nivelDificultadRoutes = router;
  console.log('🆘 Rutas temporales creadas para nivelDificultad');
}

// Cargar rutas de subcategoria
try {
  const subcategoriaModule = await import("./src/examen/subcategoria/subcategoria.routes.js");
  subcategoriaRoutes = subcategoriaModule.default;
  console.log('✅ Subcategoria routes cargado correctamente');
} catch (error) {
  console.log('❌ ERROR cargando Subcategoria routes:', error.message);
  const { Router } = await import("express");
  const router = Router();
  router.get("/", (req, res) => {
    res.json({ message: "Ruta temporal de subcategoria - FALLBACK" });
  });
  subcategoriaRoutes = router;
  console.log('🆘 Rutas temporales creadas para subcategoria');
}

// Rutas
app.get("/", (req, res) => {
  res.json({ 
    message: "Servidor funcionando con MongoDB Atlas 🔥",
    status: "OK",
    database: mongoose.connection.readyState === 1 ? "Conectada" : "Desconectada",
    endpoints: {
      rangosEdad: "/api/rangos-edad",
      categorias: "/api/categorias",
      nivelDificultad: "/api/nivel-dificultad",
      subcategoria: "/api/subcategoria"
    }
  });
});

app.use("/api/rangos-edad", rangoEdadRoutes);
app.use("/api/categorias", categoriasRoutes);
app.use("/api/nivel-dificultad", nivelDificultadRoutes);
app.use("/api/subcategoria", subcategoriaRoutes);

// Ruta de debug
app.get("/api/debug", (req, res) => {
  res.json({
    message: "Debug route working",
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    endpoints: {
      rangosEdad: "/api/rangos-edad",
      categorias: "/api/categorias", 
      nivelDificultad: "/api/nivel-dificultad",
      subcategoria: "/api/subcategoria"
    }
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
      "POST /api/categorias",
      "GET /api/nivel-dificultad", 
      "POST /api/nivel-dificultad",
      "GET /api/subcategoria",
      "POST /api/subcategoria"
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
  console.log(`   - http://localhost:${PORT}/api/nivel-dificultad`);
  console.log(`   - http://localhost:${PORT}/api/subcategoria`);
});