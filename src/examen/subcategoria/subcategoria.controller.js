// src/examen/subcategoria/subcategoria.controller.js
import Subcategoria from "./subcategoria.model.js";

// Normaliza nombre (acepta distintos campos)
const normalizeNombre = (body) => {
  const raw = body?.nombre_subcategoria ?? body?.nombre ?? body?.name ?? "";
  return (typeof raw === "string") ? raw.trim() : String(raw).trim();
};

export const createSubcategoria = async (req, res) => {
  try {
    const nombre = normalizeNombre(req.body);
    if (!nombre) return res.status(400).json({ success: false, message: "El nombre de la subcategoría es requerido" });

    const nuevo = await Subcategoria.create({ ...req.body, nombre });
    return res.status(201).json({ success: true, data: nuevo });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Error creando subcategoría" });
  }
};

export const getSubcategorias = async (req, res) => {
  try {
    const list = await Subcategoria.find();
    return res.json({ success: true, data: list });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Error obteniendo subcategorías" });
  }
};

export const getSubcategoriaById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Subcategoria.findById(id);
    if (!item) return res.status(404).json({ success: false, message: "Subcategoría no encontrada" });
    return res.json({ success: true, data: item });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Error obteniendo subcategoría" });
  }
};

export const updateSubcategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const nombre = normalizeNombre(req.body);
    const update = { ...req.body };
    if (nombre) update.nombre = nombre;

    const updated = await Subcategoria.findByIdAndUpdate(id, update, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Subcategoría no encontrada" });
    return res.json({ success: true, data: updated });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Error actualizando subcategoría" });
  }
};

export const deleteSubcategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Subcategoria.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: "Subcategoría no encontrada" });
    return res.json({ success: true, message: "Subcategoría eliminada" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Error eliminando subcategoría" });
  }
};

export const toggleSubcategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Subcategoria.findById(id);
    if (!item) return res.status(404).json({ success: false, message: "Subcategoría no encontrada" });
    item.activo = !item.activo;
    await item.save();
    return res.json({ success: true, data: item });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Error cambiando estado" });
  }
};
