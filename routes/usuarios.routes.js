import express from 'express';
import { body, param } from 'express-validator';
import * as usuariosController from '../controllers/usuarios.controller.js';
import { autenticacion, verificarRoles } from '../middleware/autenticacion.js';

const router = express.Router();

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email invalido'),
    body('password').isLength({ min: 6 }).withMessage('La contrasena debe tener al menos 6 caracteres')
  ],
  usuariosController.login
);

router.get('/roles', autenticacion, usuariosController.listarRoles);

router.get('/', autenticacion, verificarRoles('administrador'), usuariosController.obtenerTodos);
router.get('/:id', autenticacion, usuariosController.obtenerPorId);

router.post(
  '/',
  [
    body('email').isEmail().withMessage('Email invalido'),
    body('password').isLength({ min: 6 }).withMessage('La contrasena debe tener al menos 6 caracteres'),
    body('nombre').notEmpty().withMessage('El nombre es requerido'),
    body('apellido').notEmpty().withMessage('El apellido es requerido'),
    body('rol').isIn(['administrador', 'mesero', 'cocinero']).withMessage('Rol invalido'),
    body('tipo_documento_id').optional().isInt({ min: 1 }).withMessage('tipo_documento_id invalido')
  ],
  usuariosController.crear
);

router.put(
  '/:id',
  autenticacion,
  verificarRoles('administrador'),
  [
    param('id').isInt({ min: 1 }).withMessage('ID invalido'),
    body('nombre').notEmpty().withMessage('El nombre es requerido'),
    body('apellido').notEmpty().withMessage('El apellido es requerido'),
    body('rol').isIn(['administrador', 'mesero', 'cocinero']).withMessage('Rol invalido'),
    body('tipo_documento_id').optional().isInt({ min: 1 }).withMessage('tipo_documento_id invalido'),
    body('email').optional().isEmail().withMessage('Email invalido'),
    body('password').optional().isLength({ min: 6 }).withMessage('La contrasena debe tener al menos 6 caracteres')
  ],
  usuariosController.actualizar
);

router.patch('/:id/activar', autenticacion, verificarRoles('administrador'), usuariosController.activar);
router.patch('/:id/inactivar', autenticacion, verificarRoles('administrador'), usuariosController.inactivar);

export default router;
