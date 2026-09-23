import express from 'express';
import { body, param, query } from 'express-validator';

import * as reservacionesController from '../controllers/reservaciones.controller.js';

import {
  autenticacion,
  verificarRoles
} from '../middleware/autenticacion.js';

const router = express.Router();

/*
 * Todas las rutas de reservaciones requieren
 * que el usuario haya iniciado sesion.
 */
router.use(autenticacion);

/*
 * ============================================================
 * MESAS DISPONIBLES
 * ============================================================
 *
 * Permite consultar que mesas estan disponibles
 * para una fecha y hora determinadas.
 */
router.get(
  '/mesas-disponibles',
  verificarRoles('administrador', 'mesero'),
  [
    query('fecha')
      .isISO8601()
      .withMessage('La fecha debe tener formato YYYY-MM-DD'),

    query('hora')
      .matches(/^([01]\d|2[0-3]):[0-5]\d$/)
      .withMessage('La hora debe tener formato HH:mm')
  ],
  reservacionesController.listarMesasDisponibles
);

/*
 * ============================================================
 * LISTAR RESERVACIONES
 * ============================================================
 */
router.get(
  '/',
  verificarRoles('administrador', 'mesero'),
  reservacionesController.listarReservaciones
);

/*
 * ============================================================
 * OBTENER UNA RESERVACION
 * ============================================================
 */
router.get(
  '/:id',
  verificarRoles('administrador', 'mesero'),
  [
    param('id')
      .isInt({ min: 1 })
      .withMessage('ID de reservacion invalido')
  ],
  reservacionesController.obtenerReservacion
);

/*
 * ============================================================
 * CREAR RESERVACION
 * ============================================================
 */
router.post(
  '/',
  verificarRoles('administrador', 'mesero'),
  [
    body('mesa_id')
      .isInt({ min: 1 })
      .withMessage('La mesa es obligatoria'),

    body('nombre_cliente')
      .isString()
      .trim()
      .notEmpty()
      .withMessage('El nombre del cliente es obligatorio')
      .isLength({ max: 120 })
      .withMessage('El nombre del cliente es demasiado largo'),

    body('email_cliente')
      .optional({ values: 'falsy' })
      .isEmail()
      .withMessage('El correo electronico no es valido'),

    body('telefono_cliente')
      .optional({ values: 'falsy' })
      .isString()
      .isLength({ max: 30 })
      .withMessage('El telefono no es valido'),

    body('fecha')
      .isISO8601()
      .withMessage('La fecha debe tener formato YYYY-MM-DD'),

    body('hora')
      .matches(/^([01]\d|2[0-3]):[0-5]\d$/)
      .withMessage('La hora debe tener formato HH:mm'),

    body('personas')
      .isInt({ min: 1, max: 50 })
      .withMessage(
        'El numero de personas debe estar entre 1 y 50'
      ),

    body('observaciones')
      .optional({ values: 'falsy' })
      .isString()
      .isLength({ max: 255 })
      .withMessage(
        'Las observaciones son demasiado largas'
      )
  ],
  reservacionesController.crearReservacion
);

/*
 * ============================================================
 * ACTUALIZAR RESERVACION
 * ============================================================
 */
router.put(
  '/:id',
  verificarRoles('administrador', 'mesero'),
  [
    param('id')
      .isInt({ min: 1 })
      .withMessage('ID de reservacion invalido'),

    body('mesa_id')
      .isInt({ min: 1 })
      .withMessage('La mesa es obligatoria'),

    body('nombre_cliente')
      .isString()
      .trim()
      .notEmpty()
      .withMessage('El nombre del cliente es obligatorio')
      .isLength({ max: 120 })
      .withMessage('El nombre del cliente es demasiado largo'),

    body('email_cliente')
      .optional({ values: 'falsy' })
      .isEmail()
      .withMessage('El correo electronico no es valido'),

    body('telefono_cliente')
      .optional({ values: 'falsy' })
      .isString()
      .isLength({ max: 30 })
      .withMessage('El telefono no es valido'),

    body('fecha')
      .isISO8601()
      .withMessage('La fecha debe tener formato YYYY-MM-DD'),

    body('hora')
      .matches(/^([01]\d|2[0-3]):[0-5]\d$/)
      .withMessage('La hora debe tener formato HH:mm'),

    body('personas')
      .isInt({ min: 1, max: 50 })
      .withMessage(
        'El numero de personas debe estar entre 1 y 50'
      ),

    body('observaciones')
      .optional({ values: 'falsy' })
      .isString()
      .isLength({ max: 255 })
      .withMessage(
        'Las observaciones son demasiado largas'
      )
  ],
  reservacionesController.actualizarReservacion
);

/*
 * ============================================================
 * CAMBIAR ESTADO
 * ============================================================
 *
 * Estados permitidos:
 * PENDIENTE
 * CONFIRMADA
 * CANCELADA
 * ATENDIDA
 */
router.patch(
  '/:id/estado',
  verificarRoles('administrador', 'mesero'),
  [
    param('id')
      .isInt({ min: 1 })
      .withMessage('ID de reservacion invalido'),

    body('estado')
      .isIn([
        'PENDIENTE',
        'CONFIRMADA',
        'CANCELADA',
        'ATENDIDA'
      ])
      .withMessage('Estado de reservacion invalido')
  ],
  reservacionesController.cambiarEstadoReservacion
);

export default router;