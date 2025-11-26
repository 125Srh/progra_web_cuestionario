import { Router } from "express";
import {
  crearPreguntaHandler,
  listarPreguntasHandler,
  obtenerPreguntaHandler,
  actualizarPreguntaHandler,
  eliminarPreguntaHandler,
} from "./pregunta.controller.js";
import {
  registrarRespuestaHandler,
  listarRespuestasHandler,
  obtenerRespuestasPorPreguntaHandler,
} from "./respuesta/respuesta.controller.js";

const router = Router();

router.get("/", listarPreguntasHandler);
router.post("/", crearPreguntaHandler);
router.get("/:id", obtenerPreguntaHandler);
router.put("/:id", actualizarPreguntaHandler);
router.delete("/:id", eliminarPreguntaHandler);

router.get("/:preguntaId/respuestas", obtenerRespuestasPorPreguntaHandler);
router.get("/respuestas/historial", listarRespuestasHandler);
router.post("/:preguntaId/respuestas", (req, res, next) => {
  registrarRespuestaHandler(
    {
      ...req,
      body: {
        ...req.body,
        pregunta: req.params.preguntaId,
      },
    },
    res,
    next
  );
});

router.post("/respuestas", registrarRespuestaHandler);

export default router;


