import NivelDificultad from './nivelDificultad.model.js';

// Crear un nivel de dificultad
export const crear = async (req, res) => {
  try {
    const nivel = new NivelDificultad(req.body);
    await nivel.save();
    res.status(201).json({
      success: true,
      message: 'Nivel de dificultad creado',
      data: nivel
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Crear múltiples niveles
export const crearMultiples = async (req, res) => {
  try {
    const niveles = await NivelDificultad.insertMany(req.body);
    res.status(201).json({
      success: true,
      message: `${niveles.length} niveles creados`,
      data: niveles
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Obtener todos los niveles
export const obtenerTodos = async (req, res) => {
  try {
    const niveles = await NivelDificultad.find();
    res.json({
      success: true,
      count: niveles.length,
      data: niveles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Obtener un nivel por ID
export const obtenerPorId = async (req, res) => {
  try {
    const nivel = await NivelDificultad.findOne({ 
      id_dificultad: req.params.id 
    });
    
    if (!nivel) {
      return res.status(404).json({
        success: false,
        message: 'Nivel no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: nivel
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Actualizar un nivel
export const actualizar = async (req, res) => {
  try {
    const nivel = await NivelDificultad.findOneAndUpdate(
      { id_dificultad: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!nivel) {
      return res.status(404).json({
        success: false,
        message: 'Nivel no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Nivel actualizado',
      data: nivel
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Eliminar un nivel
export const eliminar = async (req, res) => {
  try {
    const nivel = await NivelDificultad.findOneAndDelete({ 
      id_dificultad: req.params.id 
    });
    
    if (!nivel) {
      return res.status(404).json({
        success: false,
        message: 'Nivel no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Nivel eliminado',
      data: nivel
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};