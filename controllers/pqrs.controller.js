import { validationResult } from 'express-validator';
import * as pqrsService from '../services/pqrs.service.js';

// ─── Tipos ────────────────────────────────────────────────────────────────────

export const listarTipos = async (_req, res) => {
  try {
    const datos = await pqrsService.listarTipos();
    res.status(200).json({ exito: true, datos });
  } catch (error) {
    res.status(500).json({ exito: false, error: error.message });
  }
};

// ─── Registros ────────────────────────────────────────────────────────────────

export const listarPqrs = async (req, res) => {
  try {
    const { estado, tipo, page = 1, limit = 20 } = req.query;
    const resultado = await pqrsService.listarPqrs({ estado, tipo, page, limit });
    res.status(200).json({ exito: true, ...resultado });
  } catch (error) {
    res.status(500).json({ exito: false, error: error.message });
  }
};

export const obtenerPqrs = async (req, res) => {
  try {
    const registro = await pqrsService.obtenerPqrsPorId(Number(req.params.id));
    if (!registro) {
      return res.status(404).json({ exito: false, error: 'PQRS no encontrada' });
    }
    res.status(200).json({ exito: true, datos: registro });
  } catch (error) {
    res.status(500).json({ exito: false, error: error.message });
  }
};

export const crearPqrs = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ exito: false, errores: errors.array() });
    }

    const nuevo = await pqrsService.crearPqrs({
      id_TipoPQRSF: Number(req.body.id_TipoPQRSF),
      nombre_cliente: req.body.nombre_cliente.trim(),
      apellido_cliente: req.body.apellido_cliente.trim(),
      email_cliente: req.body.email_cliente.trim().toLowerCase(),
      telefono_cliente: req.body.telefono_cliente?.trim() || null,
      asunto: req.body.asunto.trim(),
      mensaje: req.body.mensaje.trim()
    });

    res.status(201).json({ exito: true, mensaje: 'PQRS registrada exitosamente', datos: nuevo });
  } catch (error) {
    res.status(500).json({ exito: false, error: error.message });
  }
};

export const actualizarPqrs = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ exito: false, errores: errors.array() });
    }

    const existente = await pqrsService.obtenerPqrsPorId(Number(req.params.id));
    if (!existente) {
      return res.status(404).json({ exito: false, error: 'PQRS no encontrada' });
    }

    const actualizado = await pqrsService.actualizarPqrs(Number(req.params.id), {
      id_TipoPQRSF: Number(req.body.id_TipoPQRSF),
      nombre_cliente: req.body.nombre_cliente.trim(),
      apellido_cliente: req.body.apellido_cliente.trim(),
      email_cliente: req.body.email_cliente.trim().toLowerCase(),
      telefono_cliente: req.body.telefono_cliente?.trim() || null,
      asunto: req.body.asunto.trim(),
      mensaje: req.body.mensaje.trim()
    });

    if (!actualizado) {
      return res.status(409).json({
        exito: false,
        error: 'Solo se pueden editar PQRS en estado PENDIENTE'
      });
    }

    res.status(200).json({ exito: true, mensaje: 'PQRS actualizada', datos: actualizado });
  } catch (error) {
    res.status(500).json({ exito: false, error: error.message });
  }
};

export const cambiarEstado = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ exito: false, errores: errors.array() });
    }

    const existente = await pqrsService.obtenerPqrsPorId(Number(req.params.id));
    if (!existente) {
      return res.status(404).json({ exito: false, error: 'PQRS no encontrada' });
    }

    const actualizado = await pqrsService.cambiarEstadoPqrs(Number(req.params.id), {
      estado: req.body.estado,
      respuesta: req.body.respuesta?.trim() || null,
      atendido_por: req.usuario?.id || null
    });

    res.status(200).json({ exito: true, mensaje: 'Estado actualizado', datos: actualizado });
  } catch (error) {
    res.status(400).json({ exito: false, error: error.message });
  }
};

export const eliminarPqrs = async (req, res) => {
  try {
    const eliminado = await pqrsService.eliminarPqrs(Number(req.params.id));
    if (!eliminado) {
      return res.status(404).json({ exito: false, error: 'PQRS no encontrada' });
    }
    res.status(200).json({ exito: true, mensaje: 'PQRS eliminada', datos: eliminado });
  } catch (error) {
    res.status(500).json({ exito: false, error: error.message });
  }
};
