const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta_super_segura'; // Usa variables de entorno en producción
const JWT_EXPIRES_IN = '1d'; // Duración del token

// 🟢 Login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const esValida = await bcrypt.compare(password, usuario.password);
    if (!esValida) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { id: usuario._id, email: usuario.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({ mensaje: 'Login exitoso', token, usuario: { id: usuario._id, email: usuario.email, nombre: usuario.nombre } });
  } catch (error) {
    console.error("❌ Error en login:", error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// 🔵 Registro
const registrar = async (req, res) => {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    // Verifica si el usuario ya existe
    const existe = await Usuario.findOne({ email });
    if (existe) {
      return res.status(400).json({ error: 'Ya existe un usuario con ese correo' });
    }

    const nuevoUsuario = new Usuario({ nombre, email, password });
    await nuevoUsuario.save();

    res.status(201).json({ mensaje: 'Usuario registrado exitosamente', usuario: { id: nuevoUsuario._id, email: nuevoUsuario.email, nombre: nuevoUsuario.nombre } });
  } catch (error) {
    console.error("❌ Error al registrar usuario:", error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


// 🔴 Logout (sólo simbólico en JWT)
const logout = async (req, res) => {
  // El logout en JWT es manejado del lado del cliente: se borra el token
  res.json({ mensaje: 'Logout exitoso. Borra el token en el cliente.' });
};

module.exports = { login, registrar, logout };
