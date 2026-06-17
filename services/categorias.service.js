import pool from '../config/db.js';

export const listarCategorias = async () => {
  const [rows] = await pool.query('SELECT id, nombre FROM categorias ORDER BY id');
  return rows;
};
