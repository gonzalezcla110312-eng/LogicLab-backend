import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runInitialSeedOnce } from '../services/seed.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ddlPath = path.join(__dirname, '..', 'db', 'DDL.sql');

const ensureColumn = async (connection, tableName, columnName, definition) => {
  const [rows] = await connection.query(
    `SELECT COUNT(*) AS total
     FROM information_schema.columns
     WHERE table_schema = ? AND table_name = ? AND column_name = ?`,
    [process.env.DB_NAME, tableName, columnName]
  );

  if (Number(rows[0]?.total || 0) === 0) {
    await connection.query(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`);
  }
};

export const initializeSchemaIfNeeded = async (pool) => {
  const connection = await pool.getConnection();

  try {
    const ddlRaw = await fs.readFile(ddlPath, 'utf8');
    const statements = ddlRaw
      .split(';')
      .map((statement) => statement.trim())
      .filter((statement) => statement.length > 0);

    for (const statement of statements) {
      await connection.query(statement);
    }

    await ensureColumn(connection, 'usuarios', 'tipo_documento_id', 'INT NULL');
    await ensureColumn(connection, 'platillos', 'categoria_id', 'INT NULL');
    await ensureColumn(connection, 'tipo_documento', 'descripcion_documento', 'VARCHAR(80) NULL');
    await ensureColumn(connection, 'tipo_documento', 'estado_documento', 'VARCHAR(20) NULL');

    // Migracion tabla PQRSF
    await ensureColumn(connection, 'TipoPQRSF', 'activo', 'TINYINT(1) NOT NULL DEFAULT 1');
    await ensureColumn(connection, 'TipoPQRSF', 'created_at', 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
    await ensureColumn(connection, 'RegistroPQRSF', 'apellido_cliente', "VARCHAR(120) NOT NULL DEFAULT ''");
    await ensureColumn(connection, 'RegistroPQRSF', 'asunto', "VARCHAR(255) NOT NULL DEFAULT 'Sin asunto'");
    await ensureColumn(connection, 'RegistroPQRSF', 'respuesta', 'TEXT');
    await ensureColumn(connection, 'RegistroPQRSF', 'atendido_por', 'INT NULL');

    console.log('✓ DDL aplicado correctamente');
  } finally {
    connection.release();
  }

  await runInitialSeedOnce();
};
