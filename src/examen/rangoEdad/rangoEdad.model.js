import mongoose from "mongoose";

const rangoEdadSchema = new mongoose.Schema({
  nombre_range: {
    type: String,
    required: true,
    maxlength: 50,
    trim: true
  },
  edad_minima: {
    type: Number,
    required: true,
    min: 0
  },
  edad_maxima: {
    type: Number,
    required: true,
    min: 0
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  versionKey: false
});

// Validación para asegurar que edad_minima <= edad_maxima
rangoEdadSchema.pre('save', function(next) {
  if (this.edad_minima > this.edad_maxima) {
    next(new Error('La edad mínima no puede ser mayor que la edad máxima'));
  }
  next();
});

// Método estático para encontrar rangos activos
rangoEdadSchema.statics.findActive = function() {
  return this.find({ active: true });
};

export default mongoose.model('RangoEdad', rangoEdadSchema, 'rangos_edad');