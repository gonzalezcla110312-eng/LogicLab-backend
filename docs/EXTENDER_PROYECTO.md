/**
 * ========================================
 * GUÍA: CÓMO AGREGAR NUEVAS CARACTERÍSTICAS
 * ========================================
 * 
 * Este documento te guía paso a paso
 * sobre cómo extender el proyecto
 * 
 * Ejemplo: Agregaremos una tabla de "Mesas"
 * para gestionar las mesas del restaurante
 */

// ========================================
// PASO 1: CREAR LA TABLA EN LA BASE DE DATOS
// ========================================

/*
Abre database.sql y agrega al final:

-- Tabla de Mesas
CREATE TABLE IF NOT EXISTS mesas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  numero INT UNIQUE NOT NULL,
  capacidad INT NOT NULL,
  estado ENUM('disponible', 'ocupada', 'reservada') DEFAULT 'disponible',
  ubicacion VARCHAR(50),
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO mesas (numero, capacidad, estado, ubicacion) VALUES
(1, 2, 'disponible', 'Ventana'),
(2, 4, 'disponible', 'Centro'),
(3, 6, 'disponible', 'Esquina');

Luego ejecuta en phpMyAdmin para crear la tabla.
*/

// ========================================
// PASO 2: CREAR EL SERVICIO (Model)
// ========================================

/*
Crea el archivo: services/mesas.service.js

Con este contenido:

const pool = require('../config/db');

// Obtener todas las mesas
const obtenerTodas = async () => {
  try {
    const conexion = await pool.getConnection();
    const [mesas] = await conexion.query(
      'SELECT * FROM mesas'
    );
    conexion.release();
    return mesas;
  } catch (error) {
    throw new Error('Error al obtener mesas: ' + error.message);
  }
};

// Obtener una mesa por ID
const obtenerPorId = async (id) => {
  try {
    const conexion = await pool.getConnection();
    const [mesas] = await conexion.query(
      'SELECT * FROM mesas WHERE id = ?',
      [id]
    );
    conexion.release();
    return mesas[0];
  } catch (error) {
    throw new Error('Error al obtener mesa: ' + error.message);
  }
};

// Crear una mesa
const crear = async (datos) => {
  try {
    const conexion = await pool.getConnection();
    const [resultado] = await conexion.query(
      'INSERT INTO mesas (numero, capacidad, estado, ubicacion) VALUES (?, ?, ?, ?)',
      [datos.numero, datos.capacidad, datos.estado, datos.ubicacion]
    );
    conexion.release();
    return { id: resultado.insertId, ...datos };
  } catch (error) {
    throw new Error('Error al crear mesa: ' + error.message);
  }
};

// Actualizar una mesa
const actualizar = async (id, datos) => {
  try {
    const conexion = await pool.getConnection();
    const [resultado] = await conexion.query(
      'UPDATE mesas SET numero = ?, capacidad = ?, estado = ?, ubicacion = ? WHERE id = ?',
      [datos.numero, datos.capacidad, datos.estado, datos.ubicacion, id]
    );
    conexion.release();
    return resultado.affectedRows > 0;
  } catch (error) {
    throw new Error('Error al actualizar mesa: ' + error.message);
  }
};

// Eliminar una mesa
const eliminar = async (id) => {
  try {
    const conexion = await pool.getConnection();
    const [resultado] = await conexion.query(
      'DELETE FROM mesas WHERE id = ?',
      [id]
    );
    conexion.release();
    return resultado.affectedRows > 0;
  } catch (error) {
    throw new Error('Error al eliminar mesa: ' + error.message);
  }
};

module.exports = {
  obtenerTodas,
  obtenerPorId,
  crear,
  actualizar,
  eliminar
};
*/

// ========================================
// PASO 3: CREAR EL CONTROLADOR
// ========================================

/*
Crea el archivo: controllers/mesas.controller.js

Con este contenido:

const mesasService = require('../services/mesas.service');
const { validationResult } = require('express-validator');

// Obtener todas las mesas
const obtenerTodas = async (req, res) => {
  try {
    const mesas = await mesasService.obtenerTodas();
    res.status(200).json({
      éxito: true,
      mensaje: 'Mesas obtenidas correctamente',
      cantidad: mesas.length,
      datos: mesas
    });
  } catch (error) {
    res.status(500).json({
      éxito: false,
      error: error.message
    });
  }
};

// Obtener una mesa por ID
const obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (isNaN(id)) {
      return res.status(400).json({
        éxito: false,
        error: 'El ID debe ser un número'
      });
    }
    
    const mesa = await mesasService.obtenerPorId(id);
    
    if (!mesa) {
      return res.status(404).json({
        éxito: false,
        error: 'Mesa no encontrada'
      });
    }
    
    res.status(200).json({
      éxito: true,
      mensaje: 'Mesa obtenida correctamente',
      datos: mesa
    });
  } catch (error) {
    res.status(500).json({
      éxito: false,
      error: error.message
    });
  }
};

// Crear una mesa
const crear = async (req, res) => {
  try {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({
        éxito: false,
        errores: errores.array()
      });
    }
    
    const { numero, capacidad, estado, ubicacion } = req.body;
    
    const nuevaMesa = await mesasService.crear({
      numero,
      capacidad,
      estado,
      ubicacion
    });
    
    res.status(201).json({
      éxito: true,
      mensaje: 'Mesa creada correctamente',
      datos: nuevaMesa
    });
  } catch (error) {
    res.status(500).json({
      éxito: false,
      error: error.message
    });
  }
};

// Actualizar una mesa
const actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { numero, capacidad, estado, ubicacion } = req.body;
    
    if (isNaN(id)) {
      return res.status(400).json({
        éxito: false,
        error: 'El ID debe ser un número'
      });
    }
    
    const mesaExistente = await mesasService.obtenerPorId(id);
    if (!mesaExistente) {
      return res.status(404).json({
        éxito: false,
        error: 'Mesa no encontrada'
      });
    }
    
    const actualizado = await mesasService.actualizar(id, {
      numero,
      capacidad,
      estado,
      ubicacion
    });
    
    if (actualizado) {
      res.status(200).json({
        éxito: true,
        mensaje: 'Mesa actualizada correctamente'
      });
    } else {
      res.status(400).json({
        éxito: false,
        error: 'No se pudo actualizar la mesa'
      });
    }
  } catch (error) {
    res.status(500).json({
      éxito: false,
      error: error.message
    });
  }
};

// Eliminar una mesa
const eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (isNaN(id)) {
      return res.status(400).json({
        éxito: false,
        error: 'El ID debe ser un número'
      });
    }
    
    const mesaExistente = await mesasService.obtenerPorId(id);
    if (!mesaExistente) {
      return res.status(404).json({
        éxito: false,
        error: 'Mesa no encontrada'
      });
    }
    
    const eliminado = await mesasService.eliminar(id);
    
    if (eliminado) {
      res.status(200).json({
        éxito: true,
        mensaje: 'Mesa eliminada correctamente'
      });
    } else {
      res.status(400).json({
        éxito: false,
        error: 'No se pudo eliminar la mesa'
      });
    }
  } catch (error) {
    res.status(500).json({
      éxito: false,
      error: error.message
    });
  }
};

module.exports = {
  obtenerTodas,
  obtenerPorId,
  crear,
  actualizar,
  eliminar
};
*/

// ========================================
// PASO 4: CREAR LAS RUTAS
// ========================================

/*
Crea el archivo: routes/mesas.routes.js

Con este contenido:

const express = require('express');
const { body } = require('express-validator');
const mesasController = require('../controllers/mesas.controller');

const router = express.Router();

// Obtener todas las mesas
router.get('/', mesasController.obtenerTodas);

// Obtener una mesa por ID
router.get('/:id', mesasController.obtenerPorId);

// Crear una mesa
router.post(
  '/',
  [
    body('numero').isInt().withMessage('El número debe ser un entero'),
    body('capacidad').isInt().withMessage('La capacidad debe ser un número'),
    body('estado').isIn(['disponible', 'ocupada', 'reservada']).withMessage('Estado inválido'),
    body('ubicacion').notEmpty().withMessage('La ubicación es requerida')
  ],
  mesasController.crear
);

// Actualizar una mesa
router.put('/:id', mesasController.actualizar);

// Eliminar una mesa
router.delete('/:id', mesasController.eliminar);

module.exports = router;
*/

// ========================================
// PASO 5: REGISTRAR LAS RUTAS EN server.js
// ========================================

/*
Abre server.js y:

1. Importa las rutas de mesas al inicio:
   const rutasMesas = require('./routes/mesas.routes');

2. Registra las rutas donde están las demás:
   app.use('/api/usuarios', rutasUsuarios);
   app.use('/api/mesas', rutasMesas);  // ← Agregar esta línea

3. Reinicia el servidor (npm run dev)

Listo! Ahora tienes los endpoints:
GET    /api/mesas
GET    /api/mesas/:id
POST   /api/mesas
PUT    /api/mesas/:id
DELETE /api/mesas/:id
*/

// ========================================
// ESTRUCTURA DE CARPETAS FINAL
// ========================================

/*

proyectoMauricio/
├── server.js
├── package.json
├── .env
├── database.sql
│
├── config/
│   └── db.js
│
├── services/
│   ├── users.service.js
│   └── mesas.service.js          ← NUEVO
│
├── controllers/
│   ├── usuarios.controller.js
│   └── mesas.controller.js        ← NUEVO
│
├── routes/
│   ├── usuarios.routes.js
│   └── mesas.routes.js            ← NUEVO
│
└── middleware/
    └── autenticacion.js

*/

// ========================================
// CHECKLIST PARA AGREGAR NUEVAS CARACTERÍSTICAS
// ========================================

/*

Para agregar cualquier nueva característica (ej: Pedidos, Productos, etc):

✅ PASO 1: Base de Datos
   [ ] Crear tabla en database.sql
   [ ] Ejecutar el SQL en MySQL
   [ ] Verificar que la tabla se creó

✅ PASO 2: Service (Model)
   [ ] Crear archivo: services/[nombre].service.js
   [ ] Escribir función obtenerTodos()
   [ ] Escribir función obtenerPorId()
   [ ] Escribir función crear()
   [ ] Escribir función actualizar()
   [ ] Escribir función eliminar()

✅ PASO 3: Controller
   [ ] Crear archivo: controllers/[nombre].controller.js
   [ ] Crear función obtenerTodos()
   [ ] Crear función obtenerPorId()
   [ ] Crear función crear()
   [ ] Crear función actualizar()
   [ ] Crear función eliminar()

✅ PASO 4: Routes
   [ ] Crear archivo: routes/[nombre].routes.js
   [ ] Definir rutas GET, POST, PUT, DELETE
   [ ] Agregar validaciones con express-validator

✅ PASO 5: Servidor
   [ ] Importar rutas en server.js
   [ ] Registrar rutas con app.use()
   [ ] Reiniciar servidor

✅ PASO 6: Pruebas
   [ ] Abrir Postman
   [ ] Probar GET (obtener todos)
   [ ] Probar GET :id (obtener uno)
   [ ] Probar POST (crear)
   [ ] Probar PUT (actualizar)
   [ ] Probar DELETE (eliminar)

*/

// ========================================
// ESTRUCTURA DE UNA NUEVA TABLA
// ========================================

/*

REGLA GENERAL: Para cada tabla en la BD:

1 tabla      → 1 service    → 1 controller    → 1 routes    → endpoints

Usuarios:
- users.service.js
- usuarios.controller.js
- usuarios.routes.js
- Endpoints: /api/usuarios

Mesas:
- mesas.service.js
- mesas.controller.js
- mesas.routes.js
- Endpoints: /api/mesas

Pedidos:
- pedidos.service.js
- pedidos.controller.js
- pedidos.routes.js
- Endpoints: /api/pedidos

*/

// ========================================
// TIPS Y BUENAS PRÁCTICAS
// ========================================

/*

1. NOMBRES CONSISTENTES:
   ✅ Bien:  mesasService, usuarios.routes.js
   ❌ Mal:   MesasService, usuariosRutas.js

2. COMENTARIOS ÚTILES:
   ✅ Bien:  // Obtener mesa por ID
   ❌ Mal:   // Function

3. VALIDACIONES:
   ✅ Siempre valida los datos que recibe
   ✅ Verifica que los IDs sean números
   ✅ Verifica que los emails sean válidos

4. MANEJO DE ERRORES:
   ✅ Usa try-catch en funciones async
   ✅ Devuelve códigos HTTP correctos (404, 400, 500)
   ✅ Mensajes de error claros

5. COMMITS GIT:
   ✅ Bien:  "Agregar CRUD de mesas"
   ❌ Mal:   "cambios varios"

*/

console.log('📚 Lee este archivo para aprender a extender el proyecto');
