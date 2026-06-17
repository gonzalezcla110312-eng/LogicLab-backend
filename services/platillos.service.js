import pool from '../config/db.js';

export const listarPlatillos = async () => {
  const [rows] = await pool.query(
    `SELECT p.id, p.nombre, p.descripcion, p.precio, p.categoria_id, c.nombre AS categoria_nombre,
            p.imagen_url, p.activo, p.created_at, p.updated_at
     FROM platillos p
     LEFT JOIN categorias c ON c.id = p.categoria_id
     ORDER BY p.id DESC`
  );
  return rows;
};

export const crearPlatillo = async ({ nombre, descripcion, precio, categoriaId, imagenUrl }) => {
  const [result] = await pool.query(
    'INSERT INTO platillos (nombre, descripcion, precio, categoria_id, imagen_url, activo) VALUES (?, ?, ?, ?, ?, 1)',
    [nombre, descripcion || null, precio, categoriaId || null, imagenUrl || null]
  );

  const [rows] = await pool.query(
    'SELECT id, nombre, descripcion, precio, categoria_id, imagen_url, activo, created_at, updated_at FROM platillos WHERE id = ?',
    [result.insertId]
  );

  return rows[0];
};

export const actualizarPlatillo = async (id, { nombre, descripcion, precio, categoriaId, imagenUrl, activo }) => {
  const [result] = await pool.query(
    'UPDATE platillos SET nombre = ?, descripcion = ?, precio = ?, categoria_id = ?, imagen_url = ?, activo = ? WHERE id = ?',
    [nombre, descripcion, precio, categoriaId || null, imagenUrl, activo, id]
  );

  if (!result.affectedRows) {
    return null;
  }

  const [rows] = await pool.query(
    'SELECT id, nombre, descripcion, precio, categoria_id, imagen_url, activo, created_at, updated_at FROM platillos WHERE id = ?',
    [id]
  );

  return rows[0];
};

export const obtenerPlatilloPorId = async (id) => {
  const [rows] = await pool.query('SELECT id, nombre, descripcion, precio, categoria_id, imagen_url, activo FROM platillos WHERE id = ?', [id]);
  return rows[0] || null;
};
