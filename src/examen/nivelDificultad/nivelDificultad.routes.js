import express from 'express';
import * as nivelController from './nivelDificultad.controller.js';

const router = express.Router();

// POST - Crear múltiples niveles
router.post('/multiples', nivelController.crearMultiples);

// GET - Obtener todos los niveles
router.get('/', nivelController.obtenerTodos);

// GET - Obtener un nivel por ID
router.get('/:id', nivelController.obtenerPorId);

// POST - Crear un nivel
router.post('/', nivelController.crear);

// PUT - Actualizar un nivel
router.put('/:id', nivelController.actualizar);

// DELETE - Eliminar un nivel
router.delete('/:id', nivelController.eliminar);

export default router;