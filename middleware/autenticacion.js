import jwt from 'jsonwebtoken';

export const autenticacion = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ exito: false, error: 'Token no proporcionado' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'clave_secreta');
    req.usuario = decoded;
    next();
  } catch {
    return res.status(401).json({ exito: false, error: 'Token invalido o expirado' });
  }
};

export const verificarRoles = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario?.rol) {
      return res.status(401).json({ exito: false, error: 'Usuario no autenticado' });
    }

    const rolUsuario = req.usuario.rol.toLowerCase();
    const permitido = rolesPermitidos.some((r) => r.toLowerCase() === rolUsuario);

    if (!permitido) {
      return res.status(403).json({ exito: false, error: 'No tienes permisos para realizar esta accion' });
    }

    next();
  };
};

export const verificarAdmin = verificarRoles('administrador');
