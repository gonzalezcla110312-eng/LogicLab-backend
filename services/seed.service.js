import pool from '../config/db.js';

const tipoDocumentoSeed = [
  { nombre: 'Cedula ciudadana' },
  { nombre: 'Cedula de Extranjeria' }
];

const estadosPedidosSeed = [
  { nombre: 'PENDIENTE', descripcion: 'Pedido recibido, en espera de ser procesado' },
  { nombre: 'COCINANDO', descripcion: 'El pedido está siendo preparado en la cocina' },
  { nombre: 'PARA_ENTREGA', descripcion: 'Pedido listo para entregar al cliente' },
  { nombre: 'ENTREGADO', descripcion: 'Pedido entregado al cliente' },
  { nombre: 'PAGADO', descripcion: 'Pedido pagado y completado' },
  { nombre: 'CERRADO', descripcion: 'Pedido cerrado administrativamente' },
  { nombre: 'CANCELADO', descripcion: 'Pedido cancelado' }
];

const categoriasSeed = [
  { id: 1, nombre: 'Carta Corriente' },
  { id: 2, nombre: 'Comida Rapida' },
  { id: 3, nombre: 'Carta Especial' },
  { id: 4, nombre: 'Bebidas' }
];

const usuariosSeed = [
  {
    email: 'andres@gmail.com',
    password: '$2a$10$Bik2bOQXgo6zLahAae3M5.e/t45z3XnS0amUpEc7/BAVZzOnzINga',
    nombre: 'Andres',
    apellido: 'Sanabria',
    rol: 'mesero',
    tipo_documento_id: 1
  },
  {
    email: 'Velandia@gmail.com',
    password: '$2a$10$Bik2bOQXgo6zLahAae3M5.e/t45z3XnS0amUpEc7/BAVZzOnzINga',
    nombre: 'Alejandro',
    apellido: 'Velandia',
    rol: 'cocinero',
    tipo_documento_id: 2
  },
  {
    email: 'Solarte@gmail.com',
    password: '$2a$10$Bik2bOQXgo6zLahAae3M5.e/t45z3XnS0amUpEc7/BAVZzOnzINga',
    nombre: 'Miguel',
    apellido: 'Solarte',
    rol: 'cocinero',
    tipo_documento_id: 1
  },
  {
    email: 'Claude@gmail.com',
    password: '$2a$10$Bik2bOQXgo6zLahAae3M5.e/t45z3XnS0amUpEc7/BAVZzOnzINga',
    nombre: 'Claus',
    apellido: 'Gonzales',
    rol: 'mesero',
    tipo_documento_id: 2
  },
  {
    email: 'Admin@gmail.com',
    password: '$2a$10$Bik2bOQXgo6zLahAae3M5.e/t45z3XnS0amUpEc7/BAVZzOnzINga',
    nombre: 'Juan',
    apellido: 'Andrade',
    rol: 'administrador',
    tipo_documento_id: 1
  }
];

const platillosSeed = [
  { id: 1, nombre: 'Corriente Pollo Asado', precio: 35000, categoria_id: 1, descripcion: 'Proteina: Pollo asado. Incluye principio (frijol, lenteja, pasta, etc) y sopa o arroz con leche.', imagen_url: null },
  { id: 2, nombre: 'Corriente Carne Asada', precio: 15000, categoria_id: 1, descripcion: 'Proteina: Carne asada. Incluye principio y sopa o arroz con leche del dia.', imagen_url: null },
  { id: 3, nombre: 'Corriente Pollo Sudado', precio: 15000, categoria_id: 1, descripcion: 'Proteina: Pollo sudado. Incluye principio a eleccion y acompanamiento liquido.', imagen_url: null },
  { id: 4, nombre: 'Corriente Carne Sudada', precio: 15000, categoria_id: 1, descripcion: 'Proteina: Carne sudada. Incluye principio y sopa (ajiaco, mondongo, etc).', imagen_url: null },
  { id: 5, nombre: 'Corriente Carne Molida', precio: 15000, categoria_id: 1, descripcion: 'Proteina: Carne molida. Servido con arroz blanco y principio del dia.', imagen_url: null },
  { id: 6, nombre: 'Hamburguesa Sencilla Carne', precio: 12000, categoria_id: 2, descripcion: 'Hamburguesa de carne de res basica.', imagen_url: '/uploads/platillos/hamburguesa.png' },
  { id: 7, nombre: 'Hamburguesa Combo Pollo', precio: 20000, categoria_id: 2, descripcion: 'Hamburguesa de pollo acompanada de gaseosa y papas fritas.', imagen_url: '/uploads/platillos/hamburguesa.png' },
  { id: 8, nombre: 'Hamburguesa Doble Carne', precio: 27000, categoria_id: 2, descripcion: 'Doble porcion de carne de res con queso y vegetales.', imagen_url: '/uploads/platillos/hamburguesa.png' },
  { id: 9, nombre: 'Hamburguesa Combo Carne', precio: 20000, categoria_id: 2, descripcion: 'Combo de hamburguesa de res con papas y bebida.', imagen_url: '/uploads/platillos/hamburguesa.png' },
  { id: 10, nombre: 'Hamburguesa Sencilla Pollo Apanado', precio: 12000, categoria_id: 2, descripcion: 'Pollo apanado crujiente en pan artesanal.', imagen_url: '/uploads/platillos/hamburguesa.png' },
  { id: 11, nombre: 'Churrasco', precio: 25000, categoria_id: 3, descripcion: 'Corte de carne especial. Incluye arroz, ensalada, papas francesas y saladas.', imagen_url: null },
  { id: 12, nombre: 'Mini Paisa', precio: 25000, categoria_id: 3, descripcion: 'Version personal de la bandeja paisa. Incluye sopa o arroz con leche.', imagen_url: null },
  { id: 13, nombre: 'Mojarra Frita', precio: 25000, categoria_id: 3, descripcion: 'Pescado entero frito con guarniciones de la casa.', imagen_url: null },
  { id: 14, nombre: 'Costillas BBQ', precio: 25000, categoria_id: 3, descripcion: 'Costillitas banadas en salsa BBQ con papas y ensalada.', imagen_url: null },
  { id: 15, nombre: 'Pechuga Gratinada', precio: 25000, categoria_id: 3, descripcion: 'Filete de pechuga cubierto de queso fundido.', imagen_url: null },
  { id: 16, nombre: 'Jugo de Mora (Leche)', precio: 8000, categoria_id: 4, descripcion: 'Jugo natural preparado en leche.', imagen_url: null },
  { id: 17, nombre: 'Gaseosa 1.5L', precio: 7000, categoria_id: 4, descripcion: 'Botella familiar (Coca-Cola, Sprite, Colombiana).', imagen_url: null },
  { id: 18, nombre: 'Limonada', precio: 4000, categoria_id: 4, descripcion: 'Vaso de limonada natural fresca.', imagen_url: null },
  { id: 19, nombre: 'Jugo de Maracuya (Agua)', precio: 5000, categoria_id: 4, descripcion: 'Jugo natural refrescante preparado en agua.', imagen_url: '/uploads/platillos/jugomaracuya.png' },
  { id: 20, nombre: 'Agua Cristal', precio: 4000, categoria_id: 4, descripcion: 'Botella de agua mineral.', imagen_url: '/uploads/platillos/agua.png' }
];

const mesasSeed = [
  { id: 1, numero: 1, estado: 'LIBRE' },
  { id: 2, numero: 2, estado: 'LIBRE' },
  { id: 3, numero: 3, estado: 'LIBRE' },
  { id: 4, numero: 4, estado: 'LIBRE' },
  { id: 5, numero: 5, estado: 'LIBRE' },
  { id: 6, numero: 6, estado: 'LIBRE' },
  { id: 7, numero: 7, estado: 'LIBRE' },
  { id: 8, numero: 8, estado: 'LIBRE' },
  { id: 9, numero: 9, estado: 'LIBRE' },
  { id: 10, numero: 10, estado: 'LIBRE' },
  { id: 11, numero: 11, estado: 'LIBRE' },
  { id: 12, numero: 12, estado: 'LIBRE' }
];

export const runInitialSeedOnce = async () => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    await connection.query(
      `CREATE TABLE IF NOT EXISTS estados_pedidos (
         id INT AUTO_INCREMENT PRIMARY KEY,
         nombre VARCHAR(50) NOT NULL UNIQUE,
         descripcion VARCHAR(255),
         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
       )`
    );

    for (const estado of estadosPedidosSeed) {
      await connection.query(
        `INSERT INTO estados_pedidos (nombre, descripcion)
         VALUES (?, ?)
         ON DUPLICATE KEY UPDATE
           descripcion = VALUES(descripcion)`,
        [estado.nombre, estado.descripcion]
      );
    }

    await connection.query(
      'CREATE TABLE IF NOT EXISTS seed_control (nombre VARCHAR(120) PRIMARY KEY, executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)'
    );

    const [seedRows] = await connection.query('SELECT nombre FROM seed_control WHERE nombre = ?', ['initial_seed_v2']);
    if (seedRows.length > 0) {
      await connection.rollback();
      console.log('✓ Seed ya ejecutado previamente, no se insertan datos de nuevo');
      return;
    }

    const roles = ['administrador', 'mesero', 'cocinero'];
    for (const rol of roles) {
      await connection.query('INSERT INTO roles (nombre) SELECT ? WHERE NOT EXISTS (SELECT 1 FROM roles WHERE nombre = ?)', [rol, rol]);
    }

    for (const doc of tipoDocumentoSeed) {
      await connection.query(
        'INSERT IGNORE INTO tipo_documento (nombre) VALUES (?)',
        [doc.nombre]
      );
    }

    for (const cat of categoriasSeed) {
      await connection.query(
        'INSERT INTO categorias (id, nombre) VALUES (?, ?) ON DUPLICATE KEY UPDATE nombre = VALUES(nombre)',
        [cat.id, cat.nombre]
      );
    }

    const [rolesRows] = await connection.query('SELECT id, nombre FROM roles');
    const roleMap = new Map(rolesRows.map((row) => [row.nombre.toLowerCase(), row.id]));

    for (const user of usuariosSeed) {
      // Check if rol_id column exists, if not use rol field (string)
      const [columns] = await connection.query(
        `SELECT COUNT(*) as cnt FROM information_schema.columns 
         WHERE table_schema = ? AND table_name = 'usuarios' AND column_name = 'rol_id'`,
        [process.env.DB_NAME]
      );
      
      const hasRolId = columns[0]?.cnt > 0;
      
      if (hasRolId) {
        const roleId = roleMap.get(user.rol.toLowerCase());
        await connection.query(
          `INSERT INTO usuarios (email, password, nombre, apellido, rol_id, tipo_documento_id, activo)
           VALUES (?, ?, ?, ?, ?, ?, 1)
           ON DUPLICATE KEY UPDATE
             nombre = VALUES(nombre),
             apellido = VALUES(apellido),
             rol_id = VALUES(rol_id),
             tipo_documento_id = VALUES(tipo_documento_id),
             activo = 1`,
          [user.email, user.password, user.nombre, user.apellido, roleId, user.tipo_documento_id]
        );
      } else {
        // Use legacy rol field (string) - no activo column in old schema
        await connection.query(
          `INSERT INTO usuarios (email, password, nombre, apellido, rol, tipo_documento_id)
           VALUES (?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE
             nombre = VALUES(nombre),
             apellido = VALUES(apellido),
             rol = VALUES(rol),
             tipo_documento_id = VALUES(tipo_documento_id)`,
          [user.email, user.password, user.nombre, user.apellido, user.rol.charAt(0).toUpperCase() + user.rol.slice(1), user.tipo_documento_id]
        );
      }
    }

    for (const plato of platillosSeed) {
      await connection.query(
        `INSERT INTO platillos (id, nombre, descripcion, precio, categoria_id, imagen_url, activo)
         VALUES (?, ?, ?, ?, ?, ?, 1)
         ON DUPLICATE KEY UPDATE
           nombre = VALUES(nombre),
           descripcion = VALUES(descripcion),
           precio = VALUES(precio),
           categoria_id = VALUES(categoria_id),
           imagen_url = VALUES(imagen_url),
           activo = 1`,
        [plato.id, plato.nombre, plato.descripcion, plato.precio, plato.categoria_id, plato.imagen_url]
      );
    }

    for (const mesa of mesasSeed) {
      await connection.query(
        `INSERT INTO mesas (id, numero, estado, activa)
         VALUES (?, ?, ?, 1)
         ON DUPLICATE KEY UPDATE
           numero = VALUES(numero),
           estado = VALUES(estado),
           activa = 1`,
        [mesa.id, mesa.numero, mesa.estado]
      );
    }

    await connection.query('INSERT INTO seed_control (nombre) VALUES (?)', ['initial_seed_v2']);

    await connection.commit();
    console.log('✓ Seed inicial ejecutado correctamente (una sola vez)');
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
