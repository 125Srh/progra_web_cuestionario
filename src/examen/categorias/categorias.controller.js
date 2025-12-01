// src/examen/categorias/categorias.controller.js
import Categorias from "./categorias.model.js";

// Normaliza nombre (acepta nombre_categoria, nombre, name)
const normalizeNombre = (body) => {
  const raw = body?.nombre_categoria ?? body?.nombre ?? body?.name ?? "";
  return (typeof raw === "string") ? raw.trim() : String(raw).trim();
};

export const createCategorias = async (req, res) => {
  try {
    const nombre_categoria = normalizeNombre(req.body);
    const description = req.body?.description ?? req.body?.descripcion ?? "";
    const activo = req.body?.activo !== undefined ? Boolean(req.body.activo) : true;

    if (!nombre_categoria) {
      return res.status(400).json({
        success: false,
        message: "El nombre de la categoría es requerido"
      });
    }

    const existingCategorias = await Categorias.findOne({
      $or: [
        { nombre_categoria: new RegExp(`^${nombre_categoria}$`, "i") },
        { nombre: new RegExp(`^${nombre_categoria}$`, "i") }
      ]
    });

    if (existingCategorias) {
      return res.status(400).json({
        success: false,
        message: "Ya existe una categoría con ese nombre"
      });
    }

    const nuevaCategorias = new Categorias({
      nombre_categoria,
      nombre: nombre_categoria,
      description,
      activo
    });

    const categoriasGuardada = await nuevaCategorias.save();

    return res.status(201).json({
      success: true,
      message: "Categoría creada exitosamente",
      data: categoriasGuardada
    });
  } catch (error) {
    console.error("Error al crear categoría:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error interno del servidor"
    });
  }
};

export const getCategorias = async (req, res) => {
  try {
    const { activo, search } = req.query;

    const query = {};
    if (activo !== undefined) query.activo = String(activo) === "true";

    if (search && typeof search === "string" && search.trim() !== "") {
      const re = new RegExp(search.trim(), "i");
      query.$or = [
        { nombre_categoria: re },
        { nombre: re },
        { description: re }
      ];
    }

    // ordenar por createdAt si existe, si no por _id descendente
    const sortObj = {};
    if (Categorias.schema.paths.createdAt) {
      sortObj.createdAt = -1;
    } else if (Categorias.schema.paths.fecha_creacion) {
      sortObj.fecha_creacion = -1;
    } else {
      sortObj._id = -1;
    }

    const categorias = await Categorias.find(query).sort(sortObj);

    return res.status(200).json({
      success: true,
      count: categorias.length,
      data: categorias
    });
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    return res.status(500).json({
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

    return res.status(200).json({
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
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
};

export const updateCategorias = async (req, res) => {
  try {
    const { id } = req.params;
    const nombre_categoria = normalizeNombre(req.body);
    const description = req.body?.description ?? req.body?.descripcion;
    const activo = req.body?.activo;

    if (nombre_categoria) {
      const existingCategorias = await Categorias.findOne({
        _id: { $ne: id },
        $or: [
          { nombre_categoria: new RegExp(`^${nombre_categoria}$`, 'i') },
          { nombre: new RegExp(`^${nombre_categoria}$`, 'i') }
        ]
      });

      if (existingCategorias) {
        return res.status(400).json({
          success: false,
          message: "Ya existe otra categoría con ese nombre"
        });
      }
    }

    const update = {};
    if (nombre_categoria) {
      update.nombre_categoria = nombre_categoria;
      update.nombre = nombre_categoria;
    }
    if (description !== undefined) update.description = description;
    if (activo !== undefined) update.activo = Boolean(activo);

    const categoriasActualizada = await Categorias.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true
    });

    if (!categoriasActualizada) {
      return res.status(404).json({
        success: false,
        message: "Categoría no encontrada"
      });
    }

    return res.status(200).json({
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
    return res.status(500).json({
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

    return res.status(200).json({
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
    return res.status(500).json({
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

    return res.status(200).json({
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
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
};

export const getCategoriasActivas = async (req, res) => {
  try {
    // si tu modelo no tiene findActive(), usamos find({activo:true})
    const categorias = await Categorias.find({ activo: true }).sort({ nombre_categoria: 1 });

    return res.status(200).json({
      success: true,
      count: categorias.length,
      data: categorias
    });
  } catch (error) {
    console.error("Error al obtener categorías activas:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
};
