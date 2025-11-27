import express from 'express';
import * as subcategoriaController from './subcategoria.controller.js';

const router = express.Router();

// POST - Crear múltiples subcategorías
router.post('/multiples', subcategoriaController.crearMultiples);

// GET - Obtener todas las subcategorías
router.get('/', subcategoriaController.obtenerTodas);

// GET - Obtener subcategorías por categoría
router.get('/categoria/:idCategoria', subcategoriaController.obtenerPorCategoria);

// GET - Obtener una subcategoría por ID
router.get('/:id', subcategoriaController.obtenerPorId);

// POST - Crear una subcategoría
router.post('/', subcategoriaController.crear);

// PUT - Actualizar una subcategoría
router.put('/:id', subcategoriaController.actualizar);

// DELETE - Eliminar una subcategoría
router.delete('/:id', subcategoriaController.eliminar);

export default router;