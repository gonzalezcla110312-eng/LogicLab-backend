/**
 * ╔════════════════════════════════════════════════════════════╗
 * ║           🐳 GUÍA DE DOCKER Y DOCKER-COMPOSE 🐳            ║
 * ╚════════════════════════════════════════════════════════════╝
 */

console.log(`

═══════════════════════════════════════════════════════════════════
                   ¿QUÉ ES DOCKER?
═══════════════════════════════════════════════════════════════════

Docker es una herramienta que permite empaquetar aplicaciones
en "contenedores" que funcionan igual en cualquier máquina.

Ventajas:
✅ Funciona en Windows, Mac, Linux igual
✅ Instala dependencias automáticamente
✅ No "ensucia" tu computadora
✅ Fácil de compartir con el equipo
✅ Listo para producción

═══════════════════════════════════════════════════════════════════
                   INSTALACIÓN DE DOCKER
═══════════════════════════════════════════════════════════════════

1. Descargar Docker Desktop
   Desde: https://www.docker.com/products/docker-desktop

2. Instalar (seguir los pasos)

3. Verificar instalación
   Ejecutar en terminal:
   $ docker --version
   $ docker run hello-world

═══════════════════════════════════════════════════════════════════
                   ARCHIVOS DOCKER INCLUIDOS
═══════════════════════════════════════════════════════════════════

📄 docker-compose.yml
   └─ Define solo MySQL (con valores quemados)
   └─ Configura puerto 3306
   └─ Configura volúmenes y datos persistentes
   └─ Crea tablas automáticamente desde database.sql

📄 Dockerfile
   └─ Define cómo construir imagen de Node.js
   └─ (Disponible para agregar la app después)

📄 .dockerignore
   └─ Archivos a excluir del contenedor
   └─ Reduce tamaño y tiempo de construcción

📄 .env
   └─ Credenciales que coinciden con docker-compose.yml
   └─ Sincronizados para que funcione seamlessly

═══════════════════════════════════════════════════════════════════
                   CONFIGURACIÓN ACTUAL
═══════════════════════════════════════════════════════════════════

docker-compose.yml (VALORES QUEMADOS):

MYSQL_ROOT_PASSWORD:     mauricio_password_secure_2024
MYSQL_DATABASE:          restaurante_db
MYSQL_USER:              mauricio_user
MYSQL_PASSWORD:          mauricio_password_secure_2024
Puerto:                  3306

.env (SINCRONIZADO):

DB_HOST=localhost         ← Para conectarse desde tu máquina
DB_USER=mauricio_user
DB_PASSWORD=mauricio_password_secure_2024
DB_NAME=restaurante_db
DB_PORT=3306

═══════════════════════════════════════════════════════════════════
                   CÓMO USAR DOCKER-COMPOSE
═══════════════════════════════════════════════════════════════════

PASO 1: Instalar dependencias (si no lo hiciste)
$ npm install

PASO 2: Levantar MySQL
$ docker-compose up

Esto hará:
✅ Descarga imagen de MySQL
✅ Crea contenedor mysql_restaurante
✅ Crea base de datos: restaurante_db
✅ Crea usuario: mauricio_user
✅ Ejecuta database.sql (crea tablas)
✅ Abre puerto 3306 en tu máquina

PASO 3: En otra terminal, inicia tu app
$ npm run dev

Ahora tu app Node.js está conectada a MySQL en Docker

PASO 4: Detener
Presionar: Ctrl + C en ambas terminales

═══════════════════════════════════════════════════════════════════
                   COMANDOS ÚTILES DE DOCKER
═══════════════════════════════════════════════════════════════════

# Levantar MySQL en primer plano (ves los logs)
$ docker-compose up

# Levantar MySQL en background (silencioso)
$ docker-compose up -d

# Ver logs
$ docker-compose logs

# Seguir los logs en tiempo real
$ docker-compose logs -f

# Detener MySQL (conserva datos)
$ docker-compose down

# Detener y borrar datos (CUIDADO - elimina BD)
$ docker-compose down -v

# Ejecutar comando en MySQL
$ docker-compose exec mysql mysql -u mauricio_user -p

# Ver contenedores ejecutándose
$ docker ps

═══════════════════════════════════════════════════════════════════
                   ACCEDER A MYSQL DESDE DOCKER
═══════════════════════════════════════════════════════════════════

Opción 1: Desde la terminal
$ docker-compose exec mysql mysql -u mauricio_user -p
Contraseña: mauricio_password_secure_2024

Opción 2: Desde phpMyAdmin (si lo tienes instalado)
URL: http://localhost/phpmyadmin
Servidor: localhost
Puerto: 3306
Usuario: mauricio_user
Contraseña: mauricio_password_secure_2024

Opción 3: Desde un cliente MySQL externo
Host: localhost
Puerto: 3306
Usuario: mauricio_user
Contraseña: mauricio_password_secure_2024

═══════════════════════════════════════════════════════════════════
                   DIAGRAMA DE FLUJO
═══════════════════════════════════════════════════════════════════

┌──────────────────────────────────────┐
│       Tu Máquina (Windows/Mac/Linux)  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │     docker-compose up          │  │
│  └────────────────┬───────────────┘  │
│                   │                  │
│         ┌─────────▼─────────┐       │
│         │  DOCKER           │       │
│         │  ┌──────────────┐ │       │
│         │  │   MySQL      │ │       │
│         │  │ Contenedor   │ │       │
│         │  │ :3306        │ │       │
│         │  │              │ │       │
│         │  │ • restaur... │ │       │
│         │  │ • mauricio.. │ │       │
│         │  │ • usuarios..│ │       │
│         │  └──────────────┘ │       │
│         └────────┬──────────┘       │
│                  │                  │
│  ┌───────────────▼──────────────┐  │
│  │   Tu App Node.js Local       │  │
│  │   (npm run dev)              │  │
│  │   Port: 3001                 │  │
│  │   Conecta a: localhost:3306  │  │
│  └──────────────────────────────┘  │
│                                      │
└──────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════
                   FLUJO CON DOCKER-COMPOSE
═══════════════════════════════════════════════════════════════════

1. Ejecutas: docker-compose up

2. Docker lee el archivo docker-compose.yml

3. Descarga imagen MySQL (si no la tiene)

4. Crea contenedor mysql_restaurante:
   ├─ Lee valores quemados del yml
   ├─ Crea usuario: mauricio_user
   ├─ Crea BD: restaurante_db
   ├─ Ejecuta database.sql (crea tablas)
   ├─ Abre puerto 3306 en localhost
   └─ Guarda datos en mysql_data (volumen)

5. MySQL está listo para recibir conexiones

6. Tu app local se conecta a localhost:3306

7. Todo funciona perfecto

═══════════════════════════════════════════════════════════════════
                   DESARROLLO CON DOCKER
═══════════════════════════════════════════════════════════════════

Ventajas de esta configuración:

✅ MySQL en Docker = instalación automática
✅ App en local = fácil de debuggear
✅ Sin complicar con contenedores de app (por ahora)
✅ Volumen de datos = datos persistentes
✅ Mismo setup para todo el equipo

Workflow:

Terminal 1:
$ docker-compose up                ← Inicia MySQL

Terminal 2:
$ npm run dev                       ← Inicia tu app

Editas código → Se reinicia automáticamente
MySQL también sigue corriendo

Ctrl+C en ambas para detener

═══════════════════════════════════════════════════════════════════
                   SINCRONIZACIÓN .env
═══════════════════════════════════════════════════════════════════

docker-compose.yml (VALORES QUEMADOS):
├─ MYSQL_DATABASE: restaurante_db
├─ MYSQL_USER: mauricio_user
└─ MYSQL_PASSWORD: mauricio_password_secure_2024

.env (DEBE COINCIDIR):
├─ DB_NAME: restaurante_db
├─ DB_USER: mauricio_user
└─ DB_PASSWORD: mauricio_password_secure_2024

IMPORTANTE: Si cambias un valor en docker-compose.yml,
también debes cambiarlo en .env para que funcione

═══════════════════════════════════════════════════════════════════
                   SOLUCIÓN DE PROBLEMAS
═══════════════════════════════════════════════════════════════════

❌ "docker-compose: command not found"
   → Docker no está instalado
   → Instalar desde: https://www.docker.com/

❌ "Error connecting to MySQL"
   → MySQL no está listo aún
   → Esperar 10-15 segundos
   → Ver logs: docker-compose logs

❌ "Port 3306 is already in use"
   → Docker no se detuvo correctamente
   → Ejecutar: docker-compose down
   → Luego: docker-compose up

❌ "Cannot connect from app"
   → Verificar que DB_HOST=localhost en .env
   → Verificar credenciales coinciden
   → Ver logs de MySQL: docker-compose logs

❌ "mysqladmin: command not found"
   → MySQL no tiene las herramientas
   → Intentar: docker-compose exec mysql mysql -u root -p

═══════════════════════════════════════════════════════════════════
                   GUÍA PASO A PASO
═══════════════════════════════════════════════════════════════════

PASO 1: Instalar Docker Desktop
□ Descargar desde docker.com
□ Instalar siguiendo pasos
□ Abrir Docker Desktop

PASO 2: Verificar instalación
□ Abrir terminal/PowerShell
□ Ejecutar: docker --version
□ Debe mostrar la versión

PASO 3: Navegar al proyecto
□ cd c:\\Users\\aospinaa\\Desktop\\proyectoMauricio

PASO 4: Levantar MySQL
□ Ejecutar: docker-compose up
□ Esperar a ver "mysqld is ready for connections"

PASO 5: Verificar conexión
□ Abrir otra terminal
□ Ejecutar: docker-compose exec mysql mysql -u mauricio_user -p
□ Contraseña: mauricio_password_secure_2024
□ Ejecutar: SELECT * FROM usuarios;

PASO 6: Iniciar tu app
□ Ejecutar: npm run dev
□ Debe conectarse automáticamente a MySQL

PASO 7: Probar endpoints
□ Abrir: http://localhost:3001/api/usuarios
□ Debe mostrar JSON con usuarios

PASO 8: Detener
□ Presionar: Ctrl + C en ambas terminales
□ Ejecutar: docker-compose down

═══════════════════════════════════════════════════════════════════
                   AGREGAR LA APP A DOCKER (FUTURO)
═══════════════════════════════════════════════════════════════════

Cuando quieras que la app también esté en Docker:

1. El Dockerfile ya existe
2. Descomenta la sección "app" en docker-compose.yml
3. Cambia DB_HOST de "localhost" a "mysql"
4. Ejecuta: docker-compose up
5. Ambos en contenedores, comunicándose internamente

═══════════════════════════════════════════════════════════════════
                   PRODUCCIÓN
═══════════════════════════════════════════════════════════════════

Para producción:

1. Cambiar valores quemados por variables de entorno
2. Usar contraseñas más seguras (>20 caracteres)
3. Usar docker-compose.prod.yml
4. Agregar backups de datos
5. Usar networks privadas
6. Usar volúmenes persistentes en la nube
7. Monitoreo y logs centralizados

═══════════════════════════════════════════════════════════════════
                   LIMPIAR TODO
═══════════════════════════════════════════════════════════════════

Detener todo:
$ docker-compose down

Detener y borrar datos (¡PELIGRO!):
$ docker-compose down -v

Borrar imágenes:
$ docker rmi $(docker images -q)

Limpiar todo (contenedores + imágenes + volúmenes):
$ docker system prune -a

═══════════════════════════════════════════════════════════════════
                   RECURSOS ÚTILES
═══════════════════════════════════════════════════════════════════

Documentación:
• Docker: https://docs.docker.com/
• Docker Compose: https://docs.docker.com/compose/
• MySQL: https://hub.docker.com/_/mysql

Tutoriales:
• Docker para principiantes
• Docker Compose en 10 minutos
• MySQL en Docker

═══════════════════════════════════════════════════════════════════

✨ Ahora tienes MySQL en Docker, sincronizado con .env 🚀

`);
