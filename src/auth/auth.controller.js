// src/auth/auth.controller.js
import Usuario from "./user.model.js"; // Asegúrate de tener este modelo
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "secreto_local_123";
const EXPIRES = process.env.JWT_EXPIRES || "3h";

export const register = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email y password son requeridos" });

    const existe = await Usuario.findOne({ email });
    if (existe) return res.status(409).json({ message: "Usuario ya existe" });

    const nuevoUsuario = new Usuario({ email, password, role: role || "profesor" });
    await nuevoUsuario.save();

    return res.status(201).json({
      message: "Usuario registrado correctamente",
      user: { id: nuevoUsuario._id, email: nuevoUsuario.email, role: nuevoUsuario.role }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error al registrar el usuario" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email y password son requeridos" });

    const usuario = await Usuario.findOne({ email });
    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });

    const isPasswordValid = await usuario.comparePassword(password);
    if (!isPasswordValid) return res.status(401).json({ message: "Contraseña incorrecta" });

    const token = jwt.sign({ id: usuario._id, email: usuario.email, role: usuario.role }, SECRET, { expiresIn: EXPIRES });

    return res.json({
      message: "Login exitoso",
      user: { id: usuario._id, email: usuario.email, role: usuario.role },
      token
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error al realizar login" });
  }
};
