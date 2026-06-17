import express from 'express';
import { query } from 'express-validator';
import * as dashboardAdminController from '../controllers/dashboard-admin.controller.js';
import { autenticacion, verificarRoles } from '../middleware/autenticacion.js';

const router = express.Router();

router.use(autenticacion);
router.use(verificarRoles('administrador'));

const dateRangeValidators = [
  query('desde').optional().isISO8601().withMessage('desde debe tener formato YYYY-MM-DD'),
  query('hasta').optional().isISO8601().withMessage('hasta debe tener formato YYYY-MM-DD')
];

router.get('/estadisticas', dateRangeValidators, dashboardAdminController.obtenerEstadisticas);
router.get('/ingresos', dateRangeValidators, dashboardAdminController.obtenerIngresos);
router.get('/tendencia-pedidos', dateRangeValidators, dashboardAdminController.obtenerTendenciaPedidos);
router.get('/mesas-ocupadas', dashboardAdminController.obtenerMesasOcupadas);
router.get(
  '/resumen',
  [
    ...dateRangeValidators,
    query('top_limit').optional().isInt({ min: 1, max: 50 }).withMessage('top_limit debe estar entre 1 y 50'),
    query('alertas_minutos').optional().isInt({ min: 1 }).withMessage('alertas_minutos debe ser mayor a 0'),
    query('alertas_limit').optional().isInt({ min: 1, max: 100 }).withMessage('alertas_limit debe estar entre 1 y 100')
  ],
  dashboardAdminController.obtenerResumenDashboard
);
router.get(
  '/platillos-top',
  [
    ...dateRangeValidators,
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('limit debe estar entre 1 y 50')
  ],
  dashboardAdminController.obtenerPlatillosTop
);
router.get(
  '/alertas-pedidos',
  [
    query('minutos').optional().isInt({ min: 1 }).withMessage('minutos debe ser mayor a 0'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit debe estar entre 1 y 100')
  ],
  dashboardAdminController.obtenerAlertasPedidos
);

export default router;
