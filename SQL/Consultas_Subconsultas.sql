USE LogicLab;

-- CONSULTAS Y SUBCONSULTAS ADAPTADAS AL DDL ACTUAL

-- 1. Pedidos activos para cocina
SELECT id, mesa_id, usuario_id, estado, total, created_at
FROM pedidos
WHERE estado IN ('ABIERTO', 'ENTREGADO')
ORDER BY created_at ASC;

-- 2. Mesas disponibles
SELECT id, numero, estado, activa
FROM mesas
WHERE estado = 'LIBRE' AND activa = 1
ORDER BY numero;

-- 3. Menú de platillos activos
SELECT nombre, precio, categoria_id, imagen_url
FROM platillos
WHERE activo = 1
ORDER BY nombre;

-- 4. Detalle de un pedido específico
SELECT *
FROM pedido_detalles
WHERE pedido_id = 1
ORDER BY id;

-- 5. Total de ventas del día (pedidos cerrados)
SELECT COALESCE(SUM(total), 0) AS total_ventas_dia
FROM pedidos
WHERE estado = 'CERRADO'
  AND DATE(created_at) = CURDATE();

-- 6. Cantidad de pedidos por estado
SELECT estado, COUNT(*) AS total_pedidos
FROM pedidos
GROUP BY estado
ORDER BY total_pedidos DESC;

-- 7. Platillo más vendido por cantidad
SELECT p.nombre, SUM(d.cantidad) AS total_vendido
FROM pedido_detalles d
INNER JOIN platillos p ON p.id = d.platillo_id
GROUP BY p.id, p.nombre
ORDER BY total_vendido DESC
LIMIT 1;

-- 8. Promedio de valor por pedido
SELECT ROUND(AVG(total), 2) AS promedio_gasto
FROM pedidos;

-- 9. Usuarios que han realizado pedidos
SELECT u.id, u.nombre, u.apellido, u.email
FROM usuarios u
WHERE u.id IN (
    SELECT DISTINCT p.usuario_id
    FROM pedidos p
)
ORDER BY u.nombre, u.apellido;

-- 10. Cantidad de pedidos por usuario
SELECT u.id, u.nombre, u.apellido,
       (SELECT COUNT(*) FROM pedidos p WHERE p.usuario_id = u.id) AS total_pedidos
FROM usuarios u
ORDER BY total_pedidos DESC, u.id;

-- 11. Platillos que nunca se han vendido
SELECT p.id, p.nombre
FROM platillos p
WHERE p.id NOT IN (
    SELECT DISTINCT d.platillo_id
    FROM pedido_detalles d
)
ORDER BY p.nombre;

-- 12. Pedidos con valor superior al promedio
SELECT id, mesa_id, usuario_id, estado, total, created_at
FROM pedidos
WHERE total > (
    SELECT AVG(total)
    FROM pedidos
)
ORDER BY total DESC;

-- 13. Mesas sin pedidos históricos
SELECT m.id, m.numero, m.estado
FROM mesas m
WHERE m.id NOT IN (
    SELECT DISTINCT p.mesa_id
    FROM pedidos p
)
ORDER BY m.numero;

-- 14. Menús del día sin items cargados
SELECT md.id, md.fecha, md.publicado
FROM menus_dia md
WHERE md.id NOT IN (
    SELECT DISTINCT mdi.menu_id
    FROM menu_dia_items mdi
)
ORDER BY md.fecha DESC;