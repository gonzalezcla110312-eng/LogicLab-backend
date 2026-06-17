/**
 * ========================================
 * CONFIGURACIÓN DE LA BASE DE DATOS MYSQL
 * ========================================
 * 
 * Este archivo configura la conexión a MySQL
 * usando un "pool de conexiones" que permite
 * múltiples conexiones simultáneas de forma eficiente
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { initializeSchemaIfNeeded } from './schema-init.js';

// Cargar variables de entorno antes de crear el pool
dotenv.config();

// Crear un pool de conexiones a MySQL
// Un pool es como tener varias conexiones listas para usar
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',       // Servidor MySQL
  user: process.env.DB_USER || 'root',            // Usuario de MySQL
  password: process.env.DB_PASSWORD || '',        // Contraseña
  database: process.env.DB_NAME || 'LogicLab', // Nombre de la BD
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,                      // Esperar si no hay conexiones disponibles
  connectionLimit: 10,                           // Máximo de conexiones simultáneas
  queueLimit: 0,                                 // Sin límite de solicitudes en espera
  charset: 'utf8mb4',                            // Codificación de caracteres
});

const initializeDatabase = async () => {
  try {
    const conexion = await pool.getConnection();
    console.log('✓ Conexión a MySQL exitosa');
    conexion.release();

    await initializeSchemaIfNeeded(pool);
  } catch (error) {
    console.error('✗ Error al conectar a MySQL:', error.message);
    throw error;
  }
};

export const dbReady = initializeDatabase();

export default pool;
