USE LogicLab;

-- CONSULTAS DE VALOR AGREGADO CON JOINS

-- 1. Pedidos para cocina con usuario y mesa
SELECT
  p.id AS pedido_id,
  p.created_at,
  CONCAT(u.nombre, ' ', u.apellido) AS usuario,
  m.numero AS mesa,
  p.estado
FROM pedidos p
INNER JOIN usuarios u ON p.usuario_id = u.id
INNER JOIN mesas m ON p.mesa_id = m.id
ORDER BY p.created_at ASC;

-- 2. Pedidos ordenados por llegada con notas
SELECT
  p.id AS pedido_id,
  p.created_at,
  d.notas,
  p.estado
FROM pedidos p
INNER JOIN pedido_detalles d ON p.id = d.pedido_id
ORDER BY p.created_at ASC;

-- 3. Qué pidió el cliente (detalle completo)
SELECT
  p.id AS pedido_id,
  pl.nombre AS platillo,
  d.cantidad,
  d.precio_unitario,
  d.subtotal
FROM pedidos p
INNER JOIN pedido_detalles d ON p.id = d.pedido_id
INNER JOIN platillos pl ON d.platillo_id = pl.id
ORDER BY p.id, d.id;
 

