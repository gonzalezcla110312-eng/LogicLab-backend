import pool from '../config/db.js';

export const listarMesas = async () => {
  const [rows] = await pool.query('SELECT id, numero, estado, activa, created_at, updated_at FROM mesas ORDER BY numero');
  return rows;
};

export const crearMesa = async ({ numero, estado }) => {
  const [result] = await pool.query(
    'INSERT INTO mesas (numero, estado, activa) VALUES (?, ?, 1)',
    [numero, estado || 'LIBRE']
  );

  const [rows] = await pool.query(
    'SELECT id, numero, estado, activa, created_at, updated_at FROM mesas WHERE id = ?',
    [result.insertId]
  );

  return rows[0];
};

export const actualizarMesa = async (id, { numero, estado, activa }) => {
  const [result] = await pool.query(
    'UPDATE mesas SET numero = ?, estado = ?, activa = ? WHERE id = ?',
    [numero, estado, activa, id]
  );

  if (!result.affectedRows) {
    return null;
  }

  const [rows] = await pool.query(
    'SELECT id, numero, estado, activa, created_at, updated_at FROM mesas WHERE id = ?',
    [id]
  );

  return rows[0];
};

export const obtenerMesaPorId = async (id) => {
  const [rows] = await pool.query('SELECT id, numero, estado, activa FROM mesas WHERE id = ?', [id]);
  return rows[0] || null;
};

export const liberarMesa = async (id) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [mesaRows] = await connection.query('SELECT id, numero, estado, activa FROM mesas WHERE id = ? FOR UPDATE', [id]);
    const mesa = mesaRows[0];

    if (!mesa) {
      await connection.rollback();
      return null;
    }

    if (!mesa.activa) {
      throw new Error('No se puede liberar una mesa inactiva');
    }

    const [abiertosRows] = await connection.query(
      `SELECT id
       FROM pedidos
       WHERE mesa_id = ? AND estado = 'ABIERTO'
       ORDER BY id DESC
       LIMIT 1`,
      [id]
    );

    if (abiertosRows.length > 0) {
      throw new Error('No se puede liberar la mesa porque tiene un pedido ABIERTO');
    }

    await connection.query('UPDATE mesas SET estado = "LIBRE" WHERE id = ?', [id]);

    const [updatedRows] = await connection.query(
      'SELECT id, numero, estado, activa, created_at, updated_at FROM mesas WHERE id = ?',
      [id]
    );

    await connection.commit();
    return updatedRows[0];
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
