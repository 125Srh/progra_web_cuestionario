import {
  registrarRespuesta,
  listarRespuestas,
  obtenerRespuestasPorPregunta,
} from "./respuesta.servicio.js";

export const registrarRespuestaHandler = async (req, res, next) => {
  try {
    const respuesta = await registrarRespuesta(req.body);
    res.status(201).json(respuesta);
  } catch (error) {
    next(error);
  }
};

export const listarRespuestasHandler = async (req, res, next) => {
  try {
    const filtros = {};
    if (req.query.pregunta) {
      filtros.pregunta = req.query.pregunta;
    }
    const respuestas = await listarRespuestas(filtros);
    res.json(respuestas);
  } catch (error) {
    next(error);
  }
};

export const obtenerRespuestasPorPreguntaHandler = async (req, res, next) => {
  try {
    const respuestas = await obtenerRespuestasPorPregunta(req.params.preguntaId);
    res.json(respuestas);
  } catch (error) {
    next(error);
  }
};


