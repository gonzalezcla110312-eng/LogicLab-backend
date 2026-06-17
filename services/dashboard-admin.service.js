import pool from '../config/db.js';

const buildPedidosDateFilter = ({ desde, hasta }, alias = 'p') => {
  const conditions = [];
  const params = [];

  if (desde) {
    conditions.push(`DATE(${alias}.created_at) >= ?`);
    params.push(desde);
  }

  if (hasta) {
    conditions.push(`DATE(${alias}.created_at) <= ?`);
    params.push(hasta);
  }

  return {
    where: conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '',
    params
  };
};

export const obtenerEstadisticasGenerales = async ({ desde, hasta }) => {
  const { where, params } = buildPedidosDateFilter({ desde, hasta }, 'p');

  const [pedidosRows] = await pool.query(
    `SELECT
       SUM(CASE WHEN ep.nombre IN ('PAGADO', 'CERRADO') THEN 1 ELSE 0 END) AS pedidos_completados,
       SUM(CASE WHEN ep.nombre = 'CANCELADO' THEN 1 ELSE 0 END) AS pedidos_cancelados,
       SUM(CASE WHEN ep.nombre NOT IN ('PAGADO', 'CERRADO', 'CANCELADO') THEN 1 ELSE 0 END) AS pedidos_en_proceso,
       ROUND(AVG(CASE WHEN ep.nombre IN ('PAGADO', 'CERRADO') THEN TIMESTAMPDIFF(MINUTE, p.created_at, p.updated_at) END), 2) AS promedio_demora_preparacion_min
     FROM pedidos p
     INNER JOIN estados_pedidos ep ON ep.id = p.estado_id
     ${where}`,
    params
  );

  const [mesasRows] = await pool.query(
    `SELECT
       SUM(CASE WHEN estado = 'OCUPADA' THEN 1 ELSE 0 END) AS mesas_ocupadas,
       SUM(CASE WHEN estado = 'LIBRE' THEN 1 ELSE 0 END) AS mesas_libres,
       SUM(CASE WHEN estado = 'INACTIVA' OR activa = 0 THEN 1 ELSE 0 END) AS mesas_inactivas
     FROM mesas`
  );

  const pedidos = pedidosRows[0] || {};
  const mesas = mesasRows[0] || {};

  return {
    pedidos_completados: Number(pedidos.pedidos_completados || 0),
    pedidos_cancelados: Number(pedidos.pedidos_cancelados || 0),
    pedidos_en_proceso: Number(pedidos.pedidos_en_proceso || 0),
    promedio_demora_preparacion_min: pedidos.promedio_demora_preparacion_min === null
      ? 0
      : Number(pedidos.promedio_demora_preparacion_min),
    mesas_ocupadas: Number(mesas.mesas_ocupadas || 0),
    mesas_libres: Number(mesas.mesas_libres || 0),
    mesas_inactivas: Number(mesas.mesas_inactivas || 0)
  };
};

export const obtenerIngresosResumen = async ({ desde, hasta }) => {
  const { where, params } = buildPedidosDateFilter({ desde, hasta }, 'p');
  const paidWhere = where ? `${where} AND ep.nombre = 'PAGADO'` : `WHERE ep.nombre = 'PAGADO'`;

  const [rows] = await pool.query(
    `SELECT
       COALESCE(SUM(p.total), 0) AS ingresos_totales,
       COUNT(*) AS pedidos_pagados,
       ROUND(AVG(p.total), 2) AS ticket_promedio
     FROM pedidos p
     INNER JOIN estados_pedidos ep ON ep.id = p.estado_id
     ${paidWhere}`,
    params
  );

  const data = rows[0] || {};

  return {
    ingresos_totales: Number(data.ingresos_totales || 0),
    pedidos_pagados: Number(data.pedidos_pagados || 0),
    ticket_promedio: data.ticket_promedio === null ? 0 : Number(data.ticket_promedio)
  };
};

export const obtenerTendenciaPedidos = async ({ desde, hasta }) => {
  const { where, params } = buildPedidosDateFilter({ desde, hasta }, 'p');

  const [rows] = await pool.query(
    `SELECT
       DATE(p.created_at) AS fecha,
       SUM(CASE WHEN ep.nombre IN ('PAGADO', 'CERRADO') THEN 1 ELSE 0 END) AS completados,
       SUM(CASE WHEN ep.nombre = 'CANCELADO' THEN 1 ELSE 0 END) AS cancelados,
       SUM(CASE WHEN ep.nombre NOT IN ('PAGADO', 'CERRADO', 'CANCELADO') THEN 1 ELSE 0 END) AS en_proceso,
       COUNT(*) AS total
     FROM pedidos p
     INNER JOIN estados_pedidos ep ON ep.id = p.estado_id
     ${where}
     GROUP BY DATE(p.created_at)
     ORDER BY fecha ASC`,
    params
  );

  return rows.map((row) => ({
    fecha: row.fecha,
    completados: Number(row.completados || 0),
    cancelados: Number(row.cancelados || 0),
    en_proceso: Number(row.en_proceso || 0),
    total: Number(row.total || 0)
  }));
};

export const obtenerPlatillosTop = async ({ desde, hasta, limit = 10 }) => {
  const safeLimit = Number.isFinite(limit) ? Math.max(1, Math.min(50, Number(limit))) : 10;
  const { where, params } = buildPedidosDateFilter({ desde, hasta }, 'p');
  const paidWhere = where ? `${where} AND ep.nombre = 'PAGADO'` : `WHERE ep.nombre = 'PAGADO'`;

  const [rows] = await pool.query(
    `SELECT
       d.platillo_id,
       pl.nombre AS platillo_nombre,
       SUM(d.cantidad) AS cantidad_vendida,
       ROUND(SUM(d.subtotal), 2) AS ingresos_generados
     FROM pedido_detalles d
     INNER JOIN pedidos p ON p.id = d.pedido_id
    INNER JOIN estados_pedidos ep ON ep.id = p.estado_id
     INNER JOIN platillos pl ON pl.id = d.platillo_id
    ${paidWhere}
     GROUP BY d.platillo_id, pl.nombre
     ORDER BY cantidad_vendida DESC
     LIMIT ${safeLimit}`,
    params
  );

  return rows.map((row) => ({
    platillo_id: Number(row.platillo_id),
    platillo_nombre: row.platillo_nombre,
    cantidad_vendida: Number(row.cantidad_vendida || 0),
    ingresos_generados: Number(row.ingresos_generados || 0)
  }));
};

export const obtenerAlertasPedidos = async ({ minutos = 30, limit = 20 }) => {
  const safeMinutes = Number.isFinite(minutos) ? Math.max(1, Number(minutos)) : 30;
  const safeLimit = Number.isFinite(limit) ? Math.max(1, Math.min(100, Number(limit))) : 20;

  const [rows] = await pool.query(
    `SELECT
       p.id,
       p.mesa_id,
       m.numero AS mesa_numero,
       p.usuario_id,
       ep.nombre AS estado,
       p.total,
       p.created_at,
       TIMESTAMPDIFF(MINUTE, p.created_at, NOW()) AS minutos_abierto
     FROM pedidos p
     INNER JOIN mesas m ON m.id = p.mesa_id
     INNER JOIN estados_pedidos ep ON ep.id = p.estado_id
     WHERE ep.nombre NOT IN ('PAGADO', 'CERRADO', 'CANCELADO')
       AND TIMESTAMPDIFF(MINUTE, p.created_at, NOW()) >= ?
     ORDER BY minutos_abierto DESC
     LIMIT ${safeLimit}`,
    [safeMinutes]
  );

  return rows.map((row) => ({
    id: Number(row.id),
    mesa_id: Number(row.mesa_id),
    mesa_numero: Number(row.mesa_numero),
    usuario_id: Number(row.usuario_id),
    estado: row.estado,
    total: Number(row.total || 0),
    created_at: row.created_at,
    minutos_abierto: Number(row.minutos_abierto || 0)
  }));
};

export const obtenerMesasOcupadas = async () => {
  const [rows] = await pool.query(
    `SELECT
       m.id,
       m.numero,
       m.estado,
       m.activa,
       p.id AS pedido_id,
       ep.nombre AS pedido_estado,
       p.total AS pedido_total,
       p.created_at AS pedido_created_at,
       TIMESTAMPDIFF(MINUTE, p.created_at, NOW()) AS minutos_desde_apertura
     FROM mesas m
     LEFT JOIN pedidos p ON p.id = (
       SELECT p2.id
       FROM pedidos p2
       INNER JOIN estados_pedidos ep2 ON ep2.id = p2.estado_id
       WHERE p2.mesa_id = m.id
         AND ep2.nombre <> 'PAGADO'
       ORDER BY p2.id DESC
       LIMIT 1
     )
     LEFT JOIN estados_pedidos ep ON ep.id = p.estado_id
     WHERE m.estado = 'OCUPADA' AND m.activa = 1
     ORDER BY m.numero ASC`
  );

  return rows.map((row) => ({
    id: Number(row.id),
    numero: Number(row.numero),
    estado: row.estado,
    activa: Number(row.activa) === 1,
    pedido_id: row.pedido_id ? Number(row.pedido_id) : null,
    pedido_estado: row.pedido_estado || null,
    pedido_total: row.pedido_total === null ? null : Number(row.pedido_total),
    pedido_created_at: row.pedido_created_at || null,
    minutos_desde_apertura: row.minutos_desde_apertura === null ? null : Number(row.minutos_desde_apertura)
  }));
};

export const obtenerResumenDashboard = async ({ desde, hasta, topLimit = 10, alertasMinutos = 30, alertasLimit = 20 }) => {
  const [estadisticas, ingresos, tendencia, platillosTop, alertas] = await Promise.all([
    obtenerEstadisticasGenerales({ desde, hasta }),
    obtenerIngresosResumen({ desde, hasta }),
    obtenerTendenciaPedidos({ desde, hasta }),
    obtenerPlatillosTop({ desde, hasta, limit: topLimit }),
    obtenerAlertasPedidos({ minutos: alertasMinutos, limit: alertasLimit })
  ]);

  return {
    rango: {
      desde: desde || null,
      hasta: hasta || null
    },
    estadisticas,
    ingresos,
    tendencia_pedidos: tendencia,
    platillos_top: platillosTop,
    alertas_pedidos: alertas
  };
};
