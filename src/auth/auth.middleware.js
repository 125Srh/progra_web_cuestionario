// src/auth/auth.middleware.js
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "secreto_local_123";

/**
 * authenticate
 * Verifica el token JWT y asigna req.user = { id, email, role, ... }
 */
export const authenticate = (req, res, next) => {
  const header = req.headers.authorization || req.headers.Authorization;
  if (!header) return res.status(401).json({ message: "No se envió token" });

  const parts = header.split(" ");
  if (parts.length !== 2 || parts[0] !== "JWT") {
    return res.status(401).json({ message: "Formato inválido. Use: Authorization: JWT <token>" });
  }

  const token = parts[1];
  try {
    const payload = jwt.verify(token, SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(403).json({ message: "Token inválido o expirado" });
  }
};

/**
 * authorize(allowedRoles)
 * Middleware factory: devuelve un middleware que exige que el role esté en allowedRoles.
 * Ejemplo: authorize(['admin','profesor'])
 */
export const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    // Si ya se llamó a authenticate previamente, req.user ya existe.
    // Pero si la ruta usa solo authorize, verificamos token aquí también.
    const header = req.headers.authorization || req.headers.Authorization;
    if (!header) return res.status(401).json({ message: "No se envió token" });

    const parts = header.split(" ");
    if (parts.length !== 2 || parts[0] !== "JWT") {
      return res.status(401).json({ message: "Formato inválido. Use: Authorization: JWT <token>" });
    }

    const token = parts[1];
    try {
      const payload = jwt.verify(token, SECRET);
      if (!allowedRoles.includes(payload.role)) {
        return res.status(403).json({ message: "Rol no autorizado" });
      }
      req.user = payload;
      return next();
    } catch (err) {
      return res.status(403).json({ message: "Token inválido o expirado" });
    }
  };
};

/**
 * validarAdmin
 * Middleware directo para rutas que SOLO admin puede acceder.
 * (Conveniencia: evita escribir authorize(['admin']) cada vez.)
 */
export const validarAdmin = (req, res, next) => {
  // reusa authorize internamente
  return authorize(["admin"])(req, res, next);
};

/**
 * Compatibilidad: re-exportar nombres habituales (si tu admin.middleware.js exportaba otros nombres)
 * Si quieres mantener admin.middleware.js por compatibilidad, puedes importarlo y reexportar desde allí.
 */
export default {
  authenticate,
  authorize,
  validarAdmin
};
