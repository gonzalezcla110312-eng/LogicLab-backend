import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { dbReady } from './config/db.js';

import rutasUsuarios from './routes/usuarios.routes.js';
import rutasMesas from './routes/mesas.routes.js';
import rutasPlatillos from './routes/platillos.routes.js';
import rutasMenuDia from './routes/menu-dia.routes.js';
import rutasDashboardAdmin from './routes/dashboard-admin.routes.js';

dotenv.config();

const app = express();

app.disable('x-powered-by');

const allowedOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({ origin: allowedOrigin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

app.get('/', (_req, res) => {
  res.json({
    mensaje: 'Bienvenido a la API REST del Restaurante',
    version: '3.0.0',
    estado: 'En linea'
  });
});

app.use('/api/usuarios', rutasUsuarios);
app.use('/api/mesas', rutasMesas);
app.use('/api/platillos', rutasPlatillos);
app.use('/api/menu-dia', rutasMenuDia);
app.use('/api/admin/dashboard', rutasDashboardAdmin);


app.use((req, res) => {
  res.status(404).json({
    exito: false,
    error: 'Ruta no encontrada',
    ruta: req.originalUrl
  });
});

const PUERTO = Number(process.env.PORT) || 3001;

const startServer = async () => {
  try {
    await dbReady;

    const iniciarEnPuerto = (puerto) => {
      const server = app.listen(puerto, () => {
        console.log(`
  =======================================
  SERVIDOR EJECUTANDOSE CORRECTAMENTE
  Puerto: ${puerto}
  URL: http://localhost:${puerto}
  =======================================
        `);
      });

      server.on('error', (error) => {
        if (error.code === 'EADDRINUSE' && process.env.NODE_ENV !== 'production') {
          console.warn(`Puerto ${puerto} ocupado, reintentando en ${puerto + 1}...`);
          iniciarEnPuerto(puerto + 1);
          return;
        }

        throw error;
      });
    };

    iniciarEnPuerto(PUERTO);
  } catch (error) {
    console.error('No se pudo iniciar el servidor por error de base de datos:', error.message);
    process.exit(1);
  }
};

startServer();

export default app;
