
import express from 'express';
import { body, param } from 'express-validator';
import * as platillosController from '../controllers/platillos.controller.js';
import { autenticacion, verificarRoles } from '../middleware/autenticacion.js';
import { uploadPlatilloImage } from '../middleware/upload.js';

const router = express.Router();

router.get('/', platillosController.listarPlatillos);

router.post(
  '/',
  autenticacion,
  verificarRoles('administrador', 'cocinero'),
  uploadPlatilloImage.single('imagen'),
  [
    body('nombre').notEmpty().withMessage('El nombre es requerido'),
    body('precio').isFloat({ min: 0 }).withMessage('Precio inválido'),
    body('categoria_id').optional().isInt({ min: 1 }),
    body('imagen_nombre').optional().isString(),
    body('imagen_url').optional().isString()
  ],
  platillosController.crearPlatillo
);

router.put(
  '/:id',
  autenticacion,
  verificarRoles('administrador', 'cocinero'),
  uploadPlatilloImage.single('imagen'),
  [
    param('id').isInt({ min: 1 }).withMessage('ID inválido'),
    body('nombre').optional().notEmpty(),
    body('precio').optional().isFloat({ min: 0 }),
    body('categoria_id').optional().isInt({ min: 1 }),
    body('activo').optional().isInt({ min: 0, max: 1 }),
    body('imagen_nombre').optional().isString(),
    body('imagen_url').optional().isString()
  ],
  platillosController.actualizarPlatillo
);

router.delete(
  '/:id',
  autenticacion,
  verificarRoles('administrador'),
  [
    param('id').isInt({ min: 1 }).withMessage('ID inválido')
  ],
  platillosController.eliminarPlatillo
);

export default router;
