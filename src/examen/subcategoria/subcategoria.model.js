import mongoose from 'mongoose';

const subcategoriaSchema = new mongoose.Schema({
  id_subcategoria: {
    type: Number,
    required: true,
    unique: true
  },
  id_categoria: {
    type: Number,
    required: true
  },
  nombre_subcategoria: {
    type: String,
    required: true,
    maxlength: 100
  },
  descripcion: {
    type: String,
    maxlength: 255
  },
  fecha_creacion: {
    type: Date,
    default: Date.now
  },
  activo: {
    type: Boolean,
    default: true
  }
}, {
  collection: 'subcategorias',
  timestamps: true
});

export default mongoose.model('Subcategoria', subcategoriaSchema);