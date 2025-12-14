import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";
import spdy from "spdy";
import https from "https";
import fs from "fs";
import os from "os";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// ============================================================
// CONFIGURACIÓN INICIAL
// ============================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, ".env") });

const PORT = process.env.PORT || 3000;
const USAR_HTTPS = process.env.USAR_HTTPS === 'true' || true;
const USAR_HTTP2 = process.env.USAR_HTTP2 === 'true' || true;

console.log('🚀 Iniciando servidor HTTP/2 con SPDY...');

const app = express();

// ============================================================
// MIDDLEWARES BÁSICOS
// ============================================================

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================================
// SISTEMA DE LICENCIAS
// ============================================================

const LICENCIAS_VALIDAS = new Set([
  "LICENCIA_1_ACTIVA_2024_XYZ123", 
  "LICENCIA_2_PREMIUM_2024_ABC789"
]);

const validarLicencia = (req, res, next) => {
  const licencia = req.headers['x-licencia'] || req.query.licencia;
  
  if (!licencia) {
    return res.status(403).json({
      success: false,
      error: "Autenticación requerida",
      message: "Debe proporcionar licencia válida",
      ayuda: "Agregue header: x-licencia: LICENCIA_1_ACTIVA_2024_XYZ123"
    });
  }
  
  if (!LICENCIAS_VALIDAS.has(licencia)) {
    return res.status(403).json({
      success: false,
      error: "Licencia inválida",
      message: "La licencia proporcionada no es válida"
    });
  }
  
  req.licenciaValida = licencia;
  req.authMethod = "licencia";
  next();
};

// ============================================================
// MIDDLEWARE DE AUTENTICACIÓN
// ============================================================

const autenticar = async (req, res, next) => {
  // Rutas públicas que NO requieren autenticación
  const rutasPublicas = [
    '/',
    '/test-licencia',
    '/health',
    '/api/info',
    '/api/auth/register',
    '/api/auth/login',
    '/api/licencia/check'
  ];
  
  // Verificar si la ruta es pública
  const esRutaPublica = rutasPublicas.some(ruta => req.path === ruta);
  
  if (esRutaPublica) {
    console.log(`✅ Ruta pública: ${req.method} ${req.path}`);
    return next();
  }
  
  console.log(`🔒 Ruta protegida: ${req.method} ${req.path}`);
  
  // Intentar autenticación por JWT
  const header = req.headers.authorization || req.headers.Authorization;
  
  if (header && (header.startsWith("Bearer ") || header.startsWith("JWT "))) {
    try {
      const authModule = await import("./src/auth/auth.middleware.js");
      
      return new Promise((resolve) => {
        authModule.authenticate(req, res, (err) => {
          if (err) {
            console.log('❌ JWT inválido, probando con licencia...');
            validarLicencia(req, res, next);
          } else {
            console.log('✅ Autenticado con JWT');
            req.authMethod = "jwt";
            next();
          }
          resolve();
        });
      });
    } catch (error) {
      console.log('⚠️  Middleware JWT no disponible, usando licencia...');
      return validarLicencia(req, res, next);
    }
  } else {
    // Sin JWT, usar licencia
    console.log('🔑 Autenticando con licencia...');
    return validarLicencia(req, res, next);
  }
};

// ============================================================
// CONEXIÓN A MONGODB
// ============================================================

async function conectarMongoDB() {
  try {
    const connectDB = await import("./dataBase.js").then(module => module.default);
    await connectDB();
    console.log('✅ MongoDB conectado correctamente');
  } catch (error) {
    console.log('⚠️  Error MongoDB:', error.message);
  }
}

// ============================================================
// RUTAS PÚBLICAS
// ============================================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🏫 API Cuestionario Educativo",
    version: "1.0.0"
  });
});

app.get("/test-licencia", (req, res) => {
  res.json({
    success: true,
    message: "✅ Servidor funcionando",
    version: "1.0.0",
    fecha: new Date().toISOString(),
    modulos: ["categorias", "rangoEdad", "nivelDificultad", "subcategoria"],
    autenticacion: "JWT + Licencias"
  });
});

app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "OK",
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? "conectada" : "desconectada"
  });
});

app.get("/api/info", (req, res) => {
  res.json({
    success: true,
    sistema: "API Cuestionario Educativo",
    rutas_publicas: [
      "GET /",
      "GET /test-licencia",
      "GET /health",
      "GET /api/info",
      "POST /api/auth/register",
      "POST /api/auth/login"
    ],
    rutas_protegidas: [
      "GET /api/categorias",
      "GET /api/rangos-edad",
      "GET /api/nivel-dificultad",
      "GET /api/subcategoria"
    ]
  });
});

app.get("/api/licencia/check", (req, res) => {
  const licencia = req.headers['x-licencia'] || req.query.licencia;
  
  if (!licencia) {
    return res.json({
      success: false,
      message: "No se proporcionó licencia"
    });
  }
  
  res.json({
    success: true,
    licencia: licencia,
    valida: LICENCIAS_VALIDAS.has(licencia)
  });
});

// ============================================================
// CARGAR RUTAS DINÁMICAS
// ============================================================

async function cargarRutas() {
  console.log('📦 Cargando rutas...');
  
  // 1. CARGAR RUTAS DE AUTENTICACIÓN
  try {
    console.log('🔄 Cargando rutas de autenticación...');
    const authRoutes = await import("./src/auth/auth.routes.js");
    app.use("/api/auth", authRoutes.default);
    console.log('✅ Rutas de autenticación cargadas: /api/auth');
  } catch (error) {
    console.error('❌ ERROR al cargar rutas de auth:', error.message);
  }

  // 2. APLICAR MIDDLEWARE DE AUTENTICACIÓN
  console.log('🔒 Aplicando middleware de autenticación...');
  app.use(autenticar);
  console.log('✅ Middleware aplicado');

  // 3. CARGAR RUTAS PROTEGIDAS
  const modulos = [
    { nombre: "categorias", ruta: "/api/categorias" },
    { nombre: "rangoEdad", ruta: "/api/rangos-edad" },
    { nombre: "nivelDificultad", ruta: "/api/nivel-dificultad" },
    { nombre: "subcategoria", ruta: "/api/subcategoria" }
  ];

  for (const modulo of modulos) {
    try {
      const rutaArchivo = `./src/examen/${modulo.nombre}/${modulo.nombre}.routes.js`;
      const moduloRoutes = await import(rutaArchivo);
      app.use(modulo.ruta, moduloRoutes.default);
      console.log(`✅ ${modulo.nombre} → ${modulo.ruta}`);
    } catch (error) {
      console.log(`❌ Error cargando ${modulo.nombre}:`, error.message);
    }
  }

  // 4. RUTAS 404 Y MANEJO DE ERRORES (AL FINAL)
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: "Ruta no encontrada",
      ruta: req.path,
      metodo: req.method
    });
  });

  app.use((err, req, res, next) => {
    console.error("❌ Error:", err.message);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  });

  console.log('✅ Todas las rutas cargadas correctamente');
}

// ============================================================
// CONFIGURACIÓN SERVIDOR
// ============================================================

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
    app.listen(PORT, () => {
      console.log('\n' + '='.repeat(60));
      console.log(`🚀 Servidor HTTP en http://localhost:${PORT}`);
      console.log('='.repeat(60));
    });
    return;
  }

  // Cargar certificados SSL
  let opciones;
  try {
    opciones = {
      key: fs.readFileSync("key.pem"),
      cert: fs.readFileSync("cert.pem")
    };
    console.log('✅ Certificados SSL cargados');
  } catch (error) {
    console.error('❌ Error SSL:', error.message);
    process.exit(1);
  }

  if (USAR_HTTP2) {
    try {
      const spdyOptions = {
        ...opciones,
        spdy: {
          protocols: ['h2', 'spdy/3.1', 'http/1.1'],
          plain: false
        }
      };

      const server = spdy.createServer(spdyOptions, app);
      
      server.listen(PORT, () => {
        const localIP = getLocalIP();
        
        console.log('\n' + '='.repeat(70));
        console.log('    🚀 SERVIDOR INICIADO');
        console.log('='.repeat(70));
        console.log(`   🌐 Local:  https://localhost:${PORT}`);
        console.log(`   🌐 Red:    https://${localIP}:${PORT}`);
        console.log(`   📡 Protocolo: HTTP/2`);
        console.log(`   🔐 HTTPS: Activado`);
        console.log('='.repeat(70));
        console.log('\n📋 RUTAS PÚBLICAS:');
        console.log('   ✅ Raíz             → GET /');
        console.log('   ✅ Test             → GET /test-licencia');
        console.log('   ✅ Salud            → GET /health');
        console.log('   ✅ Info             → GET /api/info');
        console.log('   ✅ Registro         → POST /api/auth/register');
        console.log('   ✅ Login            → POST /api/auth/login');
        console.log('\n📋 RUTAS PROTEGIDAS:');
        console.log('   🔒 Categorías       → /api/categorias');
        console.log('   🔒 Rango Edad       → /api/rangos-edad');
        console.log('   🔒 Nivel Dificultad → /api/nivel-dificultad');
        console.log('   🔒 Subcategoría     → /api/subcategoria');
        console.log('\n🔐 AUTENTICACIÓN:');
        console.log('   1. JWT: Authorization: Bearer <token>');
        console.log('   2. Licencia: x-licencia: LICENCIA_VALIDA');
        console.log('='.repeat(70));
      });
      
    } catch (error) {
      console.error('❌ Error HTTP/2:', error.message);
      process.exit(1);
    }
  } else {
    const server = https.createServer(opciones, app);
    server.listen(PORT, () => {
      console.log(`🚀 Servidor HTTPS en https://localhost:${PORT}`);
    });
  }
}

// ============================================================
// INICIALIZACIÓN
// ============================================================

async function iniciar() {
  try {
    await conectarMongoDB();
    await cargarRutas();
    iniciarServidor();
  } catch (error) {
    console.error('❌ Error al iniciar:', error.message);
    process.exit(1);
  }
}

process.on('SIGINT', () => {
  console.log('\n👋 Apagando servidor...');
  process.exit(0);
});

iniciar();
