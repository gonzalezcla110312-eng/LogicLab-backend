import pool from '../config/db.js';

// ─── Tipos de PQRSF ───────────────────────────────────────────────────────────

export const listarTipos = async () => {
  const [rows] = await pool.query(
    'SELECT id_TipoPQRSF AS id, TipoPQRSF AS nombre, DescripcionTipo AS descripcion, activo FROM TipoPQRSF ORDER BY TipoPQRSF'
  );
  return rows;
};

// ─── Registros PQRSF ──────────────────────────────────────────────────────────

const COLUMNAS_LISTA = `
  r.id_Registro_PQRSF AS id,
  t.TipoPQRSF          AS tipo,
  r.id_TipoPQRSF,
  r.nombre_cliente,
  r.apellido_cliente,
  r.email_cliente,
  r.telefono_cliente,
  r.asunto,
  r.mensaje,
  r.estado,
  r.respuesta,
  r.atendido_por,
  CONCAT(u.nombre, ' ', u.apellido) AS nombre_responsable,
  r.created_at,
  r.updated_at
`;

const JOIN_TIPO_USUARIO = `
  FROM RegistroPQRSF r
  INNER JOIN TipoPQRSF t ON t.id_TipoPQRSF = r.id_TipoPQRSF
  LEFT JOIN usuarios u ON u.id = r.atendido_por
`;

export const listarPqrs = async ({ estado, tipo, page = 1, limit = 20 } = {}) => {
  const offset = (page - 1) * limit;
  const condiciones = [];
  const params = [];

  if (estado) {
    condiciones.push('r.estado = ?');
    params.push(estado);
  }
  if (tipo) {
    condiciones.push('t.TipoPQRSF = ?');
    params.push(tipo.toUpperCase());
  }

  const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';

  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total ${JOIN_TIPO_USUARIO} ${where}`,
    params
  );

  const [rows] = await pool.query(
    `SELECT ${COLUMNAS_LISTA} ${JOIN_TIPO_USUARIO} ${where} ORDER BY r.created_at DESC LIMIT ? OFFSET ?`,
    [...params, Number(limit), Number(offset)]
  );

  return { datos: rows, total, page: Number(page), limit: Number(limit) };
};

export const obtenerPqrsPorId = async (id) => {
  const [rows] = await pool.query(
    `SELECT ${COLUMNAS_LISTA} ${JOIN_TIPO_USUARIO} WHERE r.id_Registro_PQRSF = ?`,
    [id]
  );
  return rows[0] || null;
};

export const crearPqrs = async ({
  id_TipoPQRSF,
  nombre_cliente,
  apellido_cliente,
  email_cliente,
  telefono_cliente,
  asunto,
  mensaje
}) => {
  const [result] = await pool.query(
    `INSERT INTO RegistroPQRSF
      (id_TipoPQRSF, nombre_cliente, apellido_cliente, email_cliente, telefono_cliente, asunto, mensaje, estado)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDIENTE')`,
    [id_TipoPQRSF, nombre_cliente, apellido_cliente, email_cliente, telefono_cliente || null, asunto, mensaje]
  );
  return obtenerPqrsPorId(result.insertId);
};

export const actualizarPqrs = async (id, { id_TipoPQRSF, nombre_cliente, apellido_cliente, email_cliente, telefono_cliente, asunto, mensaje }) => {
  const [result] = await pool.query(
    `UPDATE RegistroPQRSF
     SET id_TipoPQRSF = ?, nombre_cliente = ?, apellido_cliente = ?,
         email_cliente = ?, telefono_cliente = ?, asunto = ?, mensaje = ?
     WHERE id_Registro_PQRSF = ? AND estado = 'PENDIENTE'`,
    [id_TipoPQRSF, nombre_cliente, apellido_cliente, email_cliente, telefono_cliente || null, asunto, mensaje, id]
  );

  if (!result.affectedRows) {
    return null;
  }
  return obtenerPqrsPorId(id);
};

export const cambiarEstadoPqrs = async (id, { estado, respuesta, atendido_por }) => {
  const estadosValidos = ['PENDIENTE', 'EN_PROCESO', 'RESUELTO', 'CERRADO'];
  if (!estadosValidos.includes(estado)) {
    throw new Error(`Estado invalido. Valores permitidos: ${estadosValidos.join(', ')}`);
  }

  const [result] = await pool.query(
    `UPDATE RegistroPQRSF
     SET estado = ?, respuesta = ?, atendido_por = ?
     WHERE id_Registro_PQRSF = ?`,
    [estado, respuesta || null, atendido_por || null, id]
  );

  if (!result.affectedRows) {
    return null;
  }
  return obtenerPqrsPorId(id);
};

export const eliminarPqrs = async (id) => {
  const registro = await obtenerPqrsPorId(id);
  if (!registro) return null;

  await pool.query('DELETE FROM RegistroPQRSF WHERE id_Registro_PQRSF = ?', [id]);
  return registro;
};
