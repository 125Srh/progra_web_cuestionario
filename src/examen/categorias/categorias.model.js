import mongoose from "mongoose";

const categoriasSchema = new mongoose.Schema({
  nombre_categoria: {
    type: String,
    required: [true, "El nombre de la categoría es requerido"],
    maxlength: 100,
    trim: true,
    unique: true
  },
  description: {
    type: String,
    maxlength: 255,
    trim: true,
    default: ""
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
  timestamps: false,
  versionKey: false
});

categoriasSchema.pre('save', function(next) {
  if (!this.fecha_creacion) {
    this.fecha_creacion = new Date();
  }
  next();
});

categoriasSchema.statics.findActive = function() {
  return this.find({ activo: true });
};

categoriasSchema.statics.findByName = function(nombre) {
  return this.findOne({ 
    nombre_categoria: new RegExp(nombre, 'i') 
  });
};

export default mongoose.model('Categorias', categoriasSchema, 'categorias');