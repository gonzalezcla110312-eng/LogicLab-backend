import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import * as usuariosService from '../services/users.service.js';
import * as rolesService from '../services/roles.service.js';

export const obtenerTodos = async (_req, res) => {
  try {
    const usuarios = await usuariosService.obtenerTodos();
    res.status(200).json({ exito: true, datos: usuarios });
  } catch (error) {
    res.status(500).json({ exito: false, error: error.message });
  }
};

export const obtenerPorId = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) {
      return res.status(400).json({ exito: false, error: 'ID invalido' });
    }

    const usuario = await usuariosService.obtenerPorId(id);
    if (!usuario) {
      return res.status(404).json({ exito: false, error: 'Usuario no encontrado' });
    }

    res.status(200).json({ exito: true, datos: usuario });
  } catch (error) {
    res.status(500).json({ exito: false, error: error.message });
  }
};

export const crear = async (req, res) => {
  try {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ exito: false, errores: errores.array() });
    }

    const { email, password, nombre, apellido, rol, tipo_documento_id } = req.body;

    const existente = await usuariosService.obtenerPorEmail(email);
    if (existente) {
      return res.status(400).json({ exito: false, error: 'El email ya esta registrado' });
    }

    const rolDb = await rolesService.obtenerPorNombre(rol);
    if (!rolDb) {
      return res.status(400).json({ exito: false, error: 'Rol no valido' });
    }

    const usuario = await usuariosService.crear({
      email,
      password,
      nombre,
      apellido,
      rol_id: rolDb.id,
      tipo_documento_id
    });

    res.status(201).json({ exito: true, mensaje: 'Usuario registrado', datos: usuario });
  } catch (error) {
    res.status(500).json({ exito: false, error: error.message });
  }
};

export const actualizar = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nombre, apellido, rol, tipo_documento_id, email, password } = req.body;

    if (!id) {
      return res.status(400).json({ exito: false, error: 'ID invalido' });
    }

    const existe = await usuariosService.obtenerPorId(id);
    if (!existe) {
      return res.status(404).json({ exito: false, error: 'Usuario no encontrado' });
    }

    if (email && email !== existe.email) {
      const emailEnUso = await usuariosService.obtenerPorEmail(email);
      if (emailEnUso) {
        return res.status(400).json({ exito: false, error: 'El email ya está en uso por otro usuario' });
      }
    }

    const rolDb = await rolesService.obtenerPorNombre(rol);
    if (!rolDb) {
      return res.status(400).json({ exito: false, error: 'Rol no valido' });
    }

    await usuariosService.actualizar(id, {
      nombre,
      apellido,
      rol_id: rolDb.id,
      tipo_documento_id,
      email,
      password
    });

    const actualizado = await usuariosService.obtenerPorId(id);
    res.status(200).json({ exito: true, mensaje: 'Usuario actualizado', datos: actualizado });
  } catch (error) {
    res.status(500).json({ exito: false, error: error.message });
  }
};

export const activar = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) {
      return res.status(400).json({ exito: false, error: 'ID invalido' });
    }

    const actualizado = await usuariosService.cambiarEstado(id, 1);
    if (!actualizado) {
      return res.status(404).json({ exito: false, error: 'Usuario no encontrado' });
    }

    res.status(200).json({ exito: true, mensaje: 'Usuario activado' });
  } catch (error) {
    res.status(500).json({ exito: false, error: error.message });
  }
};

export const inactivar = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) {
      return res.status(400).json({ exito: false, error: 'ID invalido' });
    }

    const actualizado = await usuariosService.cambiarEstado(id, 0);
    if (!actualizado) {
      return res.status(404).json({ exito: false, error: 'Usuario no encontrado' });
    }

    res.status(200).json({ exito: true, mensaje: 'Usuario inactivado' });
  } catch (error) {
    res.status(500).json({ exito: false, error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ exito: false, errores: errores.array() });
    }

    const { email, password } = req.body;
    const usuario = await usuariosService.obtenerPorEmail(email);

    if (!usuario) {
      return res.status(401).json({ exito: false, error: 'Email o contrasena incorrectos' });
    }

    const passwordValida = await usuariosService.verificarPassword(password, usuario.password);
    if (!passwordValida) {
      return res.status(401).json({ exito: false, error: 'Email o contrasena incorrectos' });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        rol: usuario.rol
      },
      process.env.JWT_SECRET || 'clave_secreta',
      { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );

    res.status(200).json({
      exito: true,
      mensaje: 'Login exitoso',
      token,
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        rol: usuario.rol
      }
    });
  } catch (error) {
    res.status(500).json({ exito: false, error: error.message });
  }
};

export const listarRoles = async (_req, res) => {
  try {
    const roles = await rolesService.obtenerTodos();
    res.status(200).json({ exito: true, datos: roles });
  } catch (error) {
    res.status(500).json({ exito: false, error: error.message });
  }
};
