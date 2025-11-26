import mongoose from "mongoose";

const { Schema, model } = mongoose;

const respuestaSchema = new Schema(
  {
    pregunta: {
      type: Schema.Types.ObjectId,
      ref: "Pregunta",
      required: true,
    },
    participante: {
      type: String,
      required: [true, "El nombre del participante es obligatorio"],
      trim: true,
    },
    respuestaSeleccionada: {
      type: String,
      required: [true, "Debes enviar la respuesta seleccionada"],
    },
    esCorrecta: {
      type: Boolean,
      default: false,
    },
    calificacion: {
      type: Number,
      min: 0,
      max: 1,
      default: 0,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: {
      createdAt: "respondidaEn",
      updatedAt: false,
    },
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

const Respuesta = model("Respuesta", respuestaSchema);

export default Respuesta;


