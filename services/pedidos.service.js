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

const obtenerIdEstadoPedido = async (connection, nombreEstado) => {
  const [rows] = await connection.query(
    'SELECT id FROM estados_pedidos WHERE nombre = ?',
    [nombreEstado]
  );
  
  return rows[0]?.id || null;
};

export const crearPedidoConDetalle = async ({ mesaId, usuarioId, items }) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const usuariosHasActivo = await hasColumn(connection, 'usuarios', 'activo');
    const platillosHasActivo = await hasColumn(connection, 'platillos', 'activo');

    const [mesaRows] = await connection.query('SELECT id, estado, activa FROM mesas WHERE id = ? FOR UPDATE', [mesaId]);
    const mesa = mesaRows[0];

    if (!mesa?.activa) {
      throw new Error('La mesa no existe o está inactiva');
    }

    const [pedidoAbiertoRows] = await connection.query(
      `SELECT p.id, ep.nombre AS estado
       FROM pedidos p
       INNER JOIN estados_pedidos ep ON ep.id = p.estado_id
       WHERE p.mesa_id = ? AND ep.nombre <> 'PAGADO'
       ORDER BY p.id DESC
       LIMIT 1`,
      [mesaId]
    );

    if (pedidoAbiertoRows.length > 0) {
      throw new Error(`La mesa ya tiene un pedido activo en estado ${pedidoAbiertoRows[0].estado} (pedidoId ${pedidoAbiertoRows[0].id})`);
    }

    const usuarioSelect = usuariosHasActivo ? 'SELECT id, activo FROM usuarios WHERE id = ?' : 'SELECT id FROM usuarios WHERE id = ?';
    const [usuarioRows] = await connection.query(usuarioSelect, [usuarioId]);
    const usuario = usuarioRows[0];

    if (!usuario || (usuariosHasActivo && !usuario.activo)) {
      throw new Error('El usuario no existe o está inactivo');
    }

    let total = 0;
    const normalizedItems = [];

    for (const item of items) {
      const platilloSelect = platillosHasActivo
        ? 'SELECT id, precio, activo FROM platillos WHERE id = ?'
        : 'SELECT id, precio FROM platillos WHERE id = ?';
      const [platilloRows] = await connection.query(platilloSelect, [item.platillo_id]);

      const platillo = platilloRows[0];
      if (!platillo || (platillosHasActivo && !platillo.activo)) {
        throw new Error(`El platillo ${item.platillo_id} no existe o está inactivo`);
      }

      const cantidad = Number(item.cantidad);
      const precioUnitario = Number(platillo.precio);
      const subtotal = Number((cantidad * precioUnitario).toFixed(2));
      total += subtotal;

      normalizedItems.push({
        platilloId: item.platillo_id,
        cantidad,
        precioUnitario,
        subtotal,
        notas: item.notas || null
      });
    }

    const estadoPendienteId = await obtenerIdEstadoPedido(connection, 'PENDIENTE');
    if (!estadoPendienteId) {
      throw new Error('Estado PENDIENTE no encontrado en la base de datos');
    }

    const [pedidoResult] = await connection.query(
      'INSERT INTO pedidos (mesa_id, usuario_id, estado_id, total) VALUES (?, ?, ?, ?)',
      [mesaId, usuarioId, estadoPendienteId, Number(total.toFixed(2))]
    );

    for (const item of normalizedItems) {
      await connection.query(
        'INSERT INTO pedido_detalles (pedido_id, platillo_id, cantidad, precio_unitario, subtotal, notas) VALUES (?, ?, ?, ?, ?, ?)',
        [pedidoResult.insertId, item.platilloId, item.cantidad, item.precioUnitario, item.subtotal, item.notas]
      );
    }

    await connection.query('UPDATE mesas SET estado = "OCUPADA" WHERE id = ?', [mesaId]);

    await connection.commit();

    const [pedidoRows] = await connection.query(
      `SELECT p.id, p.mesa_id, p.usuario_id, p.estado_id, ep.nombre AS estado, p.total, p.created_at 
       FROM pedidos p
       INNER JOIN estados_pedidos ep ON ep.id = p.estado_id
       WHERE p.id = ?`,
      [pedidoResult.insertId]
    );

    const [detalleRows] = await connection.query(
      'SELECT id, pedido_id, platillo_id, cantidad, precio_unitario, subtotal, notas FROM pedido_detalles WHERE pedido_id = ?',
      [pedidoResult.insertId]
    );

    return {
      ...pedidoRows[0],
      items: detalleRows
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const listarPedidos = async () => {
  const [rows] = await pool.query(
    `SELECT p.id, p.mesa_id, p.usuario_id, p.estado_id, ep.nombre AS estado, p.total, p.created_at,
            m.numero AS mesa_numero, u.nombre, u.apellido
     FROM pedidos p
     INNER JOIN estados_pedidos ep ON ep.id = p.estado_id
     INNER JOIN mesas m ON m.id = p.mesa_id
     INNER JOIN usuarios u ON u.id = p.usuario_id
     ORDER BY p.id DESC`
  );

  return rows;
};

export const listarPedidosActivosCocina = async () => {
  const [pedidoRows] = await pool.query(
    `SELECT p.id, p.mesa_id, m.numero AS mesa_numero, p.usuario_id, p.estado_id, ep.nombre AS estado, p.total, p.created_at,
            TIMESTAMPDIFF(MINUTE, p.created_at, NOW()) AS minutos_transcurridos,
            u.nombre AS mesero_nombre, u.apellido AS mesero_apellido
     FROM pedidos p
     INNER JOIN estados_pedidos ep ON ep.id = p.estado_id
     INNER JOIN mesas m ON m.id = p.mesa_id
     INNER JOIN usuarios u ON u.id = p.usuario_id
     WHERE ep.nombre IN ('PENDIENTE', 'COCINANDO')
     ORDER BY p.created_at ASC, p.id ASC`
  );

  if (pedidoRows.length === 0) {
    return [];
  }

  const pedidoIds = pedidoRows.map((pedido) => pedido.id);
  const placeholders = pedidoIds.map(() => '?').join(',');

  const [detalleRows] = await pool.query(
    `SELECT d.id, d.pedido_id, d.platillo_id, d.cantidad, d.precio_unitario, d.subtotal, d.notas,
            p.nombre AS platillo_nombre
     FROM pedido_detalles d
     LEFT JOIN platillos p ON p.id = d.platillo_id
     WHERE d.pedido_id IN (${placeholders})
     ORDER BY d.pedido_id ASC, d.id ASC`,
    pedidoIds
  );

  const detallesPorPedido = new Map();
  for (const detalle of detalleRows) {
    if (!detallesPorPedido.has(detalle.pedido_id)) {
      detallesPorPedido.set(detalle.pedido_id, []);
    }

    detallesPorPedido.get(detalle.pedido_id).push(detalle);
  }

  return pedidoRows.map((pedido) => ({
    ...pedido,
    minutos_transcurridos: Number(pedido.minutos_transcurridos || 0),
    detalles: detallesPorPedido.get(pedido.id) || []
  }));
};

export const listarPedidosListosParaRecoger = async () => {
  const [pedidoRows] = await pool.query(
    `SELECT p.id, p.mesa_id, m.numero AS mesa_numero, p.usuario_id, p.estado_id, ep.nombre AS estado, p.total, p.created_at,
            TIMESTAMPDIFF(MINUTE, p.created_at, NOW()) AS minutos_transcurridos,
            u.nombre AS mesero_nombre, u.apellido AS mesero_apellido
     FROM pedidos p
     INNER JOIN estados_pedidos ep ON ep.id = p.estado_id
     INNER JOIN mesas m ON m.id = p.mesa_id
     INNER JOIN usuarios u ON u.id = p.usuario_id
     WHERE ep.nombre = 'PARA_ENTREGA'
     ORDER BY p.created_at ASC, p.id ASC`
  );

  if (pedidoRows.length === 0) {
    return [];
  }

  const pedidoIds = pedidoRows.map((pedido) => pedido.id);
  const placeholders = pedidoIds.map(() => '?').join(',');

  const [detalleRows] = await pool.query(
    `SELECT d.id, d.pedido_id, d.platillo_id, d.cantidad, d.precio_unitario, d.subtotal, d.notas,
            p.nombre AS platillo_nombre
     FROM pedido_detalles d
     LEFT JOIN platillos p ON p.id = d.platillo_id
     WHERE d.pedido_id IN (${placeholders})
     ORDER BY d.pedido_id ASC, d.id ASC`,
    pedidoIds
  );

  const detallesPorPedido = new Map();
  for (const detalle of detalleRows) {
    if (!detallesPorPedido.has(detalle.pedido_id)) {
      detallesPorPedido.set(detalle.pedido_id, []);
    }

    detallesPorPedido.get(detalle.pedido_id).push(detalle);
  }

  return pedidoRows.map((pedido) => ({
    ...pedido,
    minutos_transcurridos: Number(pedido.minutos_transcurridos || 0),
    detalles: detallesPorPedido.get(pedido.id) || []
  }));
};

const obtenerDetallePedido = async (connection, pedidoId) => {
  const [pedidoRows] = await connection.query(
    `SELECT p.id, p.mesa_id, p.usuario_id, p.estado_id, ep.nombre AS estado, p.total, p.created_at 
     FROM pedidos p
     INNER JOIN estados_pedidos ep ON ep.id = p.estado_id
     WHERE p.id = ?`,
    [pedidoId]
  );

  const pedido = pedidoRows[0];
  if (!pedido) {
    return null;
  }

  const [detalleRows] = await connection.query(
    `SELECT d.id, d.pedido_id, d.platillo_id, d.cantidad, d.precio_unitario, d.subtotal, d.notas,
            p.nombre AS platillo_nombre
     FROM pedido_detalles d
     LEFT JOIN platillos p ON p.id = d.platillo_id
     WHERE d.pedido_id = ?
     ORDER BY d.id ASC`,
    [pedidoId]
  );

  return {
    ...pedido,
    detalles: detalleRows
  };
};

export const obtenerPedidoActivoPorMesa = async (mesaId) => {
  const [rows] = await pool.query(
    `SELECT p.id
     FROM pedidos p
     INNER JOIN estados_pedidos ep ON ep.id = p.estado_id
     WHERE p.mesa_id = ? AND ep.nombre <> 'PAGADO'
     ORDER BY p.id DESC
     LIMIT 1`,
    [mesaId]
  );

  const pedido = rows[0];
  if (!pedido) {
    return null;
  }

  const connection = await pool.getConnection();
  try {
    return await obtenerDetallePedido(connection, pedido.id);
  } finally {
    connection.release();
  }
};

export const obtenerPedidoPorId = async (pedidoId) => {
  const connection = await pool.getConnection();

  try {
    return await obtenerDetallePedido(connection, pedidoId);
  } finally {
    connection.release();
  }
};

export const actualizarPedidoActivo = async (pedidoId, items) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const platillosHasActivo = await hasColumn(connection, 'platillos', 'activo');

    const [pedidoRows] = await connection.query(
      `SELECT p.id, p.estado_id, ep.nombre AS estado FROM pedidos p
       INNER JOIN estados_pedidos ep ON ep.id = p.estado_id
       WHERE p.id = ? FOR UPDATE`,
      [pedidoId]
    );

    const pedido = pedidoRows[0];
    if (!pedido) {
      await connection.rollback();
      return null;
    }

    if (pedido.estado !== 'PENDIENTE') {
      throw new Error('Solo se puede editar un pedido en estado PENDIENTE');
    }

    if (!Array.isArray(items) || items.length === 0) {
      throw new Error('Debe enviar al menos un item para actualizar el pedido');
    }

    let total = 0;
    const normalizedItems = [];

    for (const item of items) {
      const platilloSelect = platillosHasActivo
        ? 'SELECT id, precio, activo FROM platillos WHERE id = ?'
        : 'SELECT id, precio FROM platillos WHERE id = ?';
      const [platilloRows] = await connection.query(platilloSelect, [item.platillo_id]);

      const platillo = platilloRows[0];
      if (!platillo || (platillosHasActivo && !platillo.activo)) {
        throw new Error(`El platillo ${item.platillo_id} no existe o está inactivo`);
      }

      const cantidad = Number(item.cantidad);
      const precioUnitario = Number(platillo.precio);
      const subtotal = Number((cantidad * precioUnitario).toFixed(2));
      total += subtotal;

      normalizedItems.push({
        platilloId: Number(item.platillo_id),
        cantidad,
        precioUnitario,
        subtotal,
        notas: item.notas || null
      });
    }

    await connection.query('DELETE FROM pedido_detalles WHERE pedido_id = ?', [pedidoId]);

    for (const item of normalizedItems) {
      await connection.query(
        'INSERT INTO pedido_detalles (pedido_id, platillo_id, cantidad, precio_unitario, subtotal, notas) VALUES (?, ?, ?, ?, ?, ?)',
        [pedidoId, item.platilloId, item.cantidad, item.precioUnitario, item.subtotal, item.notas]
      );
    }

    await connection.query('UPDATE pedidos SET total = ? WHERE id = ?', [Number(total.toFixed(2)), pedidoId]);

    await connection.commit();

    return await obtenerDetallePedido(connection, pedidoId);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const actualizarEstadoPedido = async (pedidoId, nuevoEstadoNombre) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const nuevoEstadoId = await obtenerIdEstadoPedido(connection, nuevoEstadoNombre);
    if (!nuevoEstadoId) {
      throw new Error(`Estado '${nuevoEstadoNombre}' no encontrado en la base de datos`);
    }

    const [pedidoRows] = await connection.query(
      `SELECT p.id, p.mesa_id, p.estado_id, ep.nombre AS estado 
       FROM pedidos p
       INNER JOIN estados_pedidos ep ON ep.id = p.estado_id
       WHERE p.id = ? FOR UPDATE`,
      [pedidoId]
    );

    const pedido = pedidoRows[0];
    if (!pedido) {
      await connection.rollback();
      return null;
    }

    if (pedido.estado_id !== nuevoEstadoId) {
      await connection.query('UPDATE pedidos SET estado_id = ? WHERE id = ?', [nuevoEstadoId, pedidoId]);
    }

    await connection.commit();

    return await obtenerDetallePedido(connection, pedidoId);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const marcarPedidoEntregadoPorCocina = async (pedidoId) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const estadoParaEntregaId = await obtenerIdEstadoPedido(connection, 'PARA_ENTREGA');
    if (!estadoParaEntregaId) {
      throw new Error('Estado PARA_ENTREGA no encontrado en la base de datos');
    }

    const [pedidoRows] = await connection.query(
      `SELECT p.id, p.mesa_id, p.estado_id, ep.nombre AS estado 
       FROM pedidos p
       INNER JOIN estados_pedidos ep ON ep.id = p.estado_id
       WHERE p.id = ? FOR UPDATE`,
      [pedidoId]
    );

    const pedido = pedidoRows[0];
    if (!pedido) {
      await connection.rollback();
      return null;
    }

    if (pedido.estado === 'ENTREGADO' || pedido.estado === 'PAGADO') {
      throw new Error('No se puede marcar como para_entrega un pedido que ya fue entregado o pagado');
    }

    if (pedido.estado_id !== estadoParaEntregaId) {
      await connection.query('UPDATE pedidos SET estado_id = ? WHERE id = ?', [estadoParaEntregaId, pedidoId]);
    }

    await connection.commit();

    return await obtenerDetallePedido(connection, pedidoId);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const cambiarEstadoPedidoYLiberarMesa = async (pedidoId, nuevoEstadoNombre) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const nuevoEstadoId = await obtenerIdEstadoPedido(connection, nuevoEstadoNombre);
    if (!nuevoEstadoId) {
      throw new Error(`Estado '${nuevoEstadoNombre}' no encontrado en la base de datos`);
    }

    const [pedidoRows] = await connection.query(
      `SELECT p.id, p.mesa_id, p.estado_id, ep.nombre AS estado 
       FROM pedidos p
       INNER JOIN estados_pedidos ep ON ep.id = p.estado_id
       WHERE p.id = ? FOR UPDATE`,
      [pedidoId]
    );

    const pedido = pedidoRows[0];
    if (!pedido) {
      await connection.rollback();
      return null;
    }

    // Actualizar estado del pedido
    if (pedido.estado_id !== nuevoEstadoId) {
      await connection.query('UPDATE pedidos SET estado_id = ? WHERE id = ?', [nuevoEstadoId, pedidoId]);
    }

    // Si el estado es final para mesa, liberar la mesa
    if (nuevoEstadoNombre === 'PAGADO' || nuevoEstadoNombre === 'CANCELADO') {
      await connection.query('UPDATE mesas SET estado = "LIBRE" WHERE id = ?', [pedido.mesa_id]);
    }

    await connection.commit();

    return await obtenerDetallePedido(connection, pedidoId);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
