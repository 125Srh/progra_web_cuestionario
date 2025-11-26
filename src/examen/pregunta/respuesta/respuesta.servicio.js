import Respuesta from "./respuesta.model.js";
import Pregunta from "../pregunta.model.js";

export const registrarRespuesta = async (datos) => {
  const pregunta = await Pregunta.findById(datos.pregunta);
  if (!pregunta) {
    throw new Error("La pregunta no existe");
  }

  const esCorrecta = datos.respuestaSeleccionada === pregunta.respuestaCorrecta;

  const respuesta = new Respuesta({
    ...datos,
    esCorrecta,
    calificacion: esCorrecta ? 1 : 0,
  });

  return respuesta.save();
};

export const listarRespuestas = async (filtros = {}) => {
  return Respuesta.find(filtros)
    .populate("pregunta", "titulo nivelDificultad")
    .sort({ respondidaEn: -1 });
};

export const obtenerRespuestasPorPregunta = async (preguntaId) => {
  return listarRespuestas({ pregunta: preguntaId });
};


