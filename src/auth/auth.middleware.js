// src/auth/auth.middleware.js
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "secreto_local_123";

/**
 * authenticate
 * Verifica el token JWT y asigna req.user = { id, email, role, ... }
 */
export const authenticate = (req, res, next) => {
  const header = req.headers.authorization || req.headers.Authorization;
  
  if (!header) {
    return next(); // Si no se envió token, seguir con el middleware de licencia
  }

  const parts = header.split(" ");
  if (parts.length !== 2 || (parts[0] !== "Bearer" && parts[0] !== "JWT")) {
    return res.status(401).json({ message: "Formato de token inválido, use Bearer o JWT" });
  }

  const token = parts[1];
  try {
    const payload = jwt.verify(token, SECRET);
    req.user = payload;
    req.authMethod = "jwt";
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token inválido o expirado" });
  }
};

/**
 * authorize(allowedRoles)
 * Verifica si el rol del usuario es permitido.
 */
export const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    if (req.authMethod !== "jwt" || !req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Acceso denegado. Rol no autorizado." });
    }
    next();
  };
};

