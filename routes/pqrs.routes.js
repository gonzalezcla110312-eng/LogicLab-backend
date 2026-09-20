import express from 'express';
import { body, param, query } from 'express-validator';
import * as pqrsController from '../controllers/pqrs.controller.js';
import { autenticacion, verificarRoles } from '../middleware/autenticacion.js';

const router = express.Router();

const ESTADOS_VALIDOS = ['PENDIENTE', 'EN_PROCESO', 'RESUELTO', 'CERRADO'];

// ─── Tipos de PQRSF (públicos) ────────────────────────────────────────────────
router.get('/tipos', pqrsController.listarTipos);

// ─── Listar y Obtener (solo admin) ────────────────────────────────────────────
router.get(
  '/',
  autenticacion,
  verificarRoles('administrador'),
  [
    query('estado').optional().isIn(ESTADOS_VALIDOS).withMessage(`estado debe ser uno de: ${ESTADOS_VALIDOS.join(', ')}`),
    query('tipo').optional().isString().trim(),
    query('page').optional().isInt({ min: 1 }).withMessage('page debe ser entero positivo'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit debe ser entre 1 y 100')
  ],
  pqrsController.listarPqrs
);

router.get(
  '/:id',
  autenticacion,
  verificarRoles('administrador'),
  [param('id').isInt({ min: 1 }).withMessage('ID invalido')],
  pqrsController.obtenerPqrs
);

// ─── Crear (público - el solicitante NO está en la tabla usuarios) ─────────────
router.post(
  '/',
  [
    body('id_TipoPQRSF').isInt({ min: 1 }).withMessage('Tipo de PQRS invalido'),
    body('nombre_cliente').notEmpty().trim().withMessage('El nombre es requerido'),
    body('apellido_cliente').notEmpty().trim().withMessage('El apellido es requerido'),
    body('email_cliente').isEmail().withMessage('Email invalido'),
    body('telefono_cliente').optional({ nullable: true }).isString().trim(),
    body('asunto').notEmpty().trim().isLength({ max: 255 }).withMessage('El asunto es requerido (max 255 caracteres)'),
    body('mensaje').notEmpty().trim().isLength({ min: 10 }).withMessage('El mensaje es requerido (minimo 10 caracteres)')
  ],
  pqrsController.crearPqrs
);

// ─── Actualizar datos (solo admin, solo si está PENDIENTE) ────────────────────
router.put(
  '/:id',
  autenticacion,
  verificarRoles('administrador'),
  [
    param('id').isInt({ min: 1 }).withMessage('ID invalido'),
    body('id_TipoPQRSF').isInt({ min: 1 }).withMessage('Tipo de PQRS invalido'),
    body('nombre_cliente').notEmpty().trim().withMessage('El nombre es requerido'),
    body('apellido_cliente').notEmpty().trim().withMessage('El apellido es requerido'),
    body('email_cliente').isEmail().withMessage('Email invalido'),
    body('telefono_cliente').optional({ nullable: true }).isString().trim(),
    body('asunto').notEmpty().trim().isLength({ max: 255 }).withMessage('El asunto es requerido'),
    body('mensaje').notEmpty().trim().isLength({ min: 10 }).withMessage('El mensaje es requerido')
  ],
  pqrsController.actualizarPqrs
);

// ─── Cambiar estado y registrar respuesta (solo admin) ────────────────────────
router.patch(
  '/:id/estado',
  autenticacion,
  verificarRoles('administrador'),
  [
    param('id').isInt({ min: 1 }).withMessage('ID invalido'),
    body('estado').isIn(ESTADOS_VALIDOS).withMessage(`estado debe ser uno de: ${ESTADOS_VALIDOS.join(', ')}`),
    body('respuesta').optional({ nullable: true }).isString().trim()
  ],
  pqrsController.cambiarEstado
);

// ─── Eliminar (solo admin) ────────────────────────────────────────────────────
router.delete(
  '/:id',
  autenticacion,
  verificarRoles('administrador'),
  [param('id').isInt({ min: 1 }).withMessage('ID invalido')],
  pqrsController.eliminarPqrs
);

export default router;
