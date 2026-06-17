# LogicLab API

Backend del sistema **LogicLab** para la gestión de restaurante. Este proyecto expone una API REST para administrar usuarios, mesas, platillos, menú del día y el dashboard administrativo.

## Descripción general

LogicLab API está desarrollada con **Node.js + Express** y utiliza **MySQL** como base de datos principal. El proyecto incluye soporte para Docker para levantar la base de datos de forma rápida y reproducible.

---

## Requisitos del sistema

| Requisito | Versión recomendada | Nota |
|---|---:|---|
| Node.js | 18 o superior | Compatible con el stack actual |
| npm | 9 o superior | Incluido con Node.js |
| Docker | Última versión estable | Para levantar MySQL |
| Docker Compose | v2 | Requerido para `docker-compose.yml` |
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
| nodemon | Recarga automática en desarrollo | `^3.0.1` |
| MySQL | Base de datos relacional | `8.0` |

---

## Flujo recomendado de instalación y ejecución

### 1) Clonar el repositorio

```bash
git clone <url-del-repo>
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

```txt
http://localhost:3001
```

Puedes probar el endpoint raíz:

```bash
curl http://localhost:3001/
```

---

## Variables de entorno

Ejemplo de configuración esperada en `.env`:

```env
DB_HOST=localhost
DB_USER=logiclab_user
DB_PASSWORD=mauricio_password_secure_2024
DB_NAME=LogicLab
DB_PORT=3306
PORT=3001
NODE_ENV=development
CORS_ORIGIN=*
JWT_SECRET=tu_clave_secreta_super_segura_restaurante_mauricio_2024_xyz
JWT_EXPIRE=24h
```

> Nunca compartas el archivo `.env` en repositorios públicos.

---

## Estructura del proyecto

```txt
.
├── config/               # Conexión y configuración de la base de datos
├── controllers/          # Controladores de la API
├── middleware/           # Autenticación, validaciones y carga de archivos
├── routes/               # Definición de rutas y endpoints
├── services/             # Lógica de acceso a datos
├── docs/                 # Documentación y ejemplos del proyecto
├── uploads/              # Archivos subidos por el backend
├── database.sql          # Script SQL inicial
├── docker-compose.yml    # Configuración de MySQL en Docker
├── server.js             # Punto de entrada del servidor
└── package.json          # Dependencias y scripts
```

---

## Endpoints principales

La API expone los siguientes recursos bajo el prefijo `/api`.

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

---

## Ejemplo de autenticación

Tras un login exitoso, la API devuelve un JWT. Se debe enviar en el header:

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

---

## Comandos útiles

```bash
npm install
npm run dev
npm start
docker compose up -d
docker compose down
```

---

## Notas importantes

- La validación de datos se hace con `express-validator`.
- Los archivos subidos para platillos se sirven desde la carpeta `uploads`.
- El puerto por defecto del backend es `3001`.
- En producción, usa un `JWT_SECRET` seguro y único.
