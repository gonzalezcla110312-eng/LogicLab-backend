import pool from '../config/db.js';

const hasColumn = async (connection, tableName, columnName) => {
  const [rows] = await connection.query(
    `SELECT COUNT(*) AS total
     FROM information_schema.columns
     WHERE table_schema = ? AND table_name = ? AND column_name = ?`,
    [process.env.DB_NAME, tableName, columnName]
  );

  return Number(rows[0]?.total || 0) > 0;
};

const mapMenuRow = (menuRow, itemRows) => ({
  id: menuRow.id,
  fecha: menuRow.fecha,
  publicado: Number(menuRow.publicado),
  created_by: menuRow.created_by,
  created_at: menuRow.created_at,
  updated_at: menuRow.updated_at,
  items: itemRows.map((item) => ({
    id: item.id,
    orden: item.orden,
    platillo_id: item.platillo_id,
    nombre: item.nombre,
    descripcion: item.descripcion,
    precio: item.precio,
    categoria_id: item.categoria_id,
    categoria_nombre: item.categoria_nombre,
    imagen_url: item.imagen_url
  }))
});

const obtenerMenuConItemsPorId = async (connection, menuId) => {
  const [menuRows] = await connection.query(
    'SELECT id, fecha, publicado, created_by, created_at, updated_at FROM menus_dia WHERE id = ?',
    [menuId]
  );

  const menu = menuRows[0];
  if (!menu) {
    return null;
  }

  const [itemRows] = await connection.query(
    `SELECT mdi.id, mdi.orden, p.id AS platillo_id, p.nombre, p.descripcion, p.precio,
            p.categoria_id, c.nombre AS categoria_nombre, p.imagen_url
     FROM menu_dia_items mdi
     INNER JOIN platillos p ON p.id = mdi.platillo_id
     LEFT JOIN categorias c ON c.id = p.categoria_id
     WHERE mdi.menu_id = ?
     ORDER BY mdi.orden ASC, mdi.id ASC`,
    [menuId]
  );

  return mapMenuRow(menu, itemRows);
};

export const upsertMenuDia = async ({ fecha, publicado = 1, createdBy = null, items }) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const platillosHasActivo = await hasColumn(connection, 'platillos', 'activo');
    const platillosSelect = platillosHasActivo
      ? `SELECT id, activo
         FROM platillos
         WHERE id IN (?)`
      : `SELECT id
         FROM platillos
         WHERE id IN (?)`;

    const [platillosRows] = await connection.query(platillosSelect, [items.map((item) => item.platillo_id)]);

    if (platillosRows.length !== items.length) {
      throw new Error('Uno o mas platillos no existen');
    }

    if (platillosHasActivo) {
      const invalidPlatillo = platillosRows.find((row) => Number(row.activo) !== 1);
      if (invalidPlatillo) {
        throw new Error(`El platillo ${invalidPlatillo.id} no esta activo`);
      }
    }

    const [existingRows] = await connection.query(
      'SELECT id FROM menus_dia WHERE fecha = ? FOR UPDATE',
      [fecha]
    );

    let menuId;
    let accion;

    if (existingRows.length > 0) {
      menuId = existingRows[0].id;
      accion = 'updated';

      await connection.query(
        'UPDATE menus_dia SET publicado = ?, created_by = ? WHERE id = ?',
        [publicado, createdBy, menuId]
      );

      await connection.query('DELETE FROM menu_dia_items WHERE menu_id = ?', [menuId]);
    } else {
      const [insertResult] = await connection.query(
        'INSERT INTO menus_dia (fecha, publicado, created_by) VALUES (?, ?, ?)',
        [fecha, publicado, createdBy]
      );

      menuId = insertResult.insertId;
      accion = 'created';
    }

    for (let index = 0; index < items.length; index += 1) {
      const item = items[index];
      await connection.query(
        'INSERT INTO menu_dia_items (menu_id, platillo_id, orden) VALUES (?, ?, ?)',
        [menuId, item.platillo_id, item.orden ?? index + 1]
      );
    }

    await connection.commit();

    const menu = await obtenerMenuConItemsPorId(connection, menuId);
    return { accion, ...menu };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const obtenerMenuDiaPorFecha = async (fecha, { soloPublicados = false } = {}) => {
  const connection = await pool.getConnection();

  try {
    const query = soloPublicados
      ? 'SELECT id FROM menus_dia WHERE fecha = ? AND publicado = 1'
      : 'SELECT id FROM menus_dia WHERE fecha = ?';

    const [rows] = await connection.query(query, [fecha]);
    if (rows.length === 0) {
      return null;
    }

    return obtenerMenuConItemsPorId(connection, rows[0].id);
  } finally {
    connection.release();
  }
};

export const listarMenusDia = async ({ desde, hasta, soloPublicados = false }) => {
  const conditions = [];
  const params = [];

  if (desde) {
    conditions.push('m.fecha >= ?');
    params.push(desde);
  }

  if (hasta) {
    conditions.push('m.fecha <= ?');
    params.push(hasta);
  }

  if (soloPublicados) {
    conditions.push('m.publicado = 1');
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const [rows] = await pool.query(
    `SELECT m.id, m.fecha, m.publicado, m.created_by, m.created_at, m.updated_at,
            COUNT(mdi.id) AS total_items
     FROM menus_dia m
     LEFT JOIN menu_dia_items mdi ON mdi.menu_id = m.id
     ${whereClause}
     GROUP BY m.id, m.fecha, m.publicado, m.created_by, m.created_at, m.updated_at
     ORDER BY m.fecha DESC`,
    params
  );

  return rows.map((row) => ({
    ...row,
    publicado: Number(row.publicado),
    total_items: Number(row.total_items)
  }));
};

export const limpiarMenusDia = async ({ desde = null, hasta = null }) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const conditions = [];
    const params = [];

    if (desde) {
      conditions.push('fecha >= ?');
      params.push(desde);
    }

    if (hasta) {
      conditions.push('fecha <= ?');
      params.push(hasta);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const [menusAEliminar] = await connection.query(
      `SELECT id FROM menus_dia ${whereClause}`,
      params
    );

    if (menusAEliminar.length === 0) {
      await connection.commit();
      return { eliminados: 0, rango: { desde, hasta } };
    }

    const menuIds = menusAEliminar.map((row) => row.id);
    const placeholders = menuIds.map(() => '?').join(',');

    await connection.query(
      `DELETE FROM menu_dia_items WHERE menu_id IN (${placeholders})`,
      menuIds
    );

    const [deleteResult] = await connection.query(
      `DELETE FROM menus_dia ${whereClause}`,
      params
    );

    await connection.commit();

    return {
      eliminados: deleteResult.affectedRows,
      rango: { desde, hasta }
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};