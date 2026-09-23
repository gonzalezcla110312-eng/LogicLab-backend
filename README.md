# LogicLab API

Backend del sistema **LogicLab** para la gestión de restaurante. Este proyecto expone una API REST para administrar usuarios, mesas, platillos, menú del día, pedidos, reservaciones y dashboard administrativo.

## Descripción general

LogicLab API está desarrollada con **Node.js + Express** y utiliza **MySQL** como base de datos principal.

El proyecto incluye soporte para Docker para levantar la base de datos de forma rápida y reproducible.

Actualmente el backend cuenta con módulos para:

- Autenticación y autorización.
- Gestión de usuarios y roles.
- Gestión de mesas.
- Gestión de pedidos.
- Gestión de platillos.
- Gestión del menú del día.
- Gestión de reservaciones.
- Dashboard administrativo.
- Consulta de estadísticas e ingresos.
- Gestión de archivos e imágenes.
- Documentación interactiva mediante Swagger.

---

## Requisitos del sistema

| Requisito | Versión recomendada | Nota |
|---|---:|---|
| Node.js | 18 o superior | Compatible con el stack actual |
| npm | 9 o superior | Incluido con Node.js |
| Docker | Última versión estable | Para levantar MySQL |
| MySQL | 8.0 | Se ejecuta en contenedor |
| Git | Última versión | Para clonar y subir cambios |

---

## Tecnologías usadas

| Tecnología | Uso | Versión |
|---|---|---:|
| Node.js | Runtime del backend | 18+ |
| Express | Framework HTTP | `^4.18.2` |
| MySQL2 | Cliente para MySQL | `^3.6.5` |
| dotenv | Variables de entorno | `^16.3.1` |
| bcryptjs | Hash de contraseñas | `^2.4.3` |
| jsonwebtoken | JWT para autenticación | `^9.0.2` |
| cors | Habilitar CORS | `^2.8.5` |
| express-validator | Validación de entradas | `^7.0.0` |
| multer | Subida de imágenes | `^2.0.2` |
| swagger-ui-express | Documentación interactiva OpenAPI | `^5.0.1` |
| nodemon | Recarga automática en desarrollo | `^3.0.1` |
| MySQL | Base de datos relacional | `8.0` |

---

## Flujo recomendado de instalación y ejecución

### 1) Clonar el repositorio

```bash
git clone https://github.com/gonzalezcla110312-eng/LogicLab-backend.git

cd LogicLab-backend
```

### 2) Instalar dependencias

```bash
npm install
```

### 3) Preparar el archivo `.env`

Copia el ejemplo si existe:

```bash
copy .env.example .env
```

En Linux/macOS:

```bash
cp .env.example .env
```

### 4) Ejecutar la API

Modo desarrollo:

```bash
npm run dev
```

Modo producción:

```bash
npm start
```

### 5) Verificar que todo funcione

La API estará disponible en:

```text
http://localhost:3001
```

Puedes probar el endpoint raíz:

```bash
curl http://localhost:3001/
```

---

## Documentación Swagger

Con la API en ejecución, abre la documentación interactiva en:

```text
http://localhost:3001/api-docs
```

La especificación OpenAPI también está disponible como JSON en:

```text
http://localhost:3001/api-docs.json
```

Para probar endpoints protegidos, utiliza el botón **Authorize** e introduce el token JWT obtenido mediante:

```text
POST /api/usuarios/login
```

---

## 🔐 Autenticación

El backend utiliza **JWT (JSON Web Token)** para proteger las rutas que requieren autenticación.

Las solicitudes protegidas deben enviar el token correspondiente en los encabezados HTTP.

Ejemplo:

```http
Authorization: Bearer <token>
```

Si una ruta protegida recibe una solicitud sin token, el backend puede responder:

```json
{
  "exito": false,
  "error": "Token no proporcionado"
}
```

---

## 👥 Roles del sistema

El sistema contempla diferentes tipos de usuarios y permisos.

Entre los roles utilizados por el sistema se encuentran:

- Administrador.
- Mesero.
- Cocinero.

Los permisos se controlan mediante autenticación y validaciones de autorización.

Algunas operaciones administrativas requieren específicamente el rol de administrador, mientras que otras operaciones pueden estar disponibles para meseros o cocineros.

---

## 👤 Usuarios

El backend permite gestionar los usuarios registrados en el sistema.

Entre las operaciones disponibles se encuentran:

- Registro de usuarios.
- Inicio de sesión.
- Consulta de usuarios.
- Consulta de usuario por ID.
- Actualización de información.
- Gestión de roles.
- Activación de usuarios.
- Inactivación de usuarios.
- Validación de credenciales.
- Protección de información mediante contraseñas cifradas.

Las contraseñas se almacenan utilizando `bcryptjs`.

---

## 🪑 Mesas

El backend administra las mesas disponibles en el restaurante.

Las operaciones relacionadas con mesas incluyen:

- Consulta de mesas.
- Creación de mesas.
- Edición de mesas.
- Liberación de mesas.
- Consulta de pedidos asociados.
- Consulta del pedido activo de una mesa.
- Creación de pedidos para una mesa.

Las mesas también se relacionan con el módulo de reservaciones.

---

## 🧾 Pedidos

El backend permite gestionar los pedidos realizados en el restaurante.

Las operaciones incluyen:

- Creación de pedidos.
- Consulta de pedidos.
- Consulta de pedidos por ID.
- Actualización de estados.
- Edición de pedidos activos.
- Asociación de pedidos con mesas.
- Asociación de productos o platillos.
- Marcación de pedidos como entregados.
- Consulta de pedidos activos para cocina.

Los pedidos son almacenados en MySQL.

---

## 🍽️ Platillos

El backend permite gestionar los platillos disponibles en el restaurante.

Las operaciones incluyen:

- Consulta de platillos.
- Creación de platillos.
- Actualización de platillos.
- Gestión de imágenes.
- Disponibilidad de platillos.

Los archivos subidos para los platillos se almacenan en la carpeta:

```text
uploads/
```

---

## 📋 Menú del día

El backend permite gestionar el menú correspondiente a diferentes fechas.

Las operaciones incluyen:

- Consulta de menús.
- Consulta del menú del día.
- Consulta de menú por fecha.
- Creación o actualización del menú.
- Limpieza de menús por rango.

---

# 📅 Reservaciones

Se agregó un módulo completo para la gestión de **reservaciones de mesas**.

Este módulo permite administrar las reservas realizadas por los clientes y está integrado con el sistema de mesas.

El módulo está compuesto por:

```text
controllers/reservaciones.controller.js
routes/reservaciones.routes.js
services/reservaciones.service.js
```

También se agregó la estructura correspondiente en:

```text
db/DDL.sql
```

---

## 📋 Información de una reservación

Una reservación puede contener información como:

- Nombre del cliente.
- Teléfono.
- Correo electrónico.
- Mesa.
- Fecha.
- Hora.
- Número de personas.
- Observaciones.
- Estado de la reservación.

---

## 🔄 Estados de una reservación

Las reservaciones manejan diferentes estados según el flujo administrativo:

- Pendiente.
- Confirmada.
- Atendida.
- Cancelada.

El estado puede actualizarse mediante el endpoint correspondiente.

---

## ⏱️ Duración de las reservaciones

El sistema utiliza una duración fija de **2 horas** para validar conflictos entre reservaciones.

Esto permite comprobar si existe una reservación que se superponga con el horario solicitado.

---

## 🚫 Validación de conflictos

Antes de registrar una nueva reservación, el backend valida que no exista otra reservación incompatible para la misma mesa y horario.

De esta manera se evita registrar dos reservaciones que se crucen en el mismo período.

---

## 🪑 Relación entre reservaciones y mesas

Las reservaciones están relacionadas con las mesas existentes en la base de datos.

La relación se maneja mediante la tabla:

```text
reservaciones
```

y la tabla:

```text
mesas
```

La creación o modificación de una reservación **no cambia automáticamente el estado operativo de la mesa**.

La gestión del estado de las mesas continúa siendo independiente.

---

# 🌐 API de Reservaciones

La API de reservaciones utiliza el prefijo:

```text
/api/reservaciones
```

### Obtener reservaciones

```http
GET /api/reservaciones
```

Permite consultar las reservaciones registradas.

### Crear una reservación

```http
POST /api/reservaciones
```

Permite registrar una nueva reservación.

Los datos principales incluyen información del cliente, mesa, fecha, hora, número de personas y observaciones.

### Actualizar una reservación

```http
PUT /api/reservaciones/:id
```

Permite modificar la información de una reservación existente.

### Actualizar el estado de una reservación

```http
PATCH /api/reservaciones/:id/estado
```

Permite modificar el estado de una reservación.

Ejemplo:

```json
{
  "estado": "confirmada"
}
```

### Consultar mesas

El módulo de reservaciones utiliza la información de las mesas disponibles para seleccionar la mesa correspondiente al momento de crear o editar una reservación.

---

# 🗄️ Base de datos

El backend utiliza **MySQL** como sistema de gestión de base de datos.

La base de datos principal utilizada por el proyecto es:

```text
LogicLab
```

La estructura de la base de datos se encuentra definida mediante los archivos SQL del proyecto.

El backend realiza la conexión con MySQL y ejecuta el proceso de inicialización correspondiente.

---

## 📊 Tablas relacionadas con el sistema

Entre las entidades utilizadas por el sistema se encuentran:

- usuarios
- clientes
- empleados
- mesas
- platillos
- pedidos
- detalle_pedido
- reservaciones
- y las demás tablas definidas en los archivos SQL del proyecto.

El módulo de reservaciones agregó específicamente la tabla:

```text
reservaciones
```

relacionada con:

```text
mesas
```

---

# 🐳 Docker

El proyecto incluye configuración para ejecutar MySQL mediante Docker.

El archivo principal de configuración es:

```text
docker-compose.yml
```

Para iniciar los servicios:

```bash
docker compose up -d
```

Para detenerlos:

```bash
docker compose down
```

Para consultar los contenedores activos:

```bash
docker ps
```

---

# ⚙️ Variables de entorno

El backend utiliza variables de entorno mediante un archivo:

```text
.env
```

Ejemplo de configuración:

```env
DB_HOST=localhost
DB_USER=logiclab_user
DB_PASSWORD=tu_password
DB_NAME=LogicLab
DB_PORT=3306
PORT=3001
NODE_ENV=development
CORS_ORIGIN=*
JWT_SECRET=tu_clave_secreta
JWT_EXPIRE=24h
```

**Nunca publiques contraseñas, claves JWT u otra información sensible en GitHub.**

El archivo `.env` debe mantenerse fuera del repositorio cuando contiene credenciales reales.

---

# 📁 Estructura del proyecto

```text
LogicLab-backend/
│
├── config/
│   └── Configuración de la base de datos
│
├── controllers/
│   ├── usuarios.controller.js
│   ├── reservaciones.controller.js
│   └── Otros controladores
│
├── middleware/
│   └── Autenticación, validaciones y carga de archivos
│
├── routes/
│   ├── usuarios.routes.js
│   ├── reservaciones.routes.js
│   └── Otras rutas
│
├── services/
│   ├── users.service.js
│   ├── reservaciones.service.js
│   └── Otros servicios
│
├── docs/
│   └── Documentación del proyecto
│
├── uploads/
│   └── Archivos e imágenes subidos
│
├── db/
│   └── DDL.sql
│
├── docker-compose.yml
├── server.js
├── package.json
├── package-lock.json
└── README.md
```

---

# 🌐 Endpoints principales

La API expone sus recursos bajo el prefijo:

```text
/api
```

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| `GET` | `/` | Verificar estado de la API | No |
| `POST` | `/api/usuarios/login` | Inicio de sesión | No |
| `GET` | `/api/usuarios/roles` | Listar roles disponibles | Sí |
| `GET` | `/api/usuarios` | Listar usuarios | Sí (admin) |
| `GET` | `/api/usuarios/:id` | Obtener usuario por ID | Sí |
| `POST` | `/api/usuarios` | Crear usuario | Sí (admin) |
| `PUT` | `/api/usuarios/:id` | Actualizar usuario | Sí (admin) |
| `PATCH` | `/api/usuarios/:id/activar` | Activar usuario | Sí (admin) |
| `PATCH` | `/api/usuarios/:id/inactivar` | Inactivar usuario | Sí (admin) |
| `GET` | `/api/mesas` | Listar mesas | Sí |
| `GET` | `/api/mesas/pedidos` | Listar pedidos | Sí |
| `GET` | `/api/mesas/pedidos/activos/cocina` | Pedidos activos para cocina | Sí (admin/cocinero) |
| `GET` | `/api/mesas/:id/pedido-activo` | Pedido activo de una mesa | Sí (admin/mesero) |
| `POST` | `/api/mesas` | Crear mesa | Sí (admin/mesero) |
| `PUT` | `/api/mesas/:id` | Editar mesa | Sí (admin/mesero) |
| `PATCH` | `/api/mesas/:id/liberar` | Liberar mesa | Sí (admin/mesero) |
| `POST` | `/api/mesas/:id/pedidos` | Crear pedido para una mesa | Sí (admin/mesero) |
| `GET` | `/api/mesas/pedidos/:pedidoId` | Obtener pedido por ID | Sí |
| `PATCH` | `/api/mesas/pedidos/:pedidoId/estado` | Actualizar estado del pedido | Sí |
| `PUT` | `/api/mesas/pedidos/:pedidoId` | Editar pedido activo | Sí (admin/mesero) |
| `PATCH` | `/api/mesas/pedidos/:pedidoId/entregar` | Marcar entrega | Sí (admin/cocinero) |
| `GET` | `/api/platillos` | Listar platillos | No |
| `POST` | `/api/platillos` | Crear platillo | Sí (admin/cocinero) |
| `PUT` | `/api/platillos/:id` | Actualizar platillo | Sí (admin/cocinero) |
| `GET` | `/api/menu-dia` | Listar menús por rango | No |
| `GET` | `/api/menu-dia/hoy` | Obtener menú del día | No |
| `GET` | `/api/menu-dia/:fecha` | Obtener menú por fecha | No |
| `PUT` | `/api/menu-dia/:fecha` | Crear o actualizar menú | Sí (admin/cocinero) |
| `DELETE` | `/api/menu-dia/limpiar` | Limpiar menús por rango | Sí (admin/cocinero) |
| `GET` | `/api/admin/dashboard/estadisticas` | Estadísticas generales | Sí (admin) |
| `GET` | `/api/admin/dashboard/ingresos` | Ingresos del dashboard | Sí (admin) |
| `GET` | `/api/admin/dashboard/tendencia-pedidos` | Tendencia de pedidos | Sí (admin) |
| `GET` | `/api/admin/dashboard/mesas-ocupadas` | Mesas ocupadas | Sí (admin) |
| `GET` | `/api/admin/dashboard/resumen` | Resumen del dashboard | Sí (admin) |
| `GET` | `/api/admin/dashboard/platillos-top` | Platillos más vendidos | Sí (admin) |
| `GET` | `/api/admin/dashboard/alertas-pedidos` | Alertas de pedidos | Sí (admin) |
| `GET` | `/api/reservaciones` | Listar reservaciones | Sí |
| `GET` | `/api/mesas` | Listar mesas para reservaciones | Sí |
| `POST` | `/api/reservaciones` | Crear reservación | Sí |
| `PUT` | `/api/reservaciones/:id` | Actualizar reservación | Sí |
| `PATCH` | `/api/reservaciones/:id/estado` | Actualizar estado de reservación | Sí |

---

# 🔑 Ejemplo de autenticación

Tras un login exitoso, la API devuelve un JWT.

El token debe enviarse en el header:

```http
Authorization: Bearer <token>
```

Ejemplo de login:

```json
{
  "email": "Admin@gmail.com",
  "password": "123456"
}
```

El token obtenido puede utilizarse posteriormente para acceder a las rutas protegidas.

---

# 🔗 Integración con el Frontend

El frontend de LogicLab está desarrollado con React + Vite y consume esta API REST.

Durante el desarrollo local, la comunicación puede utilizar:

```text
Frontend
http://192.168.80.25:5173/

        ↓

Backend
http://192.168.80.25:3001/

        ↓

API
http://192.168.80.25:3001/api

        ↓

MySQL
Base de datos LogicLab
```

---

# 📱 Integración con Flutter

LogicLab también cuenta con una aplicación móvil desarrollada con Flutter.

La aplicación móvil utiliza `WebView` para cargar el frontend web.

El flujo de comunicación es:

```text
Aplicación Flutter
        ↓
WebView
        ↓
Frontend React + Vite
        ↓
API Node.js + Express
        ↓
MySQL
```

Durante el desarrollo local, el frontend utilizado por la aplicación móvil es:

```text
http://192.168.80.25:5173/
```

El backend utilizado por el frontend es:

```text
http://192.168.80.25:3001/
```

---

# 🧪 Verificación de la API

Cuando el backend se encuentra ejecutándose correctamente, se puede comprobar el estado mediante:

```bash
curl http://localhost:3001/
```

También se puede consultar Swagger:

```text
http://localhost:3001/api-docs
```

Y la especificación OpenAPI:

```text
http://localhost:3001/api-docs.json
```

---

# 🔍 Inicio correcto del servidor

Al iniciar correctamente el backend y realizar la conexión con MySQL, se puede observar información similar a:

```text
✓ Conexión a MySQL exitosa
✓ DDL aplicado correctamente
✓ Seed ya ejecutado previamente, no se insertan datos de nuevo
SERVIDOR EJECUTANDOSE CORRECTAMENTE
Puerto: 3001
URL: http://localhost:3001
```

---

# 📁 Archivos importantes

### `server.js`

Punto de entrada principal del backend. Inicia el servidor Express y registra las rutas de la API.

### `db/DDL.sql`

Contiene la estructura utilizada para crear las tablas y relaciones de la base de datos.

### `controllers/`

Contiene los controladores encargados de procesar las solicitudes HTTP.

### `routes/`

Contiene las rutas y endpoints de la API.

### `services/`

Contiene la lógica de negocio y acceso a los datos.

### `middleware/`

Contiene middleware para autenticación, validaciones y carga de archivos.

### `config/`

Contiene la configuración utilizada por el backend.

### `uploads/`

Contiene los archivos e imágenes cargados mediante el backend.

### `docker-compose.yml`

Contiene la configuración para ejecutar los servicios mediante Docker.

---

# 🛠️ Comandos útiles

Instalar dependencias:

```bash
npm install
```

Ejecutar en desarrollo:

```bash
npm run dev
```

Ejecutar en producción:

```bash
npm start
```

Iniciar Docker:

```bash
docker compose up -d
```

Detener Docker:

```bash
docker compose down
```

Consultar contenedores activos:

```bash
docker ps
```

---

# 🔒 Seguridad

El proyecto utiliza diferentes mecanismos para proteger la aplicación:

- Autenticación mediante JWT.
- Contraseñas protegidas mediante `bcryptjs`.
- Variables sensibles almacenadas en `.env`.
- Protección de rutas.
- Validación de información recibida.
- Control de acceso según el rol del usuario.
- Validación de conflictos en las reservaciones.
- Validación de entradas mediante `express-validator`.

**Nunca publiques credenciales reales, contraseñas o claves JWT en el repositorio.**

---

# 📌 Estado actual del proyecto

Actualmente el backend cuenta con:

- API REST funcional.
- Conexión con MySQL.
- Autenticación mediante JWT.
- Gestión de usuarios.
- Gestión de roles.
- Gestión de clientes.
- Gestión de empleados.
- Gestión de mesas.
- Gestión de pedidos.
- Gestión de platillos.
- Gestión del menú del día.
- Dashboard administrativo.
- Estadísticas e ingresos.
- Gestión de reservaciones.
- Validación de conflictos entre reservaciones.
- Estados de reservaciones.
- Integración con el frontend React.
- Integración con la aplicación móvil Flutter mediante WebView.
- Documentación Swagger.
- Soporte para Docker.
- Base de datos `LogicLab`.

---

# 📚 Repositorios relacionados

## Frontend

https://github.com/gonzalezcla110312-eng/LogicLab-frontend

## Backend

https://github.com/gonzalezcla110312-eng/LogicLab-backend

## Aplicación móvil Flutter

https://github.com/gonzalezcla110312-eng/LogicLab-Movil-Flutter

---

# 👨‍💻 Autor

**LogicLab**

Proyecto desarrollado como sistema integral de gestión para restaurante utilizando:

```text
React
Node.js
Express
MySQL
Flutter
```

---

# 📄 Licencia

Proyecto académico y de desarrollo interno.