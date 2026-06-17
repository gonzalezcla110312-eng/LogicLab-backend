#!/usr/bin/env node

/**
 * ========================================
 * GUÍA RÁPIDA DE INICIO
 * ========================================
 * 
 * Lee este archivo para entender rápidamente
 * cómo poner a funcionar el proyecto
 */

console.log(`
╔════════════════════════════════════════════════════════════╗
║                  🍽️  API RESTAURANTE 🍽️                  ║
║                    GUÍA RÁPIDA DE INICIO                   ║
╚════════════════════════════════════════════════════════════╝

📋 PASOS PARA INICIAR:

1️⃣  INSTALAR DEPENDENCIAS
   Ejecuta: npm install
   Esto descargará todas las librerías necesarias

2️⃣  CONFIGURAR BASE DE DATOS
   - Abre MySQL (phpMyAdmin, MySQL Workbench, etc)
   - Abre el archivo: database.sql
   - Copia TODO el contenido
   - Pégalo en tu cliente MySQL
   - Ejecuta para crear la tabla

3️⃣  CONFIGURAR VARIABLES DE ENTORNO
   - El archivo .env ya existe
   - Verifica que tenga tu información de MySQL:
     * DB_HOST: localhost
     * DB_USER: root
     * DB_PASSWORD: (tu contraseña)
     * DB_NAME: restaurante_db

4️⃣  INICIAR EL SERVIDOR
   Opción A - Desarrollo (con nodemon, reinicia automáticamente):
   $ npm run dev
   
   Opción B - Producción (modo normal):
   $ npm start

5️⃣  PROBAR LA API
   - Abre tu navegador: http://localhost:3001
   - Deberías ver un JSON con "estado: En línea ✓"
   
   Prueba el login:
   - Email: andres@gmail.com
   - Contraseña: 123456

═════════════════════════════════════════════════════════════

🌐 ENDPOINTS PRINCIPALES:

📋 Obtener usuarios:           GET    http://localhost:3001/api/usuarios
👤 Obtener un usuario:          GET    http://localhost:3001/api/usuarios/1
➕ Crear usuario:              POST   http://localhost:3001/api/usuarios
✏️  Actualizar usuario:         PUT    http://localhost:3001/api/usuarios/1
❌ Eliminar usuario:            DELETE http://localhost:3001/api/usuarios/1
🔑 Login:                       POST   http://localhost:3001/api/usuarios/login

═════════════════════════════════════════════════════════════

📁 ARCHIVOS IMPORTANTES:

server.js                    → Archivo principal (INICIA TODO)
.env                         → Configuración (datos sensibles)
database.sql                 → Script para crear BD
README.md                    → Documentación completa

config/db.js                 → Conexión a MySQL
services/users.service.js    → Operaciones de base de datos
controllers/usuarios.controller.js → Lógica de negocio
routes/usuarios.routes.js    → Definición de endpoints
middleware/autenticacion.js  → Verificación de tokens

═════════════════════════════════════════════════════════════

❓ ERRORES COMUNES:

❌ "Cannot find module 'express'"
   → Solución: npm install

❌ "Connection refused 127.0.0.1:3306"
   → Solución: Asegúrate que MySQL está corriendo

❌ "Unknown database 'restaurante_db'"
   → Solución: Ejecuta el script database.sql

❌ "Port 3001 is already in use"
   → Solución: Cambia PORT en .env o cierra la app que usa ese puerto

═════════════════════════════════════════════════════════════

🛠️  HERRAMIENTAS RECOMENDADAS:

- Postman: Herramienta gráfica para probar APIs
  Descargar: https://www.postman.com/
  
- phpMyAdmin: Interfaz visual para MySQL
  Descargar: https://www.phpmyadmin.net/
  
- Visual Studio Code: Editor de código
  Descargar: https://code.visualstudio.com/

═════════════════════════════════════════════════════════════

📚 PRÓXIMOS PASOS:

1. Lee el README.md para entender toda la arquitectura
2. Prueba todos los endpoints con Postman
3. Agrega más tablas a la base de datos
4. Crea nuevas rutas y controladores
5. Implementa frontend que consuma esta API

═════════════════════════════════════════════════════════════

✨ Proyecto listo para desarrollar. ¡Buen viaje! ✨

`);
