import pool from '../config/db.js';

export const obtenerTodos = async () => {
  const [rows] = await pool.query('SELECT id, nombre FROM roles ORDER BY nombre');
  return rows;
};

export const obtenerPorNombre = async (nombre) => {
  const [rows] = await pool.query('SELECT id, nombre FROM roles WHERE nombre = ?', [nombre.toLowerCase()]);
  return rows[0] || null;
};
