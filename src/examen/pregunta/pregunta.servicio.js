import Pregunta from "./pregunta.model.js";

export const crearPregunta = async (datos) => {
  const pregunta = new Pregunta(datos);
  return pregunta.save();
};

export const listarPreguntas = async () => {
  return Pregunta.find().sort({ createdAt: -1 });
};

export const obtenerPreguntaPorId = async (id) => {
  return Pregunta.findById(id);
};

export const actualizarPregunta = async (id, datos) => {
  const preguntaActualizada = await Pregunta.findByIdAndUpdate(id, datos, {
    new: true,
    runValidators: true,
  });
  return preguntaActualizada;
};

export const eliminarPregunta = async (id) => {
  return Pregunta.findByIdAndDelete(id);
};

