# 🍽️ API REST - Restaurante Mauricio

## 📚 Documentación para Junior Developers

Esta es una **API REST profesional** construida con **Express.js** y **MySQL**. Si eres nuevo en programación, esta documentación te guiará paso a paso.

---

## 📋 Contenido

1. [Conceptos Básicos](#conceptos-básicos)
2. [Instalación](#instalación)
3. [Configuración](#configuración)
4. [Estructura del Proyecto](#estructura-del-proyecto)
5. [Cómo Funciona](#cómo-funciona)
6. [Endpoints (Rutas)](#endpoints-rutas)
7. [Ejemplos de Uso](#ejemplos-de-uso)
8. [Errores Comunes](#errores-comunes)
9. [Próximos Pasos](#próximos-pasos)

---

## 🎓 Conceptos Básicos

### ¿Qué es una API REST?

Una **API REST** es un servicio en internet que permite comunicación entre aplicaciones. Piensa en ella como un **mesero en un restaurante**:

- **Cliente**: Es quien pide (tu aplicación frontend)
- **API**: Es el mesero que recibe el pedido y lo entrega
- **Base de Datos**: Es la cocina que prepara lo solicitado

### Métodos HTTP Principales

```
GET    = Obtener información (leer)
POST   = Crear nueva información
PUT    = Actualizar información existente
DELETE = Eliminar información
```

### Formato de Respuesta

Todas nuestras respuestas usan **JSON** (formato de datos):

```json
{
  "éxito": true,
  "mensaje": "Usuario creado correctamente",
  "datos": {
    "id": 1,
    "email": "usuario@gmail.com",
    "nombre": "Juan"
  }
}
```

---

## 🚀 Instalación

### Paso 1: Requisitos Previos

Necesitas tener instalado:
- **Node.js** (descárgalo de nodejs.org)
- **MySQL** (descárgalo de mysql.com)
- **Visual Studio Code** (para editar código)

### Paso 2: Descargar Dependencias

Abre la terminal en la carpeta del proyecto y ejecuta:

```bash
npm install
```

Esto descargará todas las librerías necesarias.

### Paso 3: Crear la Base de Datos

1. Abre **phpMyAdmin** o tu cliente MySQL favorito
2. Copia todo el contenido del archivo `database.sql`
3. Pégalo en tu cliente MySQL y ejecuta
4. Listo! La tabla de usuarios se creará automáticamente

---

## ⚙️ Configuración

### 1. Archivo `.env`

Este archivo contiene la configuración privada de tu aplicación. **Nunca lo compartas en GitHub!**

```ini
# Base de Datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=restaurante_db
DB_PORT=3306

# Servidor
PORT=3001
NODE_ENV=development

# Autenticación
JWT_SECRET=tu_clave_secreta_super_segura_123456789
JWT_EXPIRE=24h
```

**Explica cada línea:**
- `DB_HOST`: Donde está MySQL (localhost = tu máquina)
- `DB_USER`: Usuario para conectarse a MySQL (root es el por defecto)
- `DB_PASSWORD`: Contraseña de MySQL
- `DB_NAME`: Nombre de tu base de datos
- `PORT`: Puerto donde corre tu API (3001 es estándar)
- `JWT_SECRET`: Clave para generar tokens (usa algo largo y seguro)

### 2. Variables de Entorno en Windows

Si necesitas variables de entorno a nivel del sistema:

```powershell
setx DB_HOST localhost
setx DB_USER root
```

---

## 📁 Estructura del Proyecto

```
proyectoMauricio/
├── server.js                    ← Archivo principal (inicia todo)
├── package.json                 ← Dependencias del proyecto
├── .env                         ← Variables de configuración (privadas)
├── database.sql                 ← Script para crear la BD
│
├── config/
│   └── db.js                   ← Conexión a MySQL
│
├── services/ (Models)
│   └── users.service.js        ← Lógica de datos de usuarios
│
├── controllers/
│   └── usuarios.controller.js  ← Lógica de negocio
│
├── routes/
│   └── usuarios.routes.js      ← Definición de endpoints
│
├── middleware/
│   └── autenticacion.js        ← Verificación de tokens
│
└── db.json                      ← Datos antiguos (mantener para referencia)
```

### ¿Qué es cada carpeta?

| Carpeta | Función |
|---------|---------|
| **config** | Configuración de conexiones (BD, etc) |
| **services** | Acceso a la base de datos (leer/escribir) |
| **controllers** | Lógica del negocio (qué hacer con los datos) |
| **routes** | Definición de endpoints y URLs |
| **middleware** | Funciones que se ejecutan antes de controladores |

---

## 🔄 Cómo Funciona

Cuando haces una petición, pasa por estos pasos:

```
1. Cliente envía solicitud
    ↓
2. Express recibe la solicitud
    ↓
3. Middleware valida el formato (autenticación, validación)
    ↓
4. Router identifica qué controlador usar
    ↓
5. Controlador procesa la lógica
    ↓
6. Service consulta la base de datos
    ↓
7. BD devuelve los datos
    ↓
8. Service devuelve datos al Controlador
    ↓
9. Controlador prepara la respuesta en JSON
    ↓
10. Express envía la respuesta al Cliente
```

---

## 📡 Endpoints (Rutas)

### Autenticación (Sin protección)

#### 🔑 Login
```
POST /api/usuarios/login
```

**Qué hace:** Verifica el email y contraseña, devuelve un token

**Datos que envías:**
```json
{
  "email": "andres@gmail.com",
  "password": "123456"
}
```

**Respuesta exitosa (200):**
```json
{
  "éxito": true,
  "mensaje": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "email": "andres@gmail.com",
    "nombre": "Andres",
    "rol": "Mesero"
  }
}
```

## 👥 Usuarios de Prueba

| Email | Rol | Password |
|-------|-----|----------|
| andres@gmail.com | mesero | 123456 |
| Velandia@gmail.com | cocinero | 123456 |
| Solarte@gmail.com | cocinero | 123456 |
| Claude@gmail.com | mesero | 123456 |
| Admin@gmail.com | administrador | 123456 |


---

### Usuarios (Sin protección - por ahora)

#### 📋 Obtener Todos los Usuarios
```
GET /api/usuarios
```

**Respuesta:**
```json
{
  "éxito": true,
  "mensaje": "Usuarios obtenidos correctamente",
  "cantidad": 3,
  "datos": [
    {
      "id": 1,
      "email": "andres@gmail.com",
      "nombre": "Andres",
      "apellido": "Sanabria",
      "rol": "Mesero"
    }
  ]
}
```

---

#### 👤 Obtener Un Usuario por ID
```
GET /api/usuarios/1
```

**Respuesta:**
```json
{
  "éxito": true,
  "mensaje": "Usuario obtenido correctamente",
  "datos": {
    "id": 1,
    "email": "andres@gmail.com",
    "nombre": "Andres",
    "apellido": "Sanabria",
    "rol": "Mesero"
  }
}
```

---

#### ➕ Crear Un Nuevo Usuario
```
POST /api/usuarios
```

**Datos que envías:**
```json
{
  "email": "nuevo@gmail.com",
  "password": "123456",
  "nombre": "Carlos",
  "apellido": "García",
  "rol": "Cocinero",
  "Tipo_documentoId": 1,
  "Roles_usuariosId": 2
}
```

**Respuesta (201 - Creado):**
```json
{
  "éxito": true,
  "mensaje": "Usuario creado correctamente",
  "datos": {
    "id": 4,
    "email": "nuevo@gmail.com",
    "nombre": "Carlos",
    "apellido": "García"
  }
}
```

---

#### ✏️ Actualizar Usuario
```
PUT /api/usuarios/1
```

**Datos que envías:**
```json
{
  "email": "actualizado@gmail.com",
  "nombre": "Andres",
  "apellido": "Sanabria Actualizado",
  "rol": "Mesero",
  "Tipo_documentoId": 1,
  "Roles_usuariosId": 2
}
```

**Respuesta:**
```json
{
  "éxito": true,
  "mensaje": "Usuario actualizado correctamente"
}
```

---

#### ❌ Eliminar Usuario
```
DELETE /api/usuarios/1
```

**Respuesta:**
```json
{
  "éxito": true,
  "mensaje": "Usuario eliminado correctamente"
}
```

---

## 💻 Ejemplos de Uso

### Con cURL (Terminal)

#### 1. Obtener todos los usuarios
```bash
curl http://localhost:3001/api/usuarios
```

#### 2. Login
```bash
curl -X POST http://localhost:3001/api/usuarios/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"andres@gmail.com\",\"password\":\"123456\"}"
```

#### 3. Crear usuario
```bash
curl -X POST http://localhost:3001/api/usuarios \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"carlos@gmail.com\",\"password\":\"123456\",\"nombre\":\"Carlos\",\"apellido\":\"García\",\"rol\":\"Cocinero\",\"Tipo_documentoId\":1,\"Roles_usuariosId\":2}"
```

---

### Con Postman (Herramienta Gráfica)

**Postman** es una herramienta visual para probar APIs. Descárgala de postman.com

**Pasos:**

1. **Crear nueva request**
   - Haz click en "+" o "New"
   - Selecciona "Request"

2. **Configurar GET**
   - Cambia a "GET" en el dropdown
   - En URL: `http://localhost:3001/api/usuarios`
   - Click "Send"

3. **Configurar POST**
   - Cambia a "POST"
   - En URL: `http://localhost:3001/api/usuarios`
   - Click en "Body" → "raw" → selecciona "JSON"
   - Pega tu JSON:
   ```json
   {
     "email": "nuevo@gmail.com",
     "password": "123456",
     "nombre": "Juan",
     "apellido": "Pérez",
     "rol": "Mesero",
     "Tipo_documentoId": 1,
     "Roles_usuariosId": 1
   }
   ```
   - Click "Send"

---

### Con JavaScript/Fetch API

```javascript
// Obtener todos los usuarios
fetch('http://localhost:3001/api/usuarios')
  .then(response => response.json())
  .then(data => console.log(data));

// Crear usuario
fetch('http://localhost:3001/api/usuarios', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'nuevo@gmail.com',
    password: '123456',
    nombre: 'Juan',
    apellido: 'Pérez',
    rol: 'Mesero',
    Tipo_documentoId: 1,
    Roles_usuariosId: 1
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

---

## ⚠️ Errores Comunes

### Error: "Cannot find module 'express'"
**Causa:** No instalaste las dependencias
**Solución:** Ejecuta `npm install`

### Error: "Connection refused on 127.0.0.1:3306"
**Causa:** MySQL no está corriendo
**Solución:** Abre MySQL y verifica que esté funcionando

### Error: "Unknown database 'restaurante_db'"
**Causa:** No ejecutaste el script database.sql
**Solución:** Copia el contenido de database.sql en phpMyAdmin y ejecuta

### Error: "Email ya está registrado"
**Causa:** Intentaste crear un usuario con un email que ya existe
**Solución:** Usa otro email o elimina el usuario existente

### Error: "Validations Failed"
**Causa:** Los datos que envías no son válidos (ej: email mal formado)
**Solución:** Verifica que envías los datos correctos

---

## 📈 Próximos Pasos

### 1. Agregar Más Endpoints
- Crear tabla de Pedidos
- Crear tabla de Mesas
- Agregar rutas para gestionar pedidos

### 2. Implementar Autenticación Completa
- Descomentar el middleware de autenticación en routes
- Proteger endpoints sensibles

### 3. Agregar Validación de Roles
- Solo administradores pueden eliminar usuarios
- Solo meseros ven ciertos datos

### 4. Crear Frontend
- Crear una página web que consuma esta API
- Usar HTML, CSS, JavaScript

### 5. Desplegar a Producción
- Hostear en Heroku, Railway, o similares
- Configurar dominio personalizado
- Usar HTTPS

---

## 🔐 Seguridad Importante

### ❌ NUNCA hagas esto:
```javascript
// ❌ MALO - Guardar contraseña sin encriptar
password: "123456"

// ❌ MALO - Poner secreto en el código
const JWT_SECRET = "mi_clave_123";
```

### ✅ SIEMPRE haz esto:
```javascript
// ✅ BUENO - Usar bcrypt
const hasheada = await bcrypt.hash("123456", 10);

// ✅ BUENO - Usar variables de entorno
const JWT_SECRET = process.env.JWT_SECRET;

// ✅ BUENO - Usar HTTPS en producción
```

---

## 📚 Recursos Útiles

- [Documentación de Express.js](https://expressjs.com/)
- [Documentación de MySQL](https://dev.mysql.com/doc/)
- [JWT Explicado](https://jwt.io/)
- [RESTful API Design](https://restfulapi.net/)
- [Tutorial de bcrypt](https://github.com/kelektiv/node.bcrypt.js)

---

## 🤝 Soporte

Si tienes problemas:

1. **Revisa los logs** - Lee los mensajes de error en la terminal
2. **Verifica la configuración** - Comprueba que .env está correcto
3. **Prueba con Postman** - Verifica que la API responde
4. **Lee la documentación** - Este README tiene todo explicado

---

## 📝 Notas Finales

- Este proyecto es educativo, perfecto para aprender
- Usa esta estructura para proyectos mayores
- No es recomendable subir `.env` a GitHub (crea .gitignore)
- Siempre mantén tu código limpio y documentado

**¡Felicidades! Ya tienes una API REST profesional funcionando!** 🎉

