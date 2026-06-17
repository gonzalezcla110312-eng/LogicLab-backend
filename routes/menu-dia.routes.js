import express from 'express';
import { body, param, query } from 'express-validator';
import * as menuDiaController from '../controllers/menu-dia.controller.js';
import { autenticacion, verificarRoles } from '../middleware/autenticacion.js';

const router = express.Router();

router.get(
  '/hoy',
  menuDiaController.obtenerMenuDiaHoy
);

router.get(
  '/',
  [
    query('desde').optional().isISO8601().withMessage('desde debe tener formato YYYY-MM-DD'),
    query('hasta').optional().isISO8601().withMessage('hasta debe tener formato YYYY-MM-DD')
  ],
  menuDiaController.listarMenusDia
);

router.get(
  '/:fecha',
  [param('fecha').isISO8601().withMessage('La fecha debe tener formato YYYY-MM-DD')],
  menuDiaController.obtenerMenuDiaPorFecha
);

router.put(
  '/:fecha',
  autenticacion,
  verificarRoles('administrador', 'cocinero'),
  [
    param('fecha').isISO8601().withMessage('La fecha debe tener formato YYYY-MM-DD'),
    body('publicado')
      .optional()
      .custom((value) => {
        if (typeof value === 'boolean') {
          return true;
        }

        if (value === 0 || value === 1 || value === '0' || value === '1') {
          return true;
        }

        if (typeof value === 'string') {
          const normalizedValue = value.trim().toLowerCase();
          if (normalizedValue === 'true' || normalizedValue === 'false') {
            return true;
          }
        }

        throw new Error('publicado debe ser 0, 1, true o false');
      }),
    body('items').isArray({ min: 1 }).withMessage('Debe enviar al menos un item'),
    body('items.*.platillo_id').isInt({ min: 1 }).withMessage('platillo_id invalido'),
    body('items.*.orden').optional().isInt({ min: 1 }).withMessage('orden invalido')
  ],
  menuDiaController.upsertMenuDia
);

router.delete(
  '/limpiar',
  autenticacion,
  verificarRoles('administrador', 'cocinero'),
  [
    query('desde').optional().isISO8601().withMessage('desde debe tener formato YYYY-MM-DD'),
    query('hasta').optional().isISO8601().withMessage('hasta debe tener formato YYYY-MM-DD')
  ],
  menuDiaController.limpiarMenusDia
);

export default router;