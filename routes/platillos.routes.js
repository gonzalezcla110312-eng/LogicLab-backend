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
    body('precio').isFloat({ min: 0 }).withMessage('Precio invalido'),
    body('categoria_id').optional().isInt({ min: 1 }).withMessage('categoria_id invalido'),
    body('imagen_nombre').optional().isString().withMessage('imagen_nombre invalido'),
    body('imagen_url').optional().isString().withMessage('imagen_url invalida')
  ],
  platillosController.crearPlatillo
);

router.put(
  '/:id',
  autenticacion,
  verificarRoles('administrador', 'cocinero'),
  uploadPlatilloImage.single('imagen'),
  [
    param('id').isInt({ min: 1 }).withMessage('ID invalido'),
    body('nombre').notEmpty().withMessage('El nombre es requerido'),
    body('precio').isFloat({ min: 0 }).withMessage('Precio invalido'),
    body('categoria_id').optional().isInt({ min: 1 }).withMessage('categoria_id invalido'),
    body('activo').isInt({ min: 0, max: 1 }).withMessage('activo debe ser 0 o 1'),
    body('imagen_nombre').optional().isString().withMessage('imagen_nombre invalido'),
    body('imagen_url').optional().isString().withMessage('imagen_url invalida')
  ],
  platillosController.actualizarPlatillo
);

export default router;
