// cuestionario.js - VERSIÓN CORREGIDA
import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";
import spdy from "spdy";
import https from "https";  // Importar directamente
import fs from "fs";
import os from "os";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import https from "https";
import http from "http";
import { readFileSync } from "fs";

// Configurar __dirname para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: join(__dirname, ".env") });

<<<<<<< HEAD
console.log(' Iniciando servidor...');
=======
// ===================== CONFIGURACIÓN =====================
const PORT = process.env.PORT || 3000;
const USAR_HTTPS = process.env.USAR_HTTPS === 'true' || true;
const USAR_HTTP2 = process.env.USAR_HTTP2 === 'true' || true;

// ===================== CONFIGURACIÓN DE LICENCIAS =====================
const LICENCIAS_VALIDAS = new Set([
  "LICENCIA_1_ACTIVA_2024_XYZ123", 
  "LICENCIA_2_PREMIUM_2024_ABC789"
]);

console.log('🚀 Iniciando servidor HTTP/2 con SPDY y licencias...');
>>>>>>> origin/dev-Sarahi-Cuestionario

const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

<<<<<<< HEAD
// Conectar a MongoDB Atlas
connectDB();

// Cargar rutas con importación dinámica
console.log(' Intentando cargar rutas...');

let rangoEdadRoutes;
let categoriasRoutes;
let nivelDificultadRoutes;
let subcategoriaRoutes;
let authRoutes;

// Cargar rutas de rangoEdad
try {
  const rangoEdadModule = await import("./src/examen/rangoEdad/rangoEdad.routes.js");
  rangoEdadRoutes = rangoEdadModule.default;
  console.log('✅ RangoEdad routes cargado correctamente');
} catch (error) {
  console.log(' ERROR cargando RangoEdad routes:', error.message);
  const { Router } = await import("express");
  const router = Router();
  router.get("/", (req, res) => {
    res.json({ message: "Ruta temporal de rangos-edad - FALLBACK" });
  });
  rangoEdadRoutes = router;
  console.log(' Rutas temporales creadas para rangoEdad');
}

// Cargar rutas de categorias (usa la carpeta que realmente tienes)
try {
  const categoriasModule = await import("./src/examen/categorias/categorias.routes.js");
  categoriasRoutes = categoriasModule.default;
  console.log('✅ Categorias routes cargado correctamente');
} catch (error) {
  console.log(' ERROR cargando Categorias routes (primer intento):', error.message);
  try {
    const categoriesModule = await import("./src/examen/categories/categories.routes.js");
    categoriasRoutes = categoriesModule.default;
    console.log('✅ Categories routes cargado correctamente');
  } catch (error2) {
    console.log(' ERROR cargando Categories routes (segundo intento):', error2.message);
    const { Router } = await import("express");
    const router = Router();
    router.get("/", (req, res) => {
      res.json({ message: "Ruta temporal de categorias - FALLBACK" });
    });
    categoriasRoutes = router;
    console.log(' Rutas temporales creadas para categorias');
  }
}

// Cargar rutas de nivelDificultad
try {
  const nivelDificultadModule = await import("./src/examen/nivelDificultad/nivelDificultad.routes.js");
  nivelDificultadRoutes = nivelDificultadModule.default;
  console.log(' NivelDificultad routes cargado correctamente');
} catch (error) {
  console.log(' ERROR cargando NivelDificultad routes:', error.message);
  const { Router } = await import("express");
  const router = Router();
  router.get("/", (req, res) => {
    res.json({ message: "Ruta temporal de nivel-dificultad - FALLBACK" });
  });
  nivelDificultadRoutes = router;
  console.log(' Rutas temporales creadas para nivelDificultad');
}

// Cargar rutas de subcategoria
try {
  const subcategoriaModule = await import("./src/examen/subcategoria/subcategoria.routes.js");
  subcategoriaRoutes = subcategoriaModule.default;
  console.log(' Subcategoria routes cargado correctamente');
} catch (error) {
  console.log(' ERROR cargando Subcategoria routes:', error.message);
  const { Router } = await import("express");
  const router = Router();
  router.get("/", (req, res) => {
    res.json({ message: "Ruta temporal de subcategoria - FALLBACK" });
  });
  subcategoriaRoutes = router;
  console.log(' Rutas temporales creadas para subcategoria');
}

// Cargar rutas de auth (nueva carpeta)
try {
  const authModule = await import("./src/auth/auth.routes.js");
  authRoutes = authModule.default;
  console.log('✅ Auth routes cargado correctamente');
} catch (error) {
  console.log(' ERROR cargando Auth routes:', error.message);
  const { Router } = await import("express");
  const router = Router();
  router.post("/register", (req, res) => res.status(500).json({ message: "Auth no disponible - FALLBACK" }));
  router.post("/login", (req, res) => res.status(500).json({ message: "Auth no disponible - FALLBACK" }));
  authRoutes = router;
  console.log(' Rutas temporales creadas para auth');
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
      subcategoria: "/api/subcategoria",
      auth: "/auth"
    }
  });
});

// Montar rutas
app.use("/api/rangos-edad", rangoEdadRoutes);
app.use("/api/categorias", categoriasRoutes);
app.use("/api/nivel-dificultad", nivelDificultadRoutes);
app.use("/api/subcategoria", subcategoriaRoutes);

// Montar auth en /auth (fuera de /api para pruebas sencillas en Postman)
app.use("/auth", authRoutes);

// Ruta de debug
app.get("/api/debug", (req, res) => {
=======
// Middleware de validación de licencia
const validarLicencia = (req, res, next) => {
  // Excepciones para rutas públicas
  if (req.path === '/test-licencia' || req.path === '/health') {
    return next();
  }
  
  const licencia = req.headers['x-licencia'] || req.query.licencia;
  
  if (!licencia) {
    return res.status(403).json({
      success: false,
      error: "Licencia requerida",
      message: "Debe proporcionar una licencia válida",
      ayuda: "Agregue header: x-licencia: LICENCIA_1_ACTIVA_2024_XYZ123"
    });
  }
  
  if (!LICENCIAS_VALIDAS.has(licencia)) {
    return res.status(403).json({
      success: false,
      error: "Licencia inválida",
      message: "La licencia proporcionada no es válida",
      licencias_validas: Array.from(LICENCIAS_VALIDAS)
    });
  }
  
  req.licenciaValida = licencia;
  next();
};

// Aplicar middleware de licencia
app.use(validarLicencia);

// ===================== CONEXIÓN A MONGODB =====================
async function conectarMongoDB() {
  try {
    const connectDB = await import("./dataBase.js").then(module => module.default);
    connectDB();
    console.log('✅ Conectando a MongoDB...');
  } catch (error) {
    console.log('⚠️  Sin MongoDB, continuando solo servidor HTTP/2');
  }
}

// ===================== IMPORTAR RUTAS =====================
async function cargarRutas() {
  console.log('🔄 Cargando rutas...');
  
  // Cargar rutas dinámicamente
  let rangoEdadRoutes, categoriasRoutes, nivelDificultadRoutes, subcategoriaRoutes;

  try {
    const rangoEdadModule = await import("./src/examen/rangoEdad/rangoEdad.routes.js");
    rangoEdadRoutes = rangoEdadModule.default;
    console.log('✅ RangoEdad routes cargado');
  } catch (error) {
    console.log('❌ RangoEdad routes no encontrado');
    rangoEdadRoutes = express.Router();
    rangoEdadRoutes.get("/", (req, res) => res.json({ message: "RangoEdad routes - FALLBACK" }));
  }

  try {
    const categoriasModule = await import("./src/examen/categorias/categorias.routes.js");
    categoriasRoutes = categoriasModule.default;
    console.log('✅ Categorias routes cargado');
  } catch (error) {
    console.log('❌ Categorias routes no encontrado');
    categoriasRoutes = express.Router();
    categoriasRoutes.get("/", (req, res) => res.json({ message: "Categorias routes - FALLBACK" }));
  }

  try {
    const nivelDificultadModule = await import("./src/examen/nivelDificultad/nivelDificultad.routes.js");
    nivelDificultadRoutes = nivelDificultadModule.default;
    console.log('✅ NivelDificultad routes cargado');
  } catch (error) {
    console.log('❌ NivelDificultad routes no encontrado');
    nivelDificultadRoutes = express.Router();
    nivelDificultadRoutes.get("/", (req, res) => res.json({ message: "NivelDificultad routes - FALLBACK" }));
  }

  try {
    const subcategoriaModule = await import("./src/examen/subcategoria/subcategoria.routes.js");
    subcategoriaRoutes = subcategoriaModule.default;
    console.log('✅ Subcategoria routes cargado');
  } catch (error) {
    console.log('❌ Subcategoria routes no encontrado');
    subcategoriaRoutes = express.Router();
    subcategoriaRoutes.get("/", (req, res) => res.json({ message: "Subcategoria routes - FALLBACK" }));
  }

  // Registrar rutas
  app.use("/api/rangos-edad", rangoEdadRoutes);
  app.use("/api/categorias", categoriasRoutes);
  app.use("/api/nivel-dificultad", nivelDificultadRoutes);
  app.use("/api/subcategoria", subcategoriaRoutes);
}

// ===================== RUTAS DEL SERVIDOR =====================

// Ruta pública para test de licencia
app.get("/test-licencia", (req, res) => {
  const isHTTP2 = req.httpVersionMajor === 2;
  
>>>>>>> origin/dev-Sarahi-Cuestionario
  res.json({
    success: true,
    message: "✅ Servidor HTTP/2 con SPDY funcionando",
    protocol: isHTTP2 ? 'HTTP/2' : `HTTP/${req.httpVersion || '1.1'}`,
    spdy: true,
    spdyVersion: req.spdyVersion || null,
    licencias_validas: Array.from(LICENCIAS_VALIDAS),
    endpoints: {
      publico: "/test-licencia",
      protegidos: [
        "/",
        "/api/rangos-edad",
        "/api/categorias", 
        "/api/nivel-dificultad",
        "/api/subcategoria"
      ]
    },
    ayuda: "Para rutas protegidas, agregue header: x-licencia: LICENCIA_1_ACTIVA_2024_XYZ123"
  });
});

// Ruta raíz
app.get("/", (req, res) => {
  const isHTTP2 = req.httpVersionMajor === 2;
  const protocol = isHTTP2 ? 'HTTP/2' : (req.socket.encrypted ? 'HTTPS' : 'HTTP/1.1');
  
  res.json({
    success: true,
    message: "🎯 API Cuestionario Pro - HTTP/2 + SPDY",
    version: "2.0.0",
    protocol: protocol,
    httpVersion: isHTTP2 ? '2.0' : (req.httpVersion || '1.1'),
    httpVersionMajor: req.httpVersionMajor,
    encrypted: !!(req.socket.encrypted),
    http2: isHTTP2,
    spdyVersion: req.spdyVersion || null,
    license: req.licenciaValida,
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    endpoints: {
      rangos_edad: "/api/rangos-edad",
      categorias: "/api/categorias",
      nivel_dificultad: "/api/nivel-dificultad",
      subcategoria: "/api/subcategoria",
      test_licencia: "/test-licencia (pública)",
      health: "/health (pública)"
    }
  });
});

// Ruta de salud del servidor
app.get("/health", (req, res) => {
  const isHTTP2 = req.httpVersionMajor === 2;
  
  res.json({ 
    success: true,
    status: 'OK', 
    timestamp: new Date().toISOString(),
    protocol: isHTTP2 ? 'HTTP/2' : `HTTP/${req.httpVersion || '1.1'}`,
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// Ruta 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    path: req.path,
    rutas_disponibles: [
      "GET /test-licencia (pública)",
      "GET / (requiere licencia)",
      "GET /health (pública)",
      "GET /api/rangos-edad (requiere licencia)",
      "GET /api/categorias (requiere licencia)",
      "GET /api/nivel-dificultad (requiere licencia)",
      "GET /api/subcategoria (requiere licencia)"
    ]
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('❌ Error en petición:', err.message);
  
  if (!res.headersSent) {
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
      license: req.licenciaValida || "No proporcionada"
    });
  }
});

<<<<<<< HEAD
// Puerto
const PORT = process.env.PORT || 3000;
const HTTPS_PORT = process.env.HTTPS_PORT || 3443;

// Opciones HTTPS
const httpsOptions = {
  key: readFileSync(join(__dirname, 'key.pem')),
  cert: readFileSync(join(__dirname, 'cert.pem'))
};

// Servidor HTTPS
https.createServer(httpsOptions, app).listen(HTTPS_PORT, () => {
  console.log(` Servidor HTTPS escuchando en puerto ${HTTPS_PORT}`);
  console.log(` URL SEGURA: https://localhost:${HTTPS_PORT}`);
  console.log(` Endpoints disponibles:`);
  console.log(`   - https://localhost:${HTTPS_PORT}/`);
  console.log(`   - https://localhost:${HTTPS_PORT}/api/debug`);
  console.log(`   - https://localhost:${HTTPS_PORT}/api/rangos-edad`);
  console.log(`   - https://localhost:${HTTPS_PORT}/api/categorias`);
  console.log(`   - https://localhost:${HTTPS_PORT}/api/nivel-dificultad`);
  console.log(`   - https://localhost:${HTTPS_PORT}/api/subcategoria`);
  console.log(`   - https://localhost:${HTTPS_PORT}/auth (register/login)`);
});

// Redireccionar HTTP a HTTPS
http.createServer((req, res) => {
  res.writeHead(301, { Location: `https://localhost:${HTTPS_PORT}${req.url}` });
  res.end();
}).listen(PORT, () => {
  console.log(`↪  HTTP (puerto ${PORT}) redirige a HTTPS`);
=======
// ===================== CONFIGURACIÓN HTTP/2 + SPDY =====================
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1';
}

function iniciarServidor() {
  if (!USAR_HTTPS) {
    // Servidor HTTP simple
    app.listen(PORT, '0.0.0.0', () => {
      console.log('\n' + '='.repeat(60));
      console.log('    🚀 SERVIDOR HTTP INICIADO');
      console.log('='.repeat(60));
      console.log(`   Puerto: ${PORT} (FIJO)`);
      console.log(`   URL: http://localhost:${PORT}`);
      console.log(`   Protocolo: HTTP/1.1`);
      console.log('='.repeat(60));
    });
    return null;
  }

  // Cargar certificados SSL
  let opciones;
  
  try {
    if (!fs.existsSync("key.pem") || !fs.existsSync("cert.pem")) {
      throw new Error('Archivos de certificados no encontrados');
    }

    opciones = {
      key: fs.readFileSync("key.pem"),
      cert: fs.readFileSync("cert.pem"),
      minVersion: 'TLSv1.2'
    };
    
    console.log('✅ Certificados SSL cargados correctamente');
  } catch (error) {
    console.error('\n❌ Error al cargar certificados SSL');
    console.error(`   Detalles: ${error.message}`);
    console.log('\n💡 Solución:');
    console.log('   1. Verifique que existan los archivos:');
    console.log(`      - ${join(__dirname, "key.pem")}`);
    console.log(`      - ${join(__dirname, "cert.pem")}`);
    console.log('\n   2. O genere nuevos certificados:');
    console.log('      openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes');
    process.exit(1);
  }

  // Servidor HTTPS con HTTP/2 usando SPDY
  if (USAR_HTTP2) {
    try {
      const spdyOptions = {
        ...opciones,
        spdy: {
          protocols: ['h2', 'spdy/3.1', 'http/1.1'],
          plain: false,
          'x-forwarded-for': true
        }
      };

      const server = spdy.createServer(spdyOptions, app);
      
      server.on('error', (err) => {
        console.error('❌ Error en servidor:', err.message);
        if (err.code === 'EADDRINUSE') {
          console.error(`   El puerto ${PORT} ya está en uso`);
          console.error('   PowerShell: netstat -ano | findstr :3000');
          console.error('   PowerShell: taskkill /PID [ID] /F');
          process.exit(1);
        }
      });
      
      // Iniciar servidor
      server.listen(PORT, '0.0.0.0', () => {
        const localIP = getLocalIP();
        
        console.log('\n' + '='.repeat(70));
        console.log('    🚀 SERVIDOR HTTPS + HTTP/2 INICIADO');
        console.log('='.repeat(70));
        console.log(`   Puerto: ${PORT} (FIJO)`);
        console.log(`   URLs:`);
        console.log(`     👉 Local: https://localhost:${PORT}`);
        console.log(`     👉 Red:   https://${localIP}:${PORT}`);
        console.log(`   Protocolo: HTTP/2 (SPDY)`);
        console.log(`   Fallback: HTTP/1.1`);
        console.log(`   Cifrado: ✅ TLS 1.2+`);
        console.log(`   Licencias: ${LICENCIAS_VALIDAS.size} activas`);
        console.log(`   Node.js: ${process.version}`);
        console.log('='.repeat(70));
        console.log('\n⚠️  Certificados auto-firmados');
        console.log('   El navegador mostrará advertencia de seguridad');
        console.log('   Esto es normal en desarrollo');
        console.log('\n💡 Para verificar HTTP/2:');
        console.log('   1. Chrome: F12 → Network → ver "Protocol: h2"');
        console.log('   2. curl: curl -k -v --http2 https://localhost:3000/');
        console.log('   3. Rutas:');
        console.log(`      🔓 Públicas: https://localhost:${PORT}/test-licencia`);
        console.log(`      🔐 Protegidas: Requieren licencia válida`);
        console.log('\n📝 Usando SPDY para HTTP/2 + Express');
        console.log('='.repeat(70));
      });
      
      return server;
      
    } catch (error) {
      console.error('\n❌ Error al crear servidor HTTP/2:', error.message);
      console.error('   Stack:', error.stack);
      process.exit(1);
    }
  } 
  // Servidor HTTPS con HTTP/1.1 (fallback)
  else {
    try {
      const server = https.createServer(opciones, app);
      
      server.on('error', (err) => {
        console.error('❌ Error en servidor HTTPS:', err.message);
        process.exit(1);
      });
      
      server.listen(PORT, '0.0.0.0', () => {
        console.log('\n' + '='.repeat(60));
        console.log('    🚀 SERVIDOR HTTPS INICIADO');
        console.log('='.repeat(60));
        console.log(`   Puerto: ${PORT} (FIJO)`);
        console.log(`   URL: https://localhost:${PORT}`);
        console.log(`   Protocolo: HTTPS (HTTP/1.1)`);
        console.log(`   Cifrado: ✅ Activo`);
        console.log(`   Licencias: ${LICENCIAS_VALIDAS.size} activas`);
        console.log('='.repeat(60));
      });
      
      return server;
      
    } catch (error) {
      console.error('\n❌ Error al crear servidor HTTPS:', error.message);
      console.error('   Stack:', error.stack);
      process.exit(1);
    }
  }
}

// ===================== INICIALIZACIÓN =====================
async function iniciar() {
  try {
    // Conectar MongoDB
    await conectarMongoDB();
    
    // Cargar rutas
    await cargarRutas();
    
    // Iniciar servidor
    const server = iniciarServidor();
    
    // Stats periódicas
    if (server && USAR_HTTP2) {
      setInterval(() => {
        if (server._spdyState && server._spdyState.connections) {
          const connections = Object.keys(server._spdyState.connections).length;
          if (connections > 0) {
            console.log(`📊 Conexiones HTTP/2 activas: ${connections}`);
          }
        }
      }, 30000);
    }
    
  } catch (error) {
    console.error('\n❌ Error fatal al iniciar servidor:', error.message);
    console.error('   Stack:', error.stack);
    process.exit(1);
  }
}

// Manejo de errores del proceso
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err.message);
>>>>>>> origin/dev-Sarahi-Cuestionario
});

process.on('uncaughtException', (err) => {
  if (err.message.includes('EADDRINUSE') || err.message.includes('EACCES')) {
    console.error('\n❌ Error crítico:', err.message);
    console.error(`   El puerto ${PORT} no está disponible`);
    process.exit(1);
  }
  console.error('❌ Uncaught Exception:', err.message);
});

process.on('SIGINT', () => {
  console.log('\n👋 Apagando servidor HTTP/2...');
  process.exit(0);
});

// Iniciar aplicación
iniciar();