import pool from '../config/db.js';

const DURACION_RESERVA_HORAS = 2;

const validarFechaHora = (fecha, hora) => {
  if (!fecha || !hora) {
    throw new Error('La fecha y la hora son obligatorias');
  }

  const fechaHora = new Date(`${fecha}T${hora}`);

  if (Number.isNaN(fechaHora.getTime())) {
    throw new Error('La fecha o la hora no son validas');
  }
};

const verificarMesaDisponible = async ({
  mesaId,
  fecha,
  hora,
  excluirId = null
}) => {
  const [mesaRows] = await pool.query(
    `SELECT id, numero, estado, activa
     FROM mesas
     WHERE id = ?`,
    [mesaId]
  );

  const mesa = mesaRows[0];

  if (!mesa) {
    throw new Error('La mesa no existe');
  }

  if (!mesa.activa || mesa.estado === 'INACTIVA') {
    throw new Error('La mesa no esta activa');
  }

  let query = `
    SELECT id
    FROM reservaciones
    WHERE mesa_id = ?
      AND fecha = ?
      AND estado IN ('PENDIENTE', 'CONFIRMADA')
      AND hora < ADDTIME(?, '02:00:00')
      AND ADDTIME(hora, '02:00:00') > ?
  `;

  const params = [mesaId, fecha, hora, hora];

  if (excluirId) {
    query += ' AND id <> ?';
    params.push(excluirId);
  }

  query += ' LIMIT 1';

  const [reservas] = await pool.query(query, params);

  if (reservas.length > 0) {
    throw new Error(
      'La mesa ya tiene una reservacion en ese horario'
    );
  }

  return mesa;
};

export const listarReservaciones = async () => {
  const [rows] = await pool.query(
    `SELECT
       r.id,
       r.mesa_id,
       m.numero AS mesa_numero,
       r.nombre_cliente,
       r.email_cliente,
       r.telefono_cliente,
       DATE_FORMAT(r.fecha, '%Y-%m-%d') AS fecha,
       TIME_FORMAT(r.hora, '%H:%i') AS hora,
       r.personas,
       r.estado,
       r.observaciones,
       r.created_at,
       r.updated_at
     FROM reservaciones r
     INNER JOIN mesas m ON m.id = r.mesa_id
     ORDER BY r.fecha ASC, r.hora ASC, m.numero ASC`
  );

  return rows;
};

export const obtenerReservacionPorId = async (id) => {
  const [rows] = await pool.query(
    `SELECT
       r.id,
       r.mesa_id,
       m.numero AS mesa_numero,
       r.nombre_cliente,
       r.email_cliente,
       r.telefono_cliente,
       DATE_FORMAT(r.fecha, '%Y-%m-%d') AS fecha,
       TIME_FORMAT(r.hora, '%H:%i') AS hora,
       r.personas,
       r.estado,
       r.observaciones,
       r.created_at,
       r.updated_at
     FROM reservaciones r
     INNER JOIN mesas m ON m.id = r.mesa_id
     WHERE r.id = ?`,
    [id]
  );

  return rows[0] || null;
};

export const listarMesasDisponibles = async ({ fecha, hora }) => {
  validarFechaHora(fecha, hora);

  const [rows] = await pool.query(
    `SELECT
       m.id,
       m.numero,
       m.estado,
       m.activa
     FROM mesas m
     WHERE m.activa = 1
       AND m.estado <> 'INACTIVA'
       AND NOT EXISTS (
         SELECT 1
         FROM reservaciones r
         WHERE r.mesa_id = m.id
           AND r.fecha = ?
           AND r.estado IN ('PENDIENTE', 'CONFIRMADA')
           AND r.hora < ADDTIME(?, '02:00:00')
           AND ADDTIME(r.hora, '02:00:00') > ?
       )
     ORDER BY m.numero`,
    [fecha, hora, hora]
  );

  return rows;
};

export const crearReservacion = async ({
  mesa_id,
  nombre_cliente,
  email_cliente,
  telefono_cliente,
  fecha,
  hora,
  personas,
  observaciones
}) => {
  validarFechaHora(fecha, hora);

  const mesaId = Number(mesa_id);
  const cantidadPersonas = Number(personas);

  if (!mesaId || mesaId < 1) {
    throw new Error('La mesa es obligatoria');
  }

  if (!nombre_cliente?.trim()) {
    throw new Error('El nombre del cliente es obligatorio');
  }

  if (!cantidadPersonas || cantidadPersonas < 1) {
    throw new Error(
      'El numero de personas debe ser mayor que cero'
    );
  }

  await verificarMesaDisponible({
    mesaId,
    fecha,
    hora
  });

  const [result] = await pool.query(
    `INSERT INTO reservaciones
      (
        mesa_id,
        nombre_cliente,
        email_cliente,
        telefono_cliente,
        fecha,
        hora,
        personas,
        estado,
        observaciones
      )
     VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDIENTE', ?)`,
    [
      mesaId,
      nombre_cliente.trim(),
      email_cliente?.trim() || null,
      telefono_cliente?.trim() || null,
      fecha,
      hora,
      cantidadPersonas,
      observaciones?.trim() || null
    ]
  );

  return obtenerReservacionPorId(result.insertId);
};

export const actualizarReservacion = async (
  id,
  {
    mesa_id,
    nombre_cliente,
    email_cliente,
    telefono_cliente,
    fecha,
    hora,
    personas,
    observaciones
  }
) => {
  const reservacion = await obtenerReservacionPorId(id);

  if (!reservacion) {
    return null;
  }

  if (reservacion.estado === 'CANCELADA') {
    throw new Error(
      'No se puede modificar una reservacion cancelada'
    );
  }

  validarFechaHora(fecha, hora);

  const mesaId = Number(mesa_id);
  const cantidadPersonas = Number(personas);

  if (!mesaId || mesaId < 1) {
    throw new Error('La mesa es obligatoria');
  }

  if (!nombre_cliente?.trim()) {
    throw new Error('El nombre del cliente es obligatorio');
  }

  if (!cantidadPersonas || cantidadPersonas < 1) {
    throw new Error(
      'El numero de personas debe ser mayor que cero'
    );
  }

  await verificarMesaDisponible({
    mesaId,
    fecha,
    hora,
    excluirId: id
  });

  await pool.query(
    `UPDATE reservaciones
     SET
       mesa_id = ?,
       nombre_cliente = ?,
       email_cliente = ?,
       telefono_cliente = ?,
       fecha = ?,
       hora = ?,
       personas = ?,
       observaciones = ?
     WHERE id = ?`,
    [
      mesaId,
      nombre_cliente.trim(),
      email_cliente?.trim() || null,
      telefono_cliente?.trim() || null,
      fecha,
      hora,
      cantidadPersonas,
      observaciones?.trim() || null,
      id
    ]
  );

  return obtenerReservacionPorId(id);
};

export const cambiarEstadoReservacion = async (
  id,
  estado
) => {
  const estadosValidos = [
    'PENDIENTE',
    'CONFIRMADA',
    'CANCELADA',
    'ATENDIDA'
  ];

  if (!estadosValidos.includes(estado)) {
    throw new Error('Estado de reservacion invalido');
  }

  const [result] = await pool.query(
    `UPDATE reservaciones
     SET estado = ?
     WHERE id = ?`,
    [estado, id]
  );

  if (!result.affectedRows) {
    return null;
  }

  return obtenerReservacionPorId(id);
};