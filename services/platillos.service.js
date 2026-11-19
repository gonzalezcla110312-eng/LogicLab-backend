
import pool from '../config/db.js';

// Normaliza los nombres para evitar registros duplicados.
const normalizarNombre = (nombre) => {
  return String(nombre || '')
    .trim()
    .replace(/\s+/g, ' ');
};

// Comprueba nombres sin distinguir mayúsculas,
// minúsculas ni espacios adicionales.
const verificarNombreDuplicado = async (nombre, excluirId = null) => {
  const nombreLimpio = normalizarNombre(nombre);

  if (!nombreLimpio) {
    throw new Error('Debes ingresar el nombre del plato.');
  }

  const [rows] = await pool.query(
    `SELECT id
     FROM platillos
     WHERE LOWER(
       REGEXP_REPLACE(TRIM(nombre), '[[:space:]]+', ' ')
     ) = LOWER(?)
     AND (? IS NULL OR id <> ?)
     LIMIT 1`,
    [nombreLimpio, excluirId, excluirId]
  );

  if (rows.length > 0) {
    throw new Error(
      'Este plato ya se encuentra registrado. Por favor, utiliza un nombre diferente.'
    );
  }

  return nombreLimpio;
};

// LISTAR TODOS LOS PLATOS
export const listarPlatillos = async () => {
  const [rows] = await pool.query(
    `SELECT p.id, p.nombre, p.descripcion, p.precio,
            p.categoria_id, c.nombre AS categoria_nombre,
            p.imagen_url, p.activo, p.created_at, p.updated_at
     FROM platillos p
     LEFT JOIN categorias c ON c.id = p.categoria_id
     ORDER BY p.id DESC`
  );

  return rows;
};

// CREAR PLATO SIN PERMITIR NOMBRES DUPLICADOS
export const crearPlatillo = async ({
  nombre,
  descripcion,
  precio,
  categoriaId,
  imagenUrl
}) => {
  const nombreValidado = await verificarNombreDuplicado(nombre);

  const [result] = await pool.query(
    `INSERT INTO platillos
     (nombre, descripcion, precio, categoria_id, imagen_url, activo)
     VALUES (?, ?, ?, ?, ?, 1)`,
    [
      nombreValidado,
      descripcion || null,
      precio,
      categoriaId || null,
      imagenUrl || null
    ]
  );

  const [rows] = await pool.query(
    `SELECT id, nombre, descripcion, precio,
            categoria_id, imagen_url, activo,
            created_at, updated_at
     FROM platillos
     WHERE id = ?`,
    [result.insertId]
  );

  return rows[0];
};

// ACTUALIZAR PLATO SIN DUPLICAR NOMBRES
export const actualizarPlatillo = async (
  id,
  {
    nombre,
    descripcion,
    precio,
    categoriaId,
    imagenUrl,
    activo
  }
) => {
  const nombreValidado = await verificarNombreDuplicado(nombre, id);

  const [result] = await pool.query(
    `UPDATE platillos
     SET nombre = ?,
         descripcion = ?,
         precio = ?,
         categoria_id = ?,
         imagen_url = ?,
         activo = ?
     WHERE id = ?`,
    [
      nombreValidado,
      descripcion,
      precio,
      categoriaId || null,
      imagenUrl,
      activo,
      id
    ]
  );

  if (!result.affectedRows) {
    return null;
  }

  const [rows] = await pool.query(
    `SELECT id, nombre, descripcion, precio,
            categoria_id, imagen_url, activo,
            created_at, updated_at
     FROM platillos
     WHERE id = ?`,
    [id]
  );

  return rows[0];
};

// BUSCAR PLATO POR ID
export const obtenerPlatilloPorId = async (id) => {
  const [rows] = await pool.query(
    `SELECT id, nombre, descripcion, precio,
            categoria_id, imagen_url, activo
     FROM platillos
     WHERE id = ?`,
    [id]
  );

  return rows[0] || null;
};
