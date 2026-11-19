
import fs from 'node:fs';
import path from 'node:path';
import { validationResult } from 'express-validator';
import * as platillosService from '../services/platillos.service.js';

const platillosUploadDir = path.resolve('uploads', 'platillos');

const resolveExistingImageUrl = (imageInput) => {
  if (!imageInput || typeof imageInput !== 'string') return null;

  const trimmedValue = imageInput.trim();
  if (!trimmedValue) return null;

  const normalizedInput = trimmedValue.replace(/\\/g, '/');
  const fileName = path.basename(normalizedInput);
  const resolvedPath = path.join(platillosUploadDir, fileName);

  if (!fs.existsSync(resolvedPath)) {
    throw new Error(
      `La imagen ${fileName} no existe en uploads/platillos`
    );
  }

  return `/uploads/platillos/${fileName}`;
};

export const listarPlatillos = async (_req, res) => {
  try {
    const platillos = await platillosService.listarPlatillos();
    return res.status(200).json({
      exito: true,
      datos: platillos
    });
  } catch (error) {
    return res.status(500).json({
      exito: false,
      error: error.message
    });
  }
};

export const crearPlatillo = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        exito: false,
        errores: errors.array()
      });
    }

    const imagenExistente =
      req.body.imagen_nombre || req.body.imagen_url || null;

    const imagenUrl = req.file
      ? `/uploads/platillos/${req.file.filename}`
      : resolveExistingImageUrl(imagenExistente);

    const nuevo = await platillosService.crearPlatillo({
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      precio: Number(req.body.precio),
      categoriaId: req.body.categoria_id
        ? Number(req.body.categoria_id)
        : null,
      imagenUrl
    });

    return res.status(201).json({
      exito: true,
      mensaje: 'Platillo creado',
      datos: nuevo
    });
  } catch (error) {
    return res.status(400).json({
      exito: false,
      error: error.message
    });
  }
};

export const actualizarPlatillo = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        exito: false,
        errores: errors.array()
      });
    }

    const id = Number(req.params.id);
    const anterior = await platillosService.obtenerPlatilloPorId(id);

    if (!anterior || Number(anterior.activo) !== 1) {
      return res.status(404).json({
        exito: false,
        error: 'Platillo no encontrado'
      });
    }

    const imagenExistente =
      req.body.imagen_nombre || req.body.imagen_url || null;

    const imagenUrl = req.file
      ? `/uploads/platillos/${req.file.filename}`
      : imagenExistente
        ? resolveExistingImageUrl(imagenExistente)
        : anterior.imagen_url;

    const actualizado = await platillosService.actualizarPlatillo(id, {
      nombre: req.body.nombre || anterior.nombre,
      descripcion: req.body.descripcion ?? anterior.descripcion,
      precio: req.body.precio !== undefined
        ? Number(req.body.precio)
        : Number(anterior.precio),
      categoriaId: req.body.categoria_id
        ? Number(req.body.categoria_id)
        : anterior.categoria_id,
      imagenUrl,
      activo: 1
    });

    if (!actualizado) {
      return res.status(404).json({
        exito: false,
        error: 'Platillo no encontrado'
      });
    }

    return res.status(200).json({
      exito: true,
      mensaje: 'Platillo actualizado',
      datos: actualizado
    });
  } catch (error) {
    return res.status(400).json({
      exito: false,
      error: error.message
    });
  }
};

// ELIMINAR DEL CATÁLOGO SIN BORRAR PEDIDOS HISTÓRICOS
export const eliminarPlatillo = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        exito: false,
        errores: errors.array()
      });
    }

    const eliminado = await platillosService.eliminarPlatillo(
      Number(req.params.id)
    );

    if (!eliminado) {
      return res.status(404).json({
        exito: false,
        error: 'Producto no encontrado o ya eliminado'
      });
    }

    return res.status(200).json({
      exito: true,
      mensaje: 'Producto eliminado correctamente del catálogo'
    });
  } catch (error) {
    return res.status(500).json({
      exito: false,
      error: error.message
    });
  }
};
