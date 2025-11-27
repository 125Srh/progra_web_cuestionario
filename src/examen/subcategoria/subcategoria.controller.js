import Subcategoria from './subcategoria.model.js';

// Crear una subcategoría
export const crear = async (req, res) => {
  try {
    const subcategoria = new Subcategoria(req.body);
    await subcategoria.save();
    res.status(201).json({
      success: true,
      message: 'Subcategoría creada',
      data: subcategoria
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Crear múltiples subcategorías
export const crearMultiples = async (req, res) => {
  try {
    const subcategorias = await Subcategoria.insertMany(req.body);
    res.status(201).json({
      success: true,
      message: `${subcategorias.length} subcategorías creadas`,
      data: subcategorias
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Obtener todas las subcategorías
export const obtenerTodas = async (req, res) => {
  try {
    const subcategorias = await Subcategoria.find();
    res.json({
      success: true,
      count: subcategorias.length,
      data: subcategorias
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Obtener subcategorías por categoría
export const obtenerPorCategoria = async (req, res) => {
  try {
    const subcategorias = await Subcategoria.find({ 
      id_categoria: req.params.idCategoria 
    });
    res.json({
      success: true,
      count: subcategorias.length,
      data: subcategorias
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Obtener una subcategoría por ID
export const obtenerPorId = async (req, res) => {
  try {
    const subcategoria = await Subcategoria.findOne({ 
      id_subcategoria: req.params.id 
    });
    
    if (!subcategoria) {
      return res.status(404).json({
        success: false,
        message: 'Subcategoría no encontrada'
      });
    }
    
    res.json({
      success: true,
      data: subcategoria
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Actualizar una subcategoría
export const actualizar = async (req, res) => {
  try {
    const subcategoria = await Subcategoria.findOneAndUpdate(
      { id_subcategoria: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!subcategoria) {
      return res.status(404).json({
        success: false,
        message: 'Subcategoría no encontrada'
      });
    }
    
    res.json({
      success: true,
      message: 'Subcategoría actualizada',
      data: subcategoria
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Eliminar una subcategoría
export const eliminar = async (req, res) => {
  try {
    const subcategoria = await Subcategoria.findOneAndDelete({ 
      id_subcategoria: req.params.id 
    });
    
    if (!subcategoria) {
      return res.status(404).json({
        success: false,
        message: 'Subcategoría no encontrada'
      });
    }
    
    res.json({
      success: true,
      message: 'Subcategoría eliminada',
      data: subcategoria
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};