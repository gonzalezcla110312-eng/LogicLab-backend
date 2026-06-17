import fs from 'node:fs';
import path from 'node:path';
import { validationResult } from 'express-validator';
import * as platillosService from '../services/platillos.service.js';

const platillosUploadDir = path.resolve('uploads', 'platillos');

const resolveExistingImageUrl = (imageInput) => {
  if (!imageInput || typeof imageInput !== 'string') {
    return null;
  }

  const trimmedValue = imageInput.trim();
  if (!trimmedValue) {
    return null;
  }

  const normalizedInput = trimmedValue.replace(/\\/g, '/');
  const fileName = path.basename(normalizedInput);
  const resolvedPath = path.join(platillosUploadDir, fileName);

  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`La imagen ${fileName} no existe en uploads/platillos`);
  }

  return `/uploads/platillos/${fileName}`;
};

export const listarPlatillos = async (_req, res) => {
  try {
    const platillos = await platillosService.listarPlatillos();
    res.status(200).json({ exito: true, datos: platillos });
  } catch (error) {
    res.status(500).json({ exito: false, error: error.message });
  }
};

export const crearPlatillo = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ exito: false, errores: errors.array() });
    }

    const imagenExistente = req.body.imagen_nombre || req.body.imagen_url || null;
    const imagenUrl = req.file
      ? `/uploads/platillos/${req.file.filename}`
      : resolveExistingImageUrl(imagenExistente);

    const nuevo = await platillosService.crearPlatillo({
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      precio: Number(req.body.precio),
      categoriaId: req.body.categoria_id ? Number(req.body.categoria_id) : null,
      imagenUrl
    });

    res.status(201).json({ exito: true, mensaje: 'Platillo creado', datos: nuevo });
  } catch (error) {
    res.status(400).json({ exito: false, error: error.message });
  }
};

export const actualizarPlatillo = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ exito: false, errores: errors.array() });
    }

    const imagenExistente = req.body.imagen_nombre || req.body.imagen_url || null;
    const imagenUrl = req.file
      ? `/uploads/platillos/${req.file.filename}`
      : resolveExistingImageUrl(imagenExistente);

    const actualizado = await platillosService.actualizarPlatillo(Number(req.params.id), {
      nombre: req.body.nombre,
      descripcion: req.body.descripcion || null,
      precio: Number(req.body.precio),
      categoriaId: req.body.categoria_id ? Number(req.body.categoria_id) : null,
      imagenUrl,
      activo: Number(req.body.activo)
    });

    if (!actualizado) {
      return res.status(404).json({ exito: false, error: 'Platillo no encontrado' });
    }

    res.status(200).json({ exito: true, mensaje: 'Platillo actualizado', datos: actualizado });
  } catch (error) {
    res.status(400).json({ exito: false, error: error.message });
  }
};
