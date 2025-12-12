// src/examen/rangoEdad/rangoEdad.routes.js

import { Router } from "express";

import {
  createRangoEdad,
  getRangosEdad,
  getRangoEdadById,
  updateRangoEdad,
  deleteRangoEdad,
  toggleRangoEdad
} from "./rangoEdad.controller.js";

import { authorize } from "../../auth/auth.middleware.js";

const router = Router();

router.get("/", authorize(["admin", "profesor"]), getRangosEdad);
router.get("/:id", authorize(["admin", "profesor"]), getRangoEdadById);

router.post("/", authorize(["admin"]), createRangoEdad);
router.put("/:id", authorize(["admin"]), updateRangoEdad);
router.delete("/:id", authorize(["admin"]), deleteRangoEdad);
router.patch("/:id/toggle", authorize(["admin"]), toggleRangoEdad);

export default router;
