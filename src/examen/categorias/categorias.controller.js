import Categorias from "./categorias.model.js";

export const createCategorias = async (req, res) => {
  try {
    const { nombre_categoria, description, activo = true } = req.body;

    if (!nombre_categoria) {
      return res.status(400).json({
        success: false,
        message: "El nombre de la categoría es requerido"
      });
    }

    const existingCategorias = await Categorias.findOne({ 
      nombre_categoria: new RegExp(`^${nombre_categoria}$`, 'i') 
    });
    
    if (existingCategorias) {
      return res.status(400).json({
        success: false,
        message: "Ya existe una categoría con ese nombre"
      });
    }

    const nuevaCategorias = new Categorias({
      nombre_categoria,
      description,
      activo
    });

    const categoriasGuardada = await nuevaCategorias.save();

    res.status(201).json({
      success: true,
      message: "Categoría creada exitosamente",
      data: categoriasGuardada
    });
  } catch (error) {
    console.error("Error al crear categoría:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error interno del servidor"
    });
  }
};

export const getCategorias = async (req, res) => {
  try {
    const { activo, search } = req.query;
    
    let query = {};
    
    if (activo !== undefined) {
      query.activo = activo === 'true';
    }
    
    if (search) {
      query.nombre_categoria = { 
        $regex: search, 
        $options: 'i' 
      };
    }

    const categorias = await Categorias.find(query)
      .sort({ fecha_creacion: -1 });

    res.status(200).json({
      success: true,
      count: categorias.length,
      data: categorias
    });
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
};

export const getCategoriasById = async (req, res) => {
  try {
    const { id } = req.params;

    const categorias = await Categorias.findById(id);
    if (!categorias) {
      return res.status(404).json({
        success: false,
        message: "Categoría no encontrada"
      });
    }

    res.status(200).json({
      success: true,
      data: categorias
    });
  } catch (error) {
    console.error("Error al obtener categoría:", error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: "ID inválido"
      });
    }
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
};

export const updateCategorias = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_categoria, description, activo } = req.body;

    if (nombre_categoria) {
      const existingCategorias = await Categorias.findOne({
        _id: { $ne: id },
        nombre_categoria: new RegExp(`^${nombre_categoria}$`, 'i')
      });
      
      if (existingCategorias) {
        return res.status(400).json({
          success: false,
          message: "Ya existe otra categoría con ese nombre"
        });
      }
    }

    const categoriasActualizada = await Categorias.findByIdAndUpdate(
      id,
      { nombre_categoria, description, activo },
      { 
        new: true, 
        runValidators: true 
      }
    );

    if (!categoriasActualizada) {
      return res.status(404).json({
        success: false,
        message: "Categoría no encontrada"
      });
    }

    res.status(200).json({
      success: true,
      message: "Categoría actualizada exitosamente",
      data: categoriasActualizada
    });
  } catch (error) {
    console.error("Error al actualizar categoría:", error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: "ID inválido"
      });
    }
    res.status(500).json({
      success: false,
      message: error.message || "Error interno del servidor"
    });
  }
};

export const deleteCategorias = async (req, res) => {
  try {
    const { id } = req.params;

    const categoriasEliminada = await Categorias.findByIdAndDelete(id);

    if (!categoriasEliminada) {
      return res.status(404).json({
        success: false,
        message: "Categoría no encontrada"
      });
    }

    res.status(200).json({
      success: true,
      message: "Categoría eliminada exitosamente",
      data: categoriasEliminada
    });
  } catch (error) {
    console.error("Error al eliminar categoría:", error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: "ID inválido"
      });
    }
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
};

export const toggleCategorias = async (req, res) => {
  try {
    const { id } = req.params;

    const categorias = await Categorias.findById(id);
    if (!categorias) {
      return res.status(404).json({
        success: false,
        message: "Categoría no encontrada"
      });
    }

    categorias.activo = !categorias.activo;
    const categoriasActualizada = await categorias.save();

    res.status(200).json({
      success: true,
      message: `Categoría ${categoriasActualizada.activo ? 'activada' : 'desactivada'} exitosamente`,
      data: categoriasActualizada
    });
  } catch (error) {
    console.error("Error al cambiar estado de la categoría:", error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: "ID inválido"
      });
    }
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
};

export const getCategoriasActivas = async (req, res) => {
  try {
    const categorias = await Categorias.findActive().sort({ nombre_categoria: 1 });

    res.status(200).json({
      success: true,
      count: categorias.length,
      data: categorias
    });
  } catch (error) {
    console.error("Error al obtener categorías activas:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
};