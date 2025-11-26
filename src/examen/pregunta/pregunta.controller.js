import {
  crearPregunta,
  listarPreguntas,
  obtenerPreguntaPorId,
  actualizarPregunta,
  eliminarPregunta,
} from "./pregunta.servicio.js";

export const crearPreguntaHandler = async (req, res, next) => {
  try {
    const pregunta = await crearPregunta(req.body);
    res.status(201).json(pregunta);
  } catch (error) {
    next(error);
  }
};

export const listarPreguntasHandler = async (_req, res, next) => {
  try {
    const preguntas = await listarPreguntas();
    res.json(preguntas);
  } catch (error) {
    next(error);
  }
};

export const obtenerPreguntaHandler = async (req, res, next) => {
  try {
    const pregunta = await obtenerPreguntaPorId(req.params.id);
    if (!pregunta) {
      return res.status(404).json({ error: "Pregunta no encontrada" });
    }
    res.json(pregunta);
  } catch (error) {
    next(error);
  }
};

export const actualizarPreguntaHandler = async (req, res, next) => {
  try {
    const pregunta = await actualizarPregunta(req.params.id, req.body);
    if (!pregunta) {
      return res.status(404).json({ error: "Pregunta no encontrada" });
    }
    res.json(pregunta);
  } catch (error) {
    next(error);
  }
};

export const eliminarPreguntaHandler = async (req, res, next) => {
  try {
    const pregunta = await eliminarPregunta(req.params.id);
    if (!pregunta) {
      return res.status(404).json({ error: "Pregunta no encontrada" });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

