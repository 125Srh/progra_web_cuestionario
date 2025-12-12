// src/examen/subcategoria/subcategoria.routes.js

import { Router } from "express";

import {
  createSubcategoria,
  getSubcategorias,
  getSubcategoriaById,
  updateSubcategoria,
  deleteSubcategoria,
  toggleSubcategoria
} from "./subcategoria.controller.js";

import { authorize } from "../../auth/auth.middleware.js";

const router = Router();

router.get("/", authorize(["admin", "profesor"]), getSubcategorias);
router.get("/:id", authorize(["admin", "profesor"]), getSubcategoriaById);

router.post("/", authorize(["admin"]), createSubcategoria);
router.put("/:id", authorize(["admin"]), updateSubcategoria);
router.delete("/:id", authorize(["admin"]), deleteSubcategoria);
router.patch("/:id/toggle", authorize(["admin"]), toggleSubcategoria);

export default router;
