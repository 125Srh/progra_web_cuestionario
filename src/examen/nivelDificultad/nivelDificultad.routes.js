// src/examen/nivelDificultad/nivelDificultad.routes.js

import { Router } from "express";

import {
  createNivelDificultad,
  getNivelesDificultad,
  getNivelDificultadById,
  updateNivelDificultad,
  deleteNivelDificultad,
  toggleNivelDificultad
} from "./nivelDificultad.controller.js";

import { authorize } from "../../auth/auth.middleware.js";

const router = Router();

router.get("/", authorize(["admin", "profesor"]), getNivelesDificultad);
router.get("/:id", authorize(["admin", "profesor"]), getNivelDificultadById);

router.post("/", authorize(["admin"]), createNivelDificultad);
router.put("/:id", authorize(["admin"]), updateNivelDificultad);
router.delete("/:id", authorize(["admin"]), deleteNivelDificultad);
router.patch("/:id/toggle", authorize(["admin"]), toggleNivelDificultad);

export default router;
