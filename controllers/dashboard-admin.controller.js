import { validationResult } from 'express-validator';
import * as dashboardAdminService from '../services/dashboard-admin.service.js';

const parseNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const obtenerEstadisticas = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ exito: false, errores: errors.array() });
    }

    const data = await dashboardAdminService.obtenerEstadisticasGenerales({
      desde: req.query.desde,
      hasta: req.query.hasta
    });

    res.status(200).json({ exito: true, datos: data });
  } catch (error) {
    res.status(500).json({ exito: false, error: error.message });
  }
};

export const obtenerIngresos = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ exito: false, errores: errors.array() });
    }

    const data = await dashboardAdminService.obtenerIngresosResumen({
      desde: req.query.desde,
      hasta: req.query.hasta
    });

    res.status(200).json({ exito: true, datos: data });
  } catch (error) {
    res.status(500).json({ exito: false, error: error.message });
  }
};

export const obtenerTendenciaPedidos = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ exito: false, errores: errors.array() });
    }

    const data = await dashboardAdminService.obtenerTendenciaPedidos({
      desde: req.query.desde,
      hasta: req.query.hasta
    });

    res.status(200).json({ exito: true, datos: data });
  } catch (error) {
    res.status(500).json({ exito: false, error: error.message });
  }
};

export const obtenerPlatillosTop = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ exito: false, errores: errors.array() });
    }

    const data = await dashboardAdminService.obtenerPlatillosTop({
      desde: req.query.desde,
      hasta: req.query.hasta,
      limit: parseNumber(req.query.limit, 10)
    });

    res.status(200).json({ exito: true, datos: data });
  } catch (error) {
    res.status(500).json({ exito: false, error: error.message });
  }
};

export const obtenerAlertasPedidos = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ exito: false, errores: errors.array() });
    }

    const data = await dashboardAdminService.obtenerAlertasPedidos({
      minutos: parseNumber(req.query.minutos, 30),
      limit: parseNumber(req.query.limit, 20)
    });

    res.status(200).json({ exito: true, datos: data });
  } catch (error) {
    res.status(500).json({ exito: false, error: error.message });
  }
};

export const obtenerResumenDashboard = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ exito: false, errores: errors.array() });
    }

    const data = await dashboardAdminService.obtenerResumenDashboard({
      desde: req.query.desde,
      hasta: req.query.hasta,
      topLimit: parseNumber(req.query.top_limit, 10),
      alertasMinutos: parseNumber(req.query.alertas_minutos, 30),
      alertasLimit: parseNumber(req.query.alertas_limit, 20)
    });

    res.status(200).json({ exito: true, datos: data });
  } catch (error) {
    res.status(500).json({ exito: false, error: error.message });
  }
};

export const obtenerMesasOcupadas = async (_req, res) => {
  try {
    const data = await dashboardAdminService.obtenerMesasOcupadas();
    res.status(200).json({ exito: true, datos: data });
  } catch (error) {
    res.status(500).json({ exito: false, error: error.message });
  }
};
