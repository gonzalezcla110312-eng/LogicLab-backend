
import pool from '../config/db.js';

// Normaliza los nombres de los productos.
const normalizarNombre = (nombre) => {
  return String(nombre || '')
    .trim()
    .replace(/\s+/g, ' ');
};

// Verifica que no exista otro producto ACTIVO
// con el mismo nombre.
const verificarNombreDuplicado = async (
  nombre,
  excluirId = null
) => {
  const nombreLimpio = normalizarNombre(nombre);

  if (!nombreLimpio) {
    throw new Error('Debes ingresar el nombre del plato.');
  }

  const [rows] = await pool.query(
    `SELECT id
     FROM platillos
     WHERE activo = 1
       AND LOWER(
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

// LISTAR SOLAMENTE LOS PLATOS ACTIVOS
export const listarPlatillos = async () => {
  const [rows] = await pool.query(
    `SELECT p.id, p.nombre, p.descripcion, p.precio,
            p.categoria_id, c.nombre AS categoria_nombre,
            p.imagen_url, p.activo, p.created_at, p.updated_at
     FROM platillos p
     LEFT JOIN categorias c ON c.id = p.categoria_id
     WHERE p.activo = 1
     ORDER BY p.id DESC`
  );

  return rows;
};

// CREAR UN PLATO
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

// ACTUALIZAR UN PLATO
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
  const nombreValidado = await verificarNombreDuplicado(
    nombre,
    id
  );

  const [result] = await pool.query(
    `UPDATE platillos
     SET nombre = ?,
         descripcion = ?,
         precio = ?,
         categoria_id = ?,
         imagen_url = ?,
         activo = ?
     WHERE id = ?
       AND activo = 1`,
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

// BUSCAR UN PLATO ACTIVO POR ID
export const obtenerPlatilloPorId = async (id) => {
  const [rows] = await pool.query(
    `SELECT id, nombre, descripcion, precio,
            categoria_id, imagen_url, activo
     FROM platillos
     WHERE id = ?
       AND activo = 1`,
    [id]
  );

  return rows[0] || null;
};

// ELIMINAR UN PLATO SIN BORRARLO DE MYSQL
export const eliminarPlatillo = async (id) => {
  const [result] = await pool.query(
    `UPDATE platillos
     SET activo = 0
     WHERE id = ?
       AND activo = 1`,
    [id]
  );

  return result.affectedRows > 0;
};
