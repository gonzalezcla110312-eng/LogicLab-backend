CREATE DATABASE IF NOT EXISTS LogicLab;
USE LogicLab;

CREATE TABLE IF NOT EXISTS roles (
	id INT AUTO_INCREMENT PRIMARY KEY,
	nombre VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS tipo_documento (
	id INT AUTO_INCREMENT PRIMARY KEY,
	nombre VARCHAR(80) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS categorias (
	id INT AUTO_INCREMENT PRIMARY KEY,
	nombre VARCHAR(80) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS usuarios (
	id INT AUTO_INCREMENT PRIMARY KEY,
	email VARCHAR(120) NOT NULL UNIQUE,
	password VARCHAR(255) NOT NULL,
	nombre VARCHAR(80) NOT NULL,
	apellido VARCHAR(80) NOT NULL,
	rol_id INT NOT NULL,
	tipo_documento_id INT NULL,
	activo TINYINT(1) NOT NULL DEFAULT 1,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT fk_usuarios_roles FOREIGN KEY (rol_id) REFERENCES roles(id),
	CONSTRAINT fk_usuarios_tipo_documento FOREIGN KEY (tipo_documento_id) REFERENCES tipo_documento(id)
);

CREATE TABLE IF NOT EXISTS mesas (
	id INT AUTO_INCREMENT PRIMARY KEY,
	numero INT NOT NULL UNIQUE,
	estado ENUM('LIBRE', 'OCUPADA', 'INACTIVA') NOT NULL DEFAULT 'LIBRE',
	activa TINYINT(1) NOT NULL DEFAULT 1,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS platillos (
	id INT AUTO_INCREMENT PRIMARY KEY,
	nombre VARCHAR(120) NOT NULL,
	descripcion VARCHAR(255),
	precio DECIMAL(10,2) NOT NULL,
	categoria_id INT NULL,
	imagen_url VARCHAR(255),
	activo TINYINT(1) NOT NULL DEFAULT 1,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT fk_platillos_categoria FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

CREATE TABLE IF NOT EXISTS estados_pedidos (
	id INT AUTO_INCREMENT PRIMARY KEY,
	nombre VARCHAR(50) NOT NULL UNIQUE,
	descripcion VARCHAR(255),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pedidos (
	id INT AUTO_INCREMENT PRIMARY KEY,
	mesa_id INT NOT NULL,
	usuario_id INT NOT NULL,
	estado_id INT NOT NULL,
	total DECIMAL(10,2) NOT NULL DEFAULT 0,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT fk_pedidos_mesas FOREIGN KEY (mesa_id) REFERENCES mesas(id),
	CONSTRAINT fk_pedidos_usuarios FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
	CONSTRAINT fk_pedidos_estado FOREIGN KEY (estado_id) REFERENCES estados_pedidos(id)
);

CREATE TABLE IF NOT EXISTS pedido_detalles (
	id INT AUTO_INCREMENT PRIMARY KEY,
	pedido_id INT NOT NULL,
	platillo_id INT NOT NULL,
	cantidad INT NOT NULL,
	precio_unitario DECIMAL(10,2) NOT NULL,
	subtotal DECIMAL(10,2) NOT NULL,
	notas VARCHAR(255),
	CONSTRAINT fk_detalle_pedido FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
	CONSTRAINT fk_detalle_platillo FOREIGN KEY (platillo_id) REFERENCES platillos(id)
);

CREATE TABLE IF NOT EXISTS menus_dia (
	id INT AUTO_INCREMENT PRIMARY KEY,
	fecha DATE NOT NULL UNIQUE,
	publicado TINYINT(1) NOT NULL DEFAULT 1,
	created_by INT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT fk_menus_dia_usuario FOREIGN KEY (created_by) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS menu_dia_items (
	id INT AUTO_INCREMENT PRIMARY KEY,
	menu_id INT NOT NULL,
	platillo_id INT NOT NULL,
	orden INT NOT NULL DEFAULT 0,
	CONSTRAINT uq_menu_dia_items UNIQUE (menu_id, platillo_id),
	CONSTRAINT fk_menu_dia_items_menu FOREIGN KEY (menu_id) REFERENCES menus_dia(id) ON DELETE CASCADE,
	CONSTRAINT fk_menu_dia_items_platillo FOREIGN KEY (platillo_id) REFERENCES platillos(id)
);

CREATE TABLE IF NOT EXISTS TipoPQRSF (
	id_TipoPQRSF INT AUTO_INCREMENT PRIMARY KEY,
	TipoPQRSF VARCHAR(50) NOT NULL,
	DescripcionTipo VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS RegistroPQRSF (
	id_Registro_PQRSF INT AUTO_INCREMENT PRIMARY KEY,
	id_TipoPQRSF INT NOT NULL,
	nombre_cliente VARCHAR(120),
	email_cliente VARCHAR(120),
	telefono_cliente VARCHAR(30),
	mensaje TEXT,
	estado VARCHAR(30) NOT NULL DEFAULT 'pendiente',
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	FOREIGN KEY (id_TipoPQRSF) REFERENCES TipoPQRSF(id_TipoPQRSF)
);

INSERT INTO roles (nombre)
SELECT 'administrador'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE nombre = 'administrador');

INSERT INTO roles (nombre)
SELECT 'mesero'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE nombre = 'mesero');

INSERT INTO roles (nombre)
SELECT 'cocinero'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE nombre = 'cocinero');

INSERT INTO estados_pedidos (nombre, descripcion)
SELECT 'PENDIENTE', 'Pedido recibido, en espera de ser procesado'
WHERE NOT EXISTS (SELECT 1 FROM estados_pedidos WHERE nombre = 'PENDIENTE');

INSERT INTO estados_pedidos (nombre, descripcion)
SELECT 'COCINANDO', 'El pedido esta siendo preparado en la cocina'
WHERE NOT EXISTS (SELECT 1 FROM estados_pedidos WHERE nombre = 'COCINANDO');

INSERT INTO estados_pedidos (nombre, descripcion)
SELECT 'PARA_ENTREGA', 'Pedido listo para entregar al cliente'
WHERE NOT EXISTS (SELECT 1 FROM estados_pedidos WHERE nombre = 'PARA_ENTREGA');

INSERT INTO estados_pedidos (nombre, descripcion)
SELECT 'ENTREGADO', 'Pedido entregado al cliente'
WHERE NOT EXISTS (SELECT 1 FROM estados_pedidos WHERE nombre = 'ENTREGADO');

INSERT INTO estados_pedidos (nombre, descripcion)
SELECT 'PAGADO', 'Pedido pagado y completado'
WHERE NOT EXISTS (SELECT 1 FROM estados_pedidos WHERE nombre = 'PAGADO');

INSERT INTO estados_pedidos (nombre, descripcion)
SELECT 'CERRADO', 'Pedido cerrado administrativamente'
WHERE NOT EXISTS (SELECT 1 FROM estados_pedidos WHERE nombre = 'CERRADO');

INSERT INTO estados_pedidos (nombre, descripcion)
SELECT 'CANCELADO', 'Pedido cancelado'
WHERE NOT EXISTS (SELECT 1 FROM estados_pedidos WHERE nombre = 'CANCELADO');
