import { validationResult } from 'express-validator';
import * as reservacionesService from '../services/reservaciones.service.js';

export const listarReservaciones = async (_req, res) => {
  try {
    const reservaciones =
      await reservacionesService.listarReservaciones();

    res.status(200).json({
      exito: true,
      datos: reservaciones
    });
  } catch (error) {
    res.status(500).json({
      exito: false,
      error: error.message
    });
  }
};

export const obtenerReservacion = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({
        exito: false,
        error: 'ID de reservacion invalido'
      });
    }

    const reservacion =
      await reservacionesService.obtenerReservacionPorId(id);

    if (!reservacion) {
      return res.status(404).json({
        exito: false,
        error: 'Reservacion no encontrada'
      });
    }

    res.status(200).json({
      exito: true,
      datos: reservacion
    });
  } catch (error) {
    res.status(500).json({
      exito: false,
      error: error.message
    });
  }
};

export const listarMesasDisponibles = async (req, res) => {
  try {
    const { fecha, hora } = req.query;

    const mesas =
      await reservacionesService.listarMesasDisponibles({
        fecha,
        hora
      });

    res.status(200).json({
      exito: true,
      datos: mesas
    });
  } catch (error) {
    res.status(400).json({
      exito: false,
      error: error.message
    });
  }
};

export const crearReservacion = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        exito: false,
        errores: errors.array()
      });
    }

    const reservacion =
      await reservacionesService.crearReservacion(req.body);

    res.status(201).json({
      exito: true,
      mensaje: 'Reservacion creada correctamente',
      datos: reservacion
    });
  } catch (error) {
    res.status(400).json({
      exito: false,
      error: error.message
    });
  }
};

export const actualizarReservacion = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        exito: false,
        errores: errors.array()
      });
    }

    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({
        exito: false,
        error: 'ID de reservacion invalido'
      });
    }

    const reservacion =
      await reservacionesService.actualizarReservacion(
        id,
        req.body
      );

    if (!reservacion) {
      return res.status(404).json({
        exito: false,
        error: 'Reservacion no encontrada'
      });
    }

    res.status(200).json({
      exito: true,
      mensaje: 'Reservacion actualizada correctamente',
      datos: reservacion
    });
  } catch (error) {
    res.status(400).json({
      exito: false,
      error: error.message
    });
  }
};

export const cambiarEstadoReservacion = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        exito: false,
        errores: errors.array()
      });
    }

    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({
        exito: false,
        error: 'ID de reservacion invalido'
      });
    }

    const reservacion =
      await reservacionesService.cambiarEstadoReservacion(
        id,
        req.body.estado
      );

    if (!reservacion) {
      return res.status(404).json({
        exito: false,
        error: 'Reservacion no encontrada'
      });
    }

    res.status(200).json({
      exito: true,
      mensaje: 'Estado de reservacion actualizado',
      datos: reservacion
    });
  } catch (error) {
    res.status(400).json({
      exito: false,
      error: error.message
    });
  }
};
