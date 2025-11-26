import mongoose from 'mongoose';

const nivelDificultadSchema = new mongoose.Schema({
  id_dificultad: {
    type: Number,
    required: true,
    unique: true
  },
  nivel: {
    type: String,
    required: true,
    maxlength: 20
  },
  descripcion: {
    type: String,
    maxlength: 255
  },
  activo: {
    type: Boolean,
    default: true
  }
}, {
  collection: 'niveles_dificultad',
  timestamps: true
});

export default mongoose.model('NivelDificultad', nivelDificultadSchema);