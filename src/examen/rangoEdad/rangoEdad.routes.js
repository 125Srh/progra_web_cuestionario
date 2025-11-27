import { Router } from "express";
import {
  createRangoEdad,
  getRangosEdad,
  getRangoEdadById,
  updateRangoEdad,
  deleteRangoEdad,
  toggleRangoEdad
} from "./rangoEdad.controller.js";

const router = Router();

// Rutas para rangos de edad
router.post("/", createRangoEdad);
router.get("/", getRangosEdad);
router.get("/:id", getRangoEdadById);
router.put("/:id", updateRangoEdad);
router.delete("/:id", deleteRangoEdad);
router.patch("/:id/toggle", toggleRangoEdad);

export default router;