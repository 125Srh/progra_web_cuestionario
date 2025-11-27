import RangoEdad from "./rangoEdad.model.js";

export const createRangoEdad = async (req, res) => {
  try {
    const { nombre_range, edad_minima, edad_maxima, active = true } = req.body;

    // Validar campos requeridos
    if (!nombre_range || edad_minima === undefined || edad_maxima === undefined) {
      return res.status(400).json({
        success: false,
        message: "Todos los campos son requeridos: nombre_range, edad_minima, edad_maxima"
      });
    }

    // Verificar si ya existe un rango con el mismo nombre
    const existingRango = await RangoEdad.findOne({ nombre_range });
    if (existingRango) {
      return res.status(400).json({
        success: false,
        message: "Ya existe un rango de edad con ese nombre"
      });
    }

    const nuevoRango = new RangoEdad({
      nombre_range,
      edad_minima,
      edad_maxima,
      active
    });

    const rangoGuardado = await nuevoRango.save();

    res.status(201).json({
      success: true,
      message: "Rango de edad creado exitosamente",
      data: rangoGuardado
    });
  } catch (error) {
    console.error("Error al crear rango de edad:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error interno del servidor"
    });
  }
};

export const getRangosEdad = async (req, res) => {
  try {
    const { active } = req.query;
    
    let query = {};
    if (active !== undefined) {
      query.active = active === 'true';
    }

    const rangos = await RangoEdad.find(query).sort({ edad_minima: 1 });

    res.status(200).json({
      success: true,
      data: rangos
    });
  } catch (error) {
    console.error("Error al obtener rangos de edad:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
};

export const getRangoEdadById = async (req, res) => {
  try {
    const { id } = req.params;

    const rango = await RangoEdad.findById(id);
    if (!rango) {
      return res.status(404).json({
        success: false,
        message: "Rango de edad no encontrado"
      });
    }

    res.status(200).json({
      success: true,
      data: rango
    });
  } catch (error) {
    console.error("Error al obtener rango de edad:", error);
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

export const updateRangoEdad = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_range, edad_minima, edad_maxima, active } = req.body;

    const rangoActualizado = await RangoEdad.findByIdAndUpdate(
      id,
      { nombre_range, edad_minima, edad_maxima, active },
      { new: true, runValidators: true }
    );

    if (!rangoActualizado) {
      return res.status(404).json({
        success: false,
        message: "Rango de edad no encontrado"
      });
    }

    res.status(200).json({
      success: true,
      message: "Rango de edad actualizado exitosamente",
      data: rangoActualizado
    });
  } catch (error) {
    console.error("Error al actualizar rango de edad:", error);
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

export const deleteRangoEdad = async (req, res) => {
  try {
    const { id } = req.params;

    const rangoEliminado = await RangoEdad.findByIdAndDelete(id);

    if (!rangoEliminado) {
      return res.status(404).json({
        success: false,
        message: "Rango de edad no encontrado"
      });
    }

    res.status(200).json({
      success: true,
      message: "Rango de edad eliminado exitosamente",
      data: rangoEliminado
    });
  } catch (error) {
    console.error("Error al eliminar rango de edad:", error);
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

export const toggleRangoEdad = async (req, res) => {
  try {
    const { id } = req.params;

    const rango = await RangoEdad.findById(id);
    if (!rango) {
      return res.status(404).json({
        success: false,
        message: "Rango de edad no encontrado"
      });
    }

    rango.active = !rango.active;
    const rangoActualizado = await rango.save();

    res.status(200).json({
      success: true,
      message: `Rango de edad ${rangoActualizado.active ? 'activado' : 'desactivado'} exitosamente`,
      data: rangoActualizado
    });
  } catch (error) {
    console.error("Error al cambiar estado del rango de edad:", error);
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