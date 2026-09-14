import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

/**
 * GET /api/pqrs/tipos
 * Obtener los tipos de PQRSF disponibles
 */
router.get('/tipos', async (_req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        id_TipoPQRSF AS id,
        TipoPQRSF AS tipo,
        DescripcionTipo AS descripcion
      FROM TipoPQRSF
      ORDER BY id_TipoPQRSF
    `);

    res.json({
      exito: true,
      datos: rows
    });
  } catch (error) {
    console.error('Error al obtener tipos de PQRS:', error);

    res.status(500).json({
      exito: false,
      error: 'No se pudieron obtener los tipos de PQRS'
    });
  }
});

export default router;