import mongoose from "mongoose";

const { Schema, model } = mongoose;

const preguntaSchema = new Schema(
  {
    titulo: {
      type: String,
      required: [true, "El título de la pregunta es obligatorio"],
      trim: true,
    },
    descripcion: {
      type: String,
      trim: true,
    },
    opciones: {
      type: [String],
      required: [true, "Debes definir al menos dos opciones"],
      validate: {
        validator: (value) => Array.isArray(value) && value.length >= 2,
        message: "La pregunta necesita al menos dos opciones",
      },
    },
    respuestaCorrecta: {
      type: String,
      required: [true, "Debes indicar la respuesta correcta"],
      validate: {
        validator(value) {
          return this.opciones?.includes(value);
        },
        message: "La respuesta correcta debe estar dentro del arreglo de opciones",
      },
    },
    nivelDificultad: {
      type: String,
      enum: ["facil", "intermedio", "dificil"],
      default: "facil",
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

const Pregunta = model("Pregunta", preguntaSchema);

export default Pregunta;


