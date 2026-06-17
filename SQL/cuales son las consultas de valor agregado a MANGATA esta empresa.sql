USE LogicLab;

-- CONSULTAS DE VALOR AGREGADO (SIN JOINS COMPLEJOS)

-- 1. Tipos de documento disponibles
SELECT *
FROM tipo_documento
ORDER BY id;

-- 2. Pedidos por estado
SELECT estado, COUNT(*) AS total
FROM pedidos
GROUP BY estado
ORDER BY total DESC;

-- 3. Ingreso total
SELECT COALESCE(SUM(total), 0) AS ingresos_totales
FROM pedidos
WHERE estado IN ('ENTREGADO', 'CERRADO');

-- 4. Ticket promedio
SELECT ROUND(AVG(total), 2) AS ticket_promedio
FROM pedidos
WHERE estado IN ('ENTREGADO', 'CERRADO');

-- 5. Menús publicados en el mes actual
SELECT COUNT(*) AS menus_publicados
FROM menus_dia
WHERE publicado = 1
	AND YEAR(fecha) = YEAR(CURDATE())
	AND MONTH(fecha) = MONTH(CURDATE());

-- 6. Platillos activos
SELECT id, nombre, precio
FROM platillos
WHERE activo = 1
ORDER BY nombre;

