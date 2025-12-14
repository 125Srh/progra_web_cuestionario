// src/auth/auth.routes.js
import express from "express";

console.log("🔥 [AUTH ROUTES] Iniciando carga del módulo");

let register, login;

try {
  const controllers = await import("./auth.controller.js");
  register = controllers.register;
  login = controllers.login;
  console.log("✅ [AUTH ROUTES] Controladores importados correctamente");
} catch (error) {
  console.error("❌ [AUTH ROUTES] Error al importar controladores:", error.message);
}

const router = express.Router();

console.log("🔥 [AUTH ROUTES] Creando rutas...");

router.post("/register", (req, res, next) => {
  console.log("🎯 [AUTH ROUTES] POST /register recibido");
  console.log("   📦 Body:", req.body);
  console.log("   🔐 Headers:", req.headers);
  if (register) {
    register(req, res, next);
  } else {
    res.status(500).json({ message: "Controller no disponible" });
  }
});

router.post("/login", (req, res, next) => {
  console.log("🎯 [AUTH ROUTES] POST /login recibido");
  console.log("   📦 Body:", req.body);
  if (login) {
    login(req, res, next);
  } else {
    res.status(500).json({ message: "Controller no disponible" });
  }
});

console.log("✅ [AUTH ROUTES] Rutas configuradas exitosamente");

export default router;
