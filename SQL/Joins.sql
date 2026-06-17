USE LogicLab;

-- INNER JOIN, LEFT JOIN Y RIGHT JOIN ADAPTADOS

-- 1. Pedidos con usuario y mesa
SELECT p.id AS pedido_id, p.estado, p.total,
	   u.nombre, u.apellido,
	   m.numero AS mesa_numero
FROM pedidos p
INNER JOIN usuarios u ON p.usuario_id = u.id
INNER JOIN mesas m ON p.mesa_id = m.id;

-- 2. Pedidos con rol del usuario que lo creó
SELECT p.id AS pedido_id, u.nombre, u.apellido, r.nombre AS rol
FROM pedidos p
INNER JOIN usuarios u ON p.usuario_id = u.id
INNER JOIN roles r ON u.rol_id = r.id;

-- 3. Platillos con su categoría
SELECT pl.nombre AS platillo, c.nombre AS categoria
FROM platillos pl
INNER JOIN categorias c ON pl.categoria_id = c.id;

-- 4. Detalle pedido con nombre de platillo
SELECT d.pedido_id, pl.nombre AS platillo, d.cantidad, d.subtotal
FROM pedido_detalles d
INNER JOIN platillos pl ON d.platillo_id = pl.id;

-- 5. Registros PQRSF con tipo
SELECT r.id_Registro_PQRSF, t.TipoPQRSF, r.nombre_cliente, r.estado
FROM RegistroPQRSF r
INNER JOIN TipoPQRSF t ON r.id_TipoPQRSF = t.id_TipoPQRSF;

-- 6. Todos los roles y sus usuarios (aunque no tengan)
SELECT r.id, r.nombre AS rol, u.id AS usuario_id, u.nombre, u.apellido
FROM roles r
LEFT JOIN usuarios u ON r.id = u.rol_id;

-- 7. Todas las categorías con sus platillos (aunque no tengan)
SELECT c.id, c.nombre AS categoria, pl.id AS platillo_id, pl.nombre AS platillo
FROM categorias c
LEFT JOIN platillos pl ON c.id = pl.categoria_id;

-- 8. Menús del día y cantidad de items (aunque no tengan)
SELECT md.id, md.fecha, COUNT(mdi.id) AS total_items
FROM menus_dia md
LEFT JOIN menu_dia_items mdi ON md.id = mdi.menu_id
GROUP BY md.id, md.fecha;

-- 9. Tipos PQRSF con registros (aunque no tengan)
SELECT t.id_TipoPQRSF, t.TipoPQRSF, r.id_Registro_PQRSF
FROM TipoPQRSF t
LEFT JOIN RegistroPQRSF r ON t.id_TipoPQRSF = r.id_TipoPQRSF;

-- 10. Mesas con pedidos abiertos (aunque no tengan)
SELECT m.id, m.numero, p.id AS pedido_id, p.estado
FROM mesas m
LEFT JOIN pedidos p ON p.mesa_id = m.id AND p.estado = 'ABIERTO';

-- 11. Todos los tipos de documento aunque no estén usados
SELECT u.id AS usuario_id, u.nombre, td.id AS tipo_documento_id, td.nombre AS tipo_documento
FROM usuarios u
RIGHT JOIN tipo_documento td ON u.tipo_documento_id = td.id;

-- 12. Todos los tipos PQRSF aunque no tengan registros
SELECT r.id_Registro_PQRSF, t.id_TipoPQRSF, t.TipoPQRSF
FROM RegistroPQRSF r
RIGHT JOIN TipoPQRSF t ON r.id_TipoPQRSF = t.id_TipoPQRSF;