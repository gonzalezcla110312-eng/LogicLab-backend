/**
 * ========================================
 * CHECKLIST DE INSTALACIÓN
 * ========================================
 * 
 * Sigue estos pasos exactamente en orden
 * para que tu API esté lista funcionando
 */

console.log(`
╔════════════════════════════════════════════════════════════╗
║          ✅ CHECKLIST DE INSTALACIÓN - PASO A PASO        ║
╚════════════════════════════════════════════════════════════╝

FASE 1: INSTALACIÓN DEL PROYECTO
═══════════════════════════════════════════════════════════

□ Paso 1: Instalar Node.js
  ✓ Descargar de: https://nodejs.org/
  ✓ Instalar versión LTS (recomendado)
  ✓ Verificar: npm --version en terminal

□ Paso 2: Instalar MySQL
  ✓ Descargar de: https://www.mysql.com/
  ✓ Instalar MySQL Community Server
  ✓ Recordar usuario (root) y contraseña

□ Paso 3: Descargar dependencias
  ✓ Abrir terminal en el proyecto
  ✓ Ejecutar: npm install
  ✓ Esperar a que descargue todo

═══════════════════════════════════════════════════════════

FASE 2: CONFIGURACIÓN DE BASE DE DATOS
═══════════════════════════════════════════════════════════

□ Paso 4: Instalar phpMyAdmin (herramienta visual)
  ✓ Si usas XAMPP, ya viene incluido
  ✓ Si no, puedes instalar por separado
  ✓ URL: http://localhost/phpmyadmin

□ Paso 5: Crear la base de datos
  ✓ Abrir phpMyAdmin en navegador
  ✓ Ir a pestaña "SQL"
  ✓ Copiar TODO el contenido de: database.sql
  ✓ Pegar en phpMyAdmin
  ✓ Hacer click en "Enviar"
  ✓ Debería decir "0 errores"

□ Paso 6: Verificar tabla creada
  ✓ En phpMyAdmin, ver columna izquierda
  ✓ Buscar "restaurante_db"
  ✓ Ver tabla "usuarios" dentro
  ✓ Verificar que tiene datos de prueba

═══════════════════════════════════════════════════════════

FASE 3: CONFIGURACIÓN DEL PROYECTO
═══════════════════════════════════════════════════════════

□ Paso 7: Revisar archivo .env
  ✓ Abrir: .env
  ✓ Verificar que coincida con tu MySQL:
    • DB_HOST=localhost ✓
    • DB_USER=root ✓
    • DB_PASSWORD=(tu contraseña) ✓
    • DB_NAME=restaurante_db ✓

□ Paso 8: Instalar herramientas de prueba (opcional pero recomendado)
  ✓ Descargar Postman: https://www.postman.com/
  ✓ Crear cuenta (free)
  ✓ Instalar en tu computadora

═══════════════════════════════════════════════════════════

FASE 4: INICIAR Y PROBAR
═══════════════════════════════════════════════════════════

□ Paso 9: Iniciar servidor
  ✓ Abrir terminal en el proyecto
  ✓ Ejecutar: npm run dev
  ✓ Debería decir: "SERVIDOR EJECUTÁNDOSE CORRECTAMENTE"
  ✓ Dirección: http://localhost:3001

□ Paso 10: Probar conexión
  ✓ Abrir navegador
  ✓ Ir a: http://localhost:3001
  ✓ Debería mostrar JSON con "estado: En línea ✓"

□ Paso 11: Probar endpoints con Postman
  ✓ Abrir Postman
  ✓ Crear nueva solicitud (New → Request)
  
  Prueba 1 - Obtener usuarios:
  ✓ Método: GET
  ✓ URL: http://localhost:3001/api/usuarios
  ✓ Click "Send"
  ✓ Debería ver lista de usuarios

  Prueba 2 - Login:
  ✓ Método: POST
  ✓ URL: http://localhost:3001/api/usuarios/login
  ✓ Body → raw → JSON
  ✓ Pegar:
    {
      "email": "andres@gmail.com",
      "password": "123456"
    }
  ✓ Click "Send"
  ✓ Debería recibir un token

  Prueba 3 - Crear usuario:
  ✓ Método: POST
  ✓ URL: http://localhost:3001/api/usuarios
  ✓ Body → raw → JSON
  ✓ Pegar:
    {
      "email": "prueba@gmail.com",
      "password": "123456",
      "nombre": "Prueba",
      "apellido": "Usuario",
      "rol": "Mesero",
      "Tipo_documentoId": 1,
      "Roles_usuariosId": 1
    }
  ✓ Click "Send"
  ✓ Debería crear exitosamente

═══════════════════════════════════════════════════════════

FASE 5: ARCHIVOS QUE DEBES CONOCER
═══════════════════════════════════════════════════════════

📄 Archivos Principales:

server.js
  ↳ Archivo principal que inicia todo
  ↳ Define middleware global
  ↳ Registra todas las rutas
  ↳ PUNTO DE ENTRADA

.env
  ↳ Variables de configuración (PRIVADO)
  ↳ NO SUBIR A GITHUB
  ↳ Credenciales de MySQL

database.sql
  ↳ Script para crear tablas
  ↳ Datos de prueba
  ↳ Ejecutar una sola vez

package.json
  ↳ Dependencias del proyecto
  ↳ Scripts (start, dev)
  ↳ Información del proyecto

═══════════════════════════════════════════════════════════

📁 Carpetas que Debes Conocer:

config/
  ↳ db.js: Conexión a MySQL
  ↳ Aquí van todas las configuraciones

services/ (MODELS)
  ↳ users.service.js: Acceso a BD
  ↳ Aquí van las queries SQL
  ↳ Una archivo por tabla

controllers/
  ↳ usuarios.controller.js: Lógica del negocio
  ↳ Procesa datos y valida
  ↳ Prepara respuestas

routes/
  ↳ usuarios.routes.js: Definición de rutas
  ↳ Mapea URLs a controladores
  ↳ Una archivo por tabla

middleware/
  ↳ autenticacion.js: Verifica tokens
  ↳ Funciones que se ejecutan antes

═══════════════════════════════════════════════════════════

📚 DOCUMENTACIÓN INCLUIDA:

README.md
  → Guía completa en español
  → Conceptos, instalación, ejemplos
  → ¡LEE ESTO PRIMERO!

INICIO_RAPIDO.js
  → Pasos rápidos para poner a funcionar

EJEMPLOS_USO.js
  → Ejemplos prácticos de código
  → Cómo usar cada endpoint

EXTENDER_PROYECTO.md
  → Cómo agregar nuevas características
  → Paso a paso: agregar una tabla

DIAGRAMA_ARQUITECTURA.js
  → Visual de cómo funciona todo
  → Flujo de solicitudes

═══════════════════════════════════════════════════════════

🆘 SOLUCIÓN DE PROBLEMAS
═══════════════════════════════════════════════════════════

❌ "npm: command not found"
   → Node.js no está instalado
   → Descargar e instalar desde nodejs.org

❌ "Cannot find module"
   → Falta instalar dependencias
   → Ejecutar: npm install

❌ "Connection refused 127.0.0.1:3306"
   → MySQL no está corriendo
   → Abrir XAMPP o iniciar MySQL

❌ "Unknown database 'restaurante_db'"
   → Base de datos no se creó
   → Ejecutar script database.sql

❌ "Port 3001 is already in use"
   → Otro programa usa puerto 3001
   → Cambiar PORT en .env o matar proceso

❌ "Error: connect ECONNREFUSED"
   → Problemas de conexión a MySQL
   → Verificar .env tiene datos correctos
   → Verificar MySQL está corriendo

═══════════════════════════════════════════════════════════

🎓 PRÓXIMOS PASOS DESPUÉS DE LA INSTALACIÓN
═══════════════════════════════════════════════════════════

1. Lee el README.md completo
   → Entender conceptos (API REST, HTTP, JSON)
   → Ver estructura del proyecto

2. Prueba todos los endpoints en Postman
   → GET, POST, PUT, DELETE
   → Practica con diferentes datos

3. Modifica el código
   → Agrega comentarios propios
   → Experimenta con cambios

4. Agrega una nueva característica
   → Sigue la guía: EXTENDER_PROYECTO.md
   → Crea tabla de "Mesas" o "Pedidos"

5. Crea un frontend
   → Página HTML que use la API
   → Usa JavaScript Fetch API

═══════════════════════════════════════════════════════════

✨ COMANDOS IMPORTANTES
═══════════════════════════════════════════════════════════

# Instalar dependencias
$ npm install

# Iniciar en desarrollo (con reinicio automático)
$ npm run dev

# Iniciar en producción
$ npm start

# Ver versión de Node
$ node --version

# Ver versión de npm
$ npm --version

# Ver versión de MySQL
$ mysql --version

═══════════════════════════════════════════════════════════

📞 SOPORTE
═══════════════════════════════════════════════════════════

Recursos:
• Documentación Express: https://expressjs.com/
• Documentación MySQL: https://dev.mysql.com/doc/
• Documentación Node: https://nodejs.org/docs/
• Postman: https://www.postman.com/

Tutoriales:
• Tutorial Express + MySQL
• Tutorial REST API
• Tutorial Node.js para principiantes

═══════════════════════════════════════════════════════════

✅ MARCA CADA PASO AL COMPLETARLO
═══════════════════════════════════════════════════════════

Cuando termines todos los pasos, tu API estará:

✅ Instalada
✅ Configurada
✅ Funcionando
✅ Documentada
✅ Lista para extender

¡FELICIDADES! 🎉

Ya tienes una API REST profesional construida con Express y MySQL.

Ahora el siguiente nivel es:
• Agregar más tablas (Mesas, Pedidos, Productos)
• Implementar autenticación completa
• Crear un frontend
• Desplegar a producción

═══════════════════════════════════════════════════════════
`);
