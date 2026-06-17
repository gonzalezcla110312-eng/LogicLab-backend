import { validationResult } from 'express-validator';
import * as menuDiaService from '../services/menu-dia.service.js';

const getTodayDate = () => {
  const now = new Date();
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
};

const normalizePublicado = (value) => {
  if (value === undefined) {
    return 1;
  }

  if (typeof value === 'boolean') {
    return value ? 1 : 0;
  }

  if (typeof value === 'string') {
    const normalizedValue = value.trim().toLowerCase();
    if (normalizedValue === 'true') {
      return 1;
    }

    if (normalizedValue === 'false') {
      return 0;
    }
  }

  return Number(value);
};

export const upsertMenuDia = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ exito: false, errores: errors.array() });
    }

    const items = req.body.items || [];
    if (items.length === 0) {
      return res.status(400).json({ exito: false, error: 'Debe enviar al menos un item para el menu del dia' });
    }

    const menu = await menuDiaService.upsertMenuDia({
      fecha: req.params.fecha,
      publicado: normalizePublicado(req.body.publicado),
      createdBy: req.usuario?.id || null,
      items: items.map((item, index) => ({
        platillo_id: Number(item.platillo_id),
        orden: item.orden === undefined ? index + 1 : Number(item.orden)
      }))
    });

    res.status(200).json({
      exito: true,
      mensaje: menu.accion === 'created' ? 'Menu del dia creado' : 'Menu del dia actualizado',
      accion: menu.accion,
      datos: menu
    });
  } catch (error) {
    res.status(400).json({ exito: false, error: error.message });
  }
};

export const obtenerMenuDiaPorFecha = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ exito: false, errores: errors.array() });
    }

    const menu = await menuDiaService.obtenerMenuDiaPorFecha(req.params.fecha, { soloPublicados: true });
    if (!menu) {
      return res.status(404).json({ exito: false, error: 'Menu del dia no encontrado para la fecha indicada' });
    }

    res.status(200).json({ exito: true, datos: menu });
  } catch (error) {
    res.status(500).json({ exito: false, error: error.message });
  }
};

export const obtenerMenuDiaHoy = async (_req, res) => {
  try {
    const menu = await menuDiaService.obtenerMenuDiaPorFecha(getTodayDate(), { soloPublicados: true });
    if (!menu) {
      return res.status(404).json({ exito: false, error: 'No hay menu del dia publicado para hoy' });
    }

    res.status(200).json({ exito: true, datos: menu });
  } catch (error) {
    res.status(500).json({ exito: false, error: error.message });
  }
};

export const listarMenusDia = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ exito: false, errores: errors.array() });
    }

    const menus = await menuDiaService.listarMenusDia({
      desde: req.query.desde,
      hasta: req.query.hasta,
      soloPublicados: true
    });

    res.status(200).json({ exito: true, datos: menus });
  } catch (error) {
    res.status(500).json({ exito: false, error: error.message });
  }
};

export const limpiarMenusDia = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ exito: false, errores: errors.array() });
    }

    const { desde, hasta } = req.query;
    const resultado = await menuDiaService.limpiarMenusDia({ desde, hasta });
    res.status(200).json({
      exito: true,
      mensaje: `Se eliminaron ${resultado.eliminados} menú(es) del día`,
      datos: resultado
    });
  } catch (error) {
    res.status(500).json({ exito: false, error: error.message });
  }
};