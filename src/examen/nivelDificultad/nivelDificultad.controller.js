// src/examen/nivelDificultad/nivelDificultad.controller.js
import NivelDificultad from "./nivelDificultad.model.js";

// Normaliza campo nombre (acepta varios nombres posibles)
const normalizeNombre = (body) => {
  const raw = body?.nombre_nivel ?? body?.nombre ?? body?.name ?? "";
  return (typeof raw === "string") ? raw.trim() : String(raw).trim();
};

export const createNivelDificultad = async (req, res) => {
  try {
    const nombre = normalizeNombre(req.body);
    if (!nombre) return res.status(400).json({ success: false, message: "El nombre del nivel es requerido" });

    const nuevo = await NivelDificultad.create({ ...req.body, nombre });
    return res.status(201).json({ success: true, data: nuevo });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Error creando nivel" });
  }
};

export const getNivelesDificultad = async (req, res) => {
  try {
    const list = await NivelDificultad.find();
    return res.json({ success: true, data: list });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Error obteniendo niveles" });
  }
};

export const getNivelDificultadById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await NivelDificultad.findById(id);
    if (!item) return res.status(404).json({ success: false, message: "Nivel no encontrado" });
    return res.json({ success: true, data: item });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Error obteniendo nivel" });
  }
};

export const updateNivelDificultad = async (req, res) => {
  try {
    const { id } = req.params;
    const nombre = normalizeNombre(req.body);
    const update = { ...req.body };
    if (nombre) update.nombre = nombre;

    const updated = await NivelDificultad.findByIdAndUpdate(id, update, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Nivel no encontrado" });
    return res.json({ success: true, data: updated });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Error actualizando nivel" });
  }
};

export const deleteNivelDificultad = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await NivelDificultad.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: "Nivel no encontrado" });
    return res.json({ success: true, message: "Nivel eliminado" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Error eliminando nivel" });
  }
};

export const toggleNivelDificultad = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await NivelDificultad.findById(id);
    if (!item) return res.status(404).json({ success: false, message: "Nivel no encontrado" });
    item.activo = !item.activo;
    await item.save();
    return res.json({ success: true, data: item });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Error cambiando estado" });
  }
};
