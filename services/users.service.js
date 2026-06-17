import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

const hasColumn = async (tableName, columnName) => {
  const [rows] = await pool.query(
    `SELECT COUNT(*) AS total
     FROM information_schema.columns
     WHERE table_schema = ? AND table_name = ? AND column_name = ?`,
    [process.env.DB_NAME, tableName, columnName]
  );

  return Number(rows[0]?.total || 0) > 0;
};

const buildRolSelect = async (includePassword = false) => {
  const [hasRolId, hasRolString] = await Promise.all([
    hasColumn('usuarios', 'rol_id'),
    hasColumn('usuarios', 'rol')
  ]);

  const passwordField = includePassword ? 'u.password, ' : '';

  const activoField = 'u.activo, ';

  if (hasRolId) {
    return {
      select: `${passwordField}u.id, u.email, u.nombre, u.apellido, COALESCE(r.nombre, 'mesero') AS rol, u.tipo_documento_id, ${activoField}u.created_at`,
      join: 'LEFT JOIN roles r ON r.id = u.rol_id'
    };
  }

  if (hasRolString) {
    return {
      select: `${passwordField}u.id, u.email, u.nombre, u.apellido, u.rol, u.tipo_documento_id, ${activoField}u.created_at`,
      join: ''
    };
  }

  return {
    select: `${passwordField}u.id, u.email, u.nombre, u.apellido, 'mesero' AS rol, u.tipo_documento_id, ${activoField}u.created_at`,
    join: ''
  };
};

export const obtenerTodos = async () => {
  const rolConfig = await buildRolSelect(false);

  const [usuarios] = await pool.query(
    `SELECT ${rolConfig.select}
     FROM usuarios u
     ${rolConfig.join}
     ORDER BY u.id DESC`
  );

  return usuarios;
};

export const obtenerPorId = async (id) => {
  const rolConfig = await buildRolSelect(false);

  const [usuarios] = await pool.query(
    `SELECT ${rolConfig.select}
     FROM usuarios u
     ${rolConfig.join}
     WHERE u.id = ?`,
    [id]
  );

  return usuarios[0] || null;
};

export const obtenerPorEmail = async (email) => {
  const rolConfig = await buildRolSelect(true);

  const [usuarios] = await pool.query(
    `SELECT ${rolConfig.select}
     FROM usuarios u
     ${rolConfig.join}
     WHERE u.email = ?`,
    [email]
  );

  return usuarios[0] || null;
};

export const crear = async ({ email, password, nombre, apellido, rol_id, tipo_documento_id }) => {
  const passwordHasheada = await bcrypt.hash(password, 10);
  const hasRolId = await hasColumn('usuarios', 'rol_id');

  if (hasRolId) {
    const [result] = await pool.query(
      'INSERT INTO usuarios (email, password, nombre, apellido, rol_id, tipo_documento_id, activo) VALUES (?, ?, ?, ?, ?, ?, 1)',
      [email, passwordHasheada, nombre, apellido, rol_id, tipo_documento_id || null]
    );

    return obtenerPorId(result.insertId);
  }

  let rolNombre = 'Mesero';
  if (rol_id === 1) rolNombre = 'Administrador';
  else if (rol_id === 3) rolNombre = 'Cocinero';

  const [result] = await pool.query(
    'INSERT INTO usuarios (email, password, nombre, apellido, rol, tipo_documento_id) VALUES (?, ?, ?, ?, ?, ?)',
    [email, passwordHasheada, nombre, apellido, rolNombre, tipo_documento_id || null]
  );

  return obtenerPorId(result.insertId);
};

export const actualizar = async (id, { nombre, apellido, rol_id, tipo_documento_id, email, password }) => {
  const hasRolId = await hasColumn('usuarios', 'rol_id');

  const extraSets = [];
  const extraVals = [];

  if (email) {
    extraSets.push('email = ?');
    extraVals.push(email);
  }

  if (password) {
    const hash = await bcrypt.hash(password, 10);
    extraSets.push('password = ?');
    extraVals.push(hash);
  }

  let result;
  if (hasRolId) {
    const sets = ['nombre = ?', 'apellido = ?', 'rol_id = ?', 'tipo_documento_id = ?', ...extraSets].join(', ');
    [result] = await pool.query(
      `UPDATE usuarios SET ${sets} WHERE id = ?`,
      [nombre, apellido, rol_id, tipo_documento_id || null, ...extraVals, id]
    );
  } else {
    let rolNombre = 'Mesero';
    if (rol_id === 1) rolNombre = 'Administrador';
    else if (rol_id === 3) rolNombre = 'Cocinero';

    const sets = ['nombre = ?', 'apellido = ?', 'rol = ?', 'tipo_documento_id = ?', ...extraSets].join(', ');
    [result] = await pool.query(
      `UPDATE usuarios SET ${sets} WHERE id = ?`,
      [nombre, apellido, rolNombre, tipo_documento_id || null, ...extraVals, id]
    );
  }

  return result.affectedRows > 0;
};

export const cambiarEstado = async (id, activo) => {
  const hasActivo = await hasColumn('usuarios', 'activo');
  if (!hasActivo) {
    throw new Error('La columna activo no existe en la tabla usuarios. Verifica que el schema esté actualizado.');
  }

  const [result] = await pool.query('UPDATE usuarios SET activo = ? WHERE id = ?', [activo ? 1 : 0, id]);
  return result.affectedRows > 0;
};

export const verificarPassword = async (passwordIngresada, passwordGuardada) => {
  return bcrypt.compare(passwordIngresada, passwordGuardada);
};
