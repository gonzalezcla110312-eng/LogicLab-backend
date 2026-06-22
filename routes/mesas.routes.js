import express from 'express';
import { body, param } from 'express-validator';
import * as mesasController from '../controllers/mesas.controller.js';
import { autenticacion, verificarRoles } from '../middleware/autenticacion.js';

const router = express.Router();

router.use(autenticacion);

router.get('/', mesasController.listarMesas);
router.get('/pedidos', mesasController.listarPedidos);
router.get('/pedidos/activos/cocina', verificarRoles('administrador', 'cocinero'), mesasController.listarPedidosActivosCocina);
router.get('/pedidos/listos-recoger', verificarRoles('administrador', 'mesero', 'cocinero'), mesasController.listarPedidosListosParaRecoger);
router.get(
  '/:id/pedido-activo',
  verificarRoles('administrador', 'mesero'),
  [param('id').isInt({ min: 1 }).withMessage('ID de mesa invalido')],
  mesasController.obtenerPedidoActivoMesa
);

router.post(
  '/',
  verificarRoles('administrador', 'mesero'),
  [
    body('numero').isInt({ min: 1 }).withMessage('El numero de mesa es requerido'),
    body('estado').optional().isIn(['LIBRE', 'OCUPADA', 'INACTIVA']).withMessage('Estado invalido')
  ],
  mesasController.crearMesa
);

router.put(
  '/:id',
  verificarRoles('administrador', 'mesero'),
  [
    param('id').isInt({ min: 1 }).withMessage('ID invalido'),
    body('numero').isInt({ min: 1 }).withMessage('El numero de mesa es requerido'),
    body('estado').isIn(['LIBRE', 'OCUPADA', 'INACTIVA']).withMessage('Estado invalido'),
    body('activa').isInt({ min: 0, max: 1 }).withMessage('Activa debe ser 0 o 1')
  ],
  mesasController.actualizarMesa
);

router.patch(
  '/:id/liberar',
  verificarRoles('administrador', 'mesero'),
  [param('id').isInt({ min: 1 }).withMessage('ID invalido')],
  mesasController.liberarMesa
);

router.post(
  '/:id/pedidos',
  verificarRoles('administrador', 'mesero'),
  [
    param('id').isInt({ min: 1 }).withMessage('ID de mesa invalido'),
    body('usuario_id').isInt({ min: 1 }).withMessage('usuario_id invalido'),
    body('items').isArray({ min: 1 }).withMessage('Debe enviar al menos un item'),
    body('items.*.platillo_id').isInt({ min: 1 }).withMessage('platillo_id invalido'),
    body('items.*.cantidad').isInt({ min: 1 }).withMessage('cantidad invalida')
  ],
  mesasController.crearPedido
);

router.get(
  '/pedidos/:pedidoId',
  verificarRoles('administrador', 'mesero', 'cocinero'),
  [param('pedidoId').isInt({ min: 1 }).withMessage('pedidoId invalido')],
  mesasController.obtenerPedidoPorId
);

router.patch(
  '/pedidos/:pedidoId/estado',
  verificarRoles('administrador', 'mesero', 'cocinero'),
  [
    param('pedidoId').isInt({ min: 1 }).withMessage('pedidoId invalido'),
    body('estado').isIn(['COCINANDO', 'PARA_ENTREGA', 'ENTREGADO', 'PAGADO', 'CERRADO', 'CANCELADO']).withMessage('estado invalido')
  ],
  mesasController.actualizarEstadoPedido
);

router.put(
  '/pedidos/:pedidoId',
  verificarRoles('administrador', 'mesero'),
  [
    param('pedidoId').isInt({ min: 1 }).withMessage('pedidoId invalido'),
    body('items').isArray({ min: 1 }).withMessage('Debe enviar al menos un item'),
    body('items.*.platillo_id').isInt({ min: 1 }).withMessage('platillo_id invalido'),
    body('items.*.cantidad').isInt({ min: 1 }).withMessage('cantidad invalida'),
    body('items.*.notas').optional().isString().isLength({ max: 255 }).withMessage('notas invalida')
  ],
  mesasController.actualizarPedidoActivo
);

router.patch(
  '/pedidos/:pedidoId/entregar',
  verificarRoles('administrador', 'cocinero'),
  [param('pedidoId').isInt({ min: 1 }).withMessage('pedidoId invalido')],
  mesasController.marcarPedidoEntregadoCocina
);

export default router;
