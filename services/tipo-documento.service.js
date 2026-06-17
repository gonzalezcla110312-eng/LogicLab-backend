import pool from '../config/db.js';

export const listarTiposDocumento = async () => {
  const [rows] = await pool.query(
    `SELECT id,
            COALESCE(descripcion_documento, nombre) AS descripcion_documento,
            COALESCE(estado_documento, 'Activo') AS estado_documento
     FROM tipo_documento
     ORDER BY id`
  );
  return rows;
};
