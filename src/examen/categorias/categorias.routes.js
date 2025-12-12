// src/examen/categorias/categorias.routes.js

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

import { authorize } from "../../auth/auth.middleware.js";

const router = Router();

router.get("/", authorize(["admin", "profesor"]), getCategorias);
router.get("/activas", authorize(["admin", "profesor"]), getCategoriasActivas);
router.get("/:id", authorize(["admin", "profesor"]), getCategoriasById);

router.post("/", authorize(["admin"]), createCategorias);
router.put("/:id", authorize(["admin"]), updateCategorias);
router.delete("/:id", authorize(["admin"]), deleteCategorias);
router.patch("/:id/toggle", authorize(["admin"]), toggleCategorias);

export default router;
