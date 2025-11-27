import { Router } from "express";
import {
  createCategorias,
  getCategorias,
  getCategoriasById,
  updateCategorias,
  deleteCategorias,
  toggleCategorias,
  getCategoriasActivas
} from "./categorias.controller.js";

const router = Router();

// Rutas para categorías
router.post("/", createCategorias);
router.get("/", getCategorias);
router.get("/activas", getCategoriasActivas);
router.get("/:id", getCategoriasById);
router.put("/:id", updateCategorias);
router.delete("/:id", deleteCategorias);
router.patch("/:id/toggle", toggleCategorias);

export default router;