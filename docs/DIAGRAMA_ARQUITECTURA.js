/**
 * ========================================
 * DIAGRAMA DE ARQUITECTURA
 * ========================================
 * 
 * Visual de cómo funciona el proyecto
 */

console.log(`
╔══════════════════════════════════════════════════════════════════╗
║              📊 ARQUITECTURA DE LA API REST                      ║
╚══════════════════════════════════════════════════════════════════╝

1️⃣  CLIENTE (Frontend)
    ├─ Navegador web
    ├─ Aplicación móvil
    └─ Postman

        │
        ├─ GET /api/usuarios
        ├─ POST /api/usuarios
        ├─ PUT /api/usuarios/:id
        ├─ DELETE /api/usuarios/:id
        └─ POST /api/usuarios/login
        │
        ▼

2️⃣  EXPRESS SERVER (server.js)
    ┌────────────────────────────────────┐
    │ Middleware Global                  │
    ├──────────────────────────────────┤
    │ • CORS (permitir otros orígenes)  │
    │ • JSON Parser (leer JSON)         │
    │ • URL Parser (datos de formularios)│
    └────────────────────────────────────┘
        │
        ├─ Valida formato
        ├─ Verifica autenticación
        └─ Enruta a controlador
        │
        ▼

3️⃣  RUTAS (routes/usuarios.routes.js)
    ┌────────────────────────────────────┐
    │ GET    /                           │
    │ POST   /login                      │
    │ GET    /:id                        │
    │ POST   /                           │
    │ PUT    /:id                        │
    │ DELETE /:id                        │
    └────────────────────────────────────┘
        │
        └─ Llama al controlador correspondiente
        │
        ▼

4️⃣  CONTROLADORES (controllers/usuarios.controller.js)
    ┌────────────────────────────────────┐
    │ • Valida datos (express-validator) │
    │ • Procesa lógica de negocio        │
    │ • Llama al service                 │
    │ • Prepara respuesta JSON           │
    └────────────────────────────────────┘
        │
        └─ Llama al service para datos
        │
        ▼

5️⃣  SERVICES/MODELS (services/users.service.js)
    ┌────────────────────────────────────┐
    │ • Conecta a la base de datos       │
    │ • Ejecuta queries SQL              │
    │ • Devuelve datos al controlador    │
    │                                    │
    │ Funciones:                        │
    │ • obtenerTodos()                  │
    │ • obtenerPorId(id)                │
    │ • crear(datos)                    │
    │ • actualizar(id, datos)           │
    │ • eliminar(id)                    │
    │ • verificarPassword()             │
    └────────────────────────────────────┘
        │
        └─ Se conecta a MySQL
        │
        ▼

6️⃣  BASE DE DATOS MYSQL
    ┌────────────────────────────────────┐
    │  Tabla: usuarios                   │
    ├────────────────────────────────────┤
    │  id              INT               │
    │  email           VARCHAR(100)      │
    │  password        VARCHAR(255)      │
    │  nombre          VARCHAR(50)       │
    │  apellido        VARCHAR(50)       │
    │  rol             VARCHAR(50)       │
    │  Tipo_documentoId INT              │
    │  Roles_usuariosId INT              │
    │  fecha_creacion   TIMESTAMP        │
    │  fecha_actualizacion TIMESTAMP     │
    └────────────────────────────────────┘

════════════════════════════════════════════════════════════════════

📋 FLUJO COMPLETO DE UNA SOLICITUD (Ejemplo: Crear Usuario)

┌──────────────────────────────────────────────────────────────────┐
│ 1. CLIENTE ENVÍA:                                                │
│    POST /api/usuarios                                            │
│    Body: {email: "nuevo@gmail.com", password: "123456", ...}    │
└──────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│ 2. EXPRESS RECIBE (server.js):                                   │
│    • Middleware valida que es JSON válido                        │
│    • Middleware aplica CORS                                      │
└──────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│ 3. ROUTER IDENTIFICA (routes/usuarios.routes.js):               │
│    • Es un POST a / (crear)                                      │
│    • Validations: email debe ser válido, password >= 6 caracteres│
│    • Llama a: usuariosController.crear()                        │
└──────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│ 4. CONTROLADOR PROCESA (controllers/usuarios.controller.js):     │
│    • Verifica validaciones                                       │
│    • Llama: usuariosService.obtenerPorEmail(email)             │
│    • Si existe, responde error: "Email ya registrado"           │
│    • Si no existe, llama: usuariosService.crear(datos)         │
└──────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│ 5. SERVICE ACCEDE BD (services/users.service.js):               │
│    • Obtiene conexión del pool                                   │
│    • Hashea la contraseña con bcrypt                             │
│    • Ejecuta: INSERT INTO usuarios (...)                         │
│    • MySQL inserta el registro                                   │
│    • Service devuelve datos del usuario creado                   │
└──────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│ 6. CONTROLADOR PREPARA RESPUESTA:                                │
│    {                                                             │
│      "éxito": true,                                             │
│      "mensaje": "Usuario creado correctamente",                 │
│      "datos": {                                                  │
│        "id": 4,                                                  │
│        "email": "nuevo@gmail.com",                              │
│        "nombre": "..."                                           │
│      }                                                           │
│    }                                                             │
│    Status: 201 (Creado)                                          │
└──────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│ 7. CLIENTE RECIBE RESPUESTA                                      │
│    Status: 201 OK                                                │
│    Body: JSON con los datos del usuario creado                   │
└──────────────────────────────────────────────────────────────────┘

════════════════════════════════════════════════════════════════════

📁 ÁRBOL DE ARCHIVOS

proyectoMauricio/
│
├─ 📄 server.js                     ← Servidor Express (PRINCIPAL)
├─ 📄 package.json                  ← Dependencias
├─ 📄 .env                          ← Configuración (secreto)
├─ 📄 .gitignore                    ← Archivos a ignorar en Git
├─ 📄 database.sql                  ← Script para crear BD
├─ 📄 README.md                     ← Documentación completa
├─ 📄 INICIO_RAPIDO.js             ← Guía de inicio
├─ 📄 EJEMPLOS_USO.js              ← Ejemplos de código
├─ 📄 EXTENDER_PROYECTO.md         ← Cómo agregar características
│
├─ 📁 config/                       ← Configuraciones
│  └─ 📄 db.js                      ← Conexión MySQL
│
├─ 📁 services/                     ← Acceso a datos (Models)
│  └─ 📄 users.service.js           ← Operaciones de usuarios
│
├─ 📁 controllers/                  ← Lógica de negocio
│  └─ 📄 usuarios.controller.js     ← Controlador de usuarios
│
├─ 📁 routes/                       ← Definición de endpoints
│  └─ 📄 usuarios.routes.js         ← Rutas de usuarios
│
├─ 📁 middleware/                   ← Middleware personalizado
│  └─ 📄 autenticacion.js           ← Verificación de tokens
│
└─ 📄 db.json                       ← Datos JSONServer (legado)

════════════════════════════════════════════════════════════════════

🔄 CICLO DE VIDA DE LA SOLICITUD

Usuario hace request
        │
        ▼
Express recibe
        │
        ▼
Middleware global procesa
        │
        ▼
Router identifica ruta
        │
        ▼
Middleware específico (validación, autenticación)
        │
        ▼
Controlador ejecuta lógica
        │
        ▼
Service accede base de datos
        │
        ▼
MySQL devuelve datos
        │
        ▼
Service devuelve al controlador
        │
        ▼
Controlador prepara respuesta
        │
        ▼
Express envía respuesta JSON
        │
        ▼
Cliente recibe respuesta

════════════════════════════════════════════════════════════════════

🎯 OBJETIVO DE CADA CARPETA

┌─────────────────────────────────────────────────────────────────┐
│ CARPETA         │ OBJETIVO                                      │
├─────────────────────────────────────────────────────────────────┤
│ config/         │ Configuraciones (BD, env, etc)               │
│ services/       │ Acceso a datos (queries, modelos)            │
│ controllers/    │ Lógica de negocio (procesa datos)            │
│ routes/         │ Definición de endpoints (URLs)               │
│ middleware/     │ Funciones que se ejecutan antes (validación) │
└─────────────────────────────────────────────────────────────────┘

════════════════════════════════════════════════════════════════════

✨ RESUMEN: LOS 5 PASOS PARA CREAR UN ENDPOINT

1. Crear tabla en MySQL (database.sql)
2. Crear funciones en service (services/*)
3. Crear controlador (controllers/*)
4. Crear rutas (routes/*)
5. Registrar rutas en server.js

¡Repite estos pasos para cada nueva característica!

════════════════════════════════════════════════════════════════════
`);
