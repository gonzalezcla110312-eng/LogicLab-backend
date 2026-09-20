import { validationResult } from 'express-validator';
import * as mesasService from '../services/mesas.service.js';
import * as pedidosService from '../services/pedidos.service.js';

export const listarMesas = async (_req, res) => {
  try {
    const mesas = await mesasService.listarMesas();
    res.status(200).json({ exito: true, datos: mesas });
  } catch (error) {
    res.status(500).json({ exito: false, error: error.message });
  }
};

export const crearMesa = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ exito: false, errores: errors.array() });
    }

    const mesa = await mesasService.crearMesa(req.body);
    res.status(201).json({ exito: true, mensaje: 'Mesa registrada', datos: mesa });
  } catch (error) {
    res.status(400).json({ exito: false, error: error.message });
  }
};

export const actualizarMesa = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ exito: false, errores: errors.array() });
    }

    const mesaId = Number(req.params.id);
    const mesa = await mesasService.actualizarMesa(mesaId, req.body);

    if (!mesa) {
      return res.status(404).json({ exito: false, error: 'Mesa no encontrada' });
    }

    res.status(200).json({ exito: true, mensaje: 'Mesa actualizada', datos: mesa });
  } catch (error) {
    res.status(400).json({ exito: false, error: error.message });
  }
};

export const liberarMesa = async (req, res) => {
  try {
    const mesaId = Number(req.params.id);
    if (!mesaId) {
      return res.status(400).json({ exito: false, error: 'ID de mesa invalido' });
    }

    const mesa = await mesasService.liberarMesa(mesaId);
    if (!mesa) {
      return res.status(404).json({ exito: false, error: 'Mesa no encontrada' });
    }

    res.status(200).json({ exito: true, mensaje: 'Mesa liberada manualmente', datos: mesa });
  } catch (error) {
    res.status(400).json({ exito: false, error: error.message });
  }
};

export const crearPedido = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ exito: false, errores: errors.array() });
    }

    const mesaId = Number(req.params.id);
    const pedido = await pedidosService.crearPedidoConDetalle({
      mesaId,
      usuarioId: Number(req.body.usuario_id),
      items: req.body.items
    });

    res.status(201).json({ exito: true, mensaje: 'Pedido creado correctamente', datos: pedido });
  } catch (error) {
    res.status(400).json({ exito: false, error: error.message });
  }
};

export const listarPedidos = async (_req, res) => {
  try {
    const pedidos = await pedidosService.listarPedidos();
    res.status(200).json({ exito: true, datos: pedidos });
  } catch (error) {
    res.status(500).json({ exito: false, error: error.message });
  }
};

export const listarPedidosActivosCocina = async (_req, res) => {
  try {
    const pedidos = await pedidosService.listarPedidosActivosCocina();
    res.status(200).json({ exito: true, datos: pedidos });
  } catch (error) {
    res.status(500).json({ exito: false, error: error.message });
  }
};

export const listarPedidosListosParaRecoger = async (_req, res) => {
  try {
    const pedidos = await pedidosService.listarPedidosListosParaRecoger();
    res.status(200).json({ exito: true, datos: pedidos });
  } catch (error) {
    res.status(500).json({ exito: false, error: error.message });
  }
};

export const obtenerPedidoActivoMesa = async (req, res) => {
  try {
    const mesaId = Number(req.params.id);
    if (!mesaId) {
      return res.status(400).json({ exito: false, error: 'ID de mesa invalido' });
    }

    const pedido = await pedidosService.obtenerPedidoActivoPorMesa(mesaId);
    if (!pedido) {
      return res.status(404).json({ exito: false, error: 'La mesa no tiene pedido activo' });
    }

    res.status(200).json({ exito: true, datos: pedido });
  } catch (error) {
    res.status(500).json({ exito: false, error: error.message });
  }
};

export const obtenerPedidoPorId = async (req, res) => {
  try {
    const pedidoId = Number(req.params.pedidoId);
    if (!pedidoId) {
      return res.status(400).json({ exito: false, error: 'pedidoId invalido' });
    }

    const pedido = await pedidosService.obtenerPedidoPorId(pedidoId);
    if (!pedido) {
      return res.status(404).json({ exito: false, error: 'Pedido no encontrado' });
    }

    res.status(200).json({ exito: true, datos: pedido });
  } catch (error) {
    res.status(500).json({ exito: false, error: error.message });
  }
};

export const actualizarEstadoPedido = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ exito: false, errores: errors.array() });
    }

    const pedidoId = Number(req.params.pedidoId);
    const { estado } = req.body;

    const pedido = await pedidosService.cambiarEstadoPedidoYLiberarMesa(pedidoId, estado);
    if (!pedido) {
      return res.status(404).json({ exito: false, error: 'Pedido no encontrado' });
    }

    const mensaje = ['PAGADO', 'CANCELADO'].includes(estado)
      ? `Pedido marcado como ${estado} y mesa liberada`
      : `Estado de pedido actualizado a ${estado}`;

    res.status(200).json({ exito: true, mensaje, datos: pedido });
  } catch (error) {
    res.status(400).json({ exito: false, error: error.message });
  }
};

export const actualizarPedidoActivo = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ exito: false, errores: errors.array() });
    }

    const pedidoId = Number(req.params.pedidoId);
    const pedido = await pedidosService.actualizarPedidoActivo(pedidoId, req.body.items);

    if (!pedido) {
      return res.status(404).json({ exito: false, error: 'Pedido no encontrado' });
    }

    res.status(200).json({ exito: true, mensaje: 'Pedido activo actualizado', datos: pedido });
  } catch (error) {
    res.status(400).json({ exito: false, error: error.message });
  }
};

export const marcarPedidoEntregadoCocina = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ exito: false, errores: errors.array() });
    }

    const pedidoId = Number(req.params.pedidoId);
    const pedido = await pedidosService.marcarPedidoEntregadoPorCocina(pedidoId);

    if (!pedido) {
      return res.status(404).json({ exito: false, error: 'Pedido no encontrado' });
    }

    res.status(200).json({ exito: true, mensaje: `Pedido actualizado por cocina a estado ${pedido.estado}`, datos: pedido });
  } catch (error) {
    res.status(400).json({ exito: false, error: error.message });
  }
};
