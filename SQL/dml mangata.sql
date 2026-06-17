USE LogicLab;

-- DML ALINEADO AL DDL ACTUAL

INSERT INTO tipo_documento (id, nombre) VALUES
(1, 'Cedula ciudadana'),
(2, 'Cedula de Extranjeria')
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);

INSERT INTO roles (id, nombre) VALUES
(1, 'administrador'),
(2, 'mesero'),
(3, 'cocinero')
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);

INSERT INTO categorias (id, nombre) VALUES
(1, 'Carta Corriente'),
(2, 'Comida Rapida'),
(3, 'Carta Especial'),
(4, 'Bebidas')
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);

INSERT INTO mesas (id, numero, estado, activa) VALUES
(1, 1, 'LIBRE', 1),
(2, 2, 'LIBRE', 1),
(3, 3, 'LIBRE', 1),
(4, 4, 'LIBRE', 1),
(5, 5, 'LIBRE', 1),
(6, 6, 'LIBRE', 1)
ON DUPLICATE KEY UPDATE
	numero = VALUES(numero),
	estado = VALUES(estado),
	activa = VALUES(activa);

INSERT INTO TipoPQRSF (id_TipoPQRSF, TipoPQRSF, DescripcionTipo) VALUES
(1, 'Peticion', 'Solicitud formal del cliente'),
(2, 'Queja', 'Insatisfaccion por servicio o producto'),
(3, 'Reclamo', 'Solicitud de correccion o compensacion'),
(4, 'Sugerencia', 'Propuesta de mejora'),
(5, 'Felicitacion', 'Reconocimiento positivo')
ON DUPLICATE KEY UPDATE
	TipoPQRSF = VALUES(TipoPQRSF),
	DescripcionTipo = VALUES(DescripcionTipo);

INSERT INTO RegistroPQRSF (id_Registro_PQRSF, id_TipoPQRSF, nombre_cliente, email_cliente, telefono_cliente, mensaje, estado) VALUES
(1, 3, 'Cliente Mostrador', 'cliente1@example.com', '3000000001', 'El pedido tardo demasiado.', 'pendiente'),
(2, 4, 'Cliente Habitual', 'cliente2@example.com', '3000000002', 'Seria ideal ampliar el menu vegano.', 'pendiente')
ON DUPLICATE KEY UPDATE
	id_TipoPQRSF = VALUES(id_TipoPQRSF),
	nombre_cliente = VALUES(nombre_cliente),
	email_cliente = VALUES(email_cliente),
	telefono_cliente = VALUES(telefono_cliente),
	mensaje = VALUES(mensaje),
	estado = VALUES(estado);
