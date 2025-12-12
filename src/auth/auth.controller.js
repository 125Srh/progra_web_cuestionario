// src/auth/auth.controller.js
import Usuario from "./user.model.js";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "secreto_local_123";
const EXPIRES = process.env.JWT_EXPIRES || "3h";

export const register = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email y password requeridos" });

    const existe = await Usuario.findOne({ email });
    if (existe) return res.status(409).json({ message: "Usuario ya existe" });

    const nuevo = new Usuario({ email, password, role: role || "profesor" });
    await nuevo.save();

    return res.status(201).json({
      message: "Usuario registrado",
      user: { id: nuevo._id, email: nuevo.email, role: nuevo.role }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error en registro" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email y password requeridos" });

    const user = await Usuario.findOne({ email });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const valid = await user.comparePassword(password);
    if (!valid) return res.status(401).json({ message: "Contraseña incorrecta" });

    const payload = { id: user._id, email: user.email, role: user.role };
    const token = jwt.sign(payload, SECRET, { expiresIn: EXPIRES });

    return res.json({
      message: "Login correcto",
      user: { id: user._id, email: user.email, role: user.role },
      token
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error en login" });
  }
};
