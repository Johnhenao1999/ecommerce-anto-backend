const Subscriber = require("../models/Subscriber");

// 🔢 Generar código único aleatorio
const generarCodigoUnico = () => {
  const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let codigo = "";
  for (let i = 0; i < 5; i++) {
    codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return `ANTO10-${codigo}`;
};

// 🟢 Crear nuevo suscriptor
const crearSuscriptor = async (req, res) => {
  try {
    const { nombre, correo, telefono } = req.body;

    if (!nombre || !correo || !telefono) {
      return res.status(400).json({ error: "Faltan datos obligatorios." });
    }

    // 🔍 Normalizar correo y teléfono
    const correoNormalizado = correo.toLowerCase().trim();
    const telefonoNormalizado = telefono.replace(/\s+/g, "");

    // 🧩 Verificar si el correo ya está registrado
    const existeCorreo = await Subscriber.findOne({ correo: correoNormalizado });
    if (existeCorreo) {
      return res.status(200).json({
        mensaje: "Ya estás suscrito con este correo 😊",
        codigoDescuento: existeCorreo.codigoDescuento,
      });
    }

    // 🧩 Verificar si el teléfono ya está registrado
    const existeTelefono = await Subscriber.findOne({ telefono: telefonoNormalizado });
    if (existeTelefono) {
      return res.status(200).json({
        mensaje: "Ya estás suscrito con este número 📱",
        codigoDescuento: existeTelefono.codigoDescuento,
      });
    }

    // 🆕 Generar un código único
    let codigo;
    let existeCodigo = true;
    while (existeCodigo) {
      codigo = generarCodigoUnico();
      existeCodigo = await Subscriber.findOne({ codigoDescuento: codigo });
    }

    // 💾 Crear el nuevo suscriptor
    const nuevoSuscriptor = new Subscriber({
      nombre: nombre.trim(),
      correo: correoNormalizado,
      telefono: telefonoNormalizado,
      codigoDescuento: codigo,
    });

    await nuevoSuscriptor.save();

    res.status(201).json({
      mensaje: "🎉 Suscripción exitosa",
      codigoDescuento: codigo,
      suscriptor: nuevoSuscriptor,
    });
  } catch (error) {
    console.error("❌ Error al crear suscriptor:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// 🟡 Listar todos los suscriptores
const listarSuscriptores = async (req, res) => {
  try {
    const suscriptores = await Subscriber.find().sort({ createdAt: -1 });
    res.json({ suscriptores });
  } catch (error) {
    console.error("❌ Error al listar suscriptores:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// 🔵 Obtener un suscriptor por ID
const obtenerSuscriptorPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const suscriptor = await Subscriber.findById(id);

    if (!suscriptor) {
      return res.status(404).json({ error: "Suscriptor no encontrado" });
    }

    res.json({ suscriptor });
  } catch (error) {
    console.error("❌ Error al obtener suscriptor:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// 🔴 Eliminar un suscriptor
const eliminarSuscriptor = async (req, res) => {
  try {
    const { id } = req.params;
    const suscriptor = await Subscriber.findByIdAndDelete(id);

    if (!suscriptor) {
      return res.status(404).json({ error: "Suscriptor no encontrado" });
    }

    res.json({ mensaje: "🗑️ Suscriptor eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar suscriptor:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// 🧾 Validar código de descuento
const validarCodigoDescuento = async (req, res) => {
  try {
    const { codigo } = req.params;

    if (!codigo) {
      return res.status(400).json({ valido: false, mensaje: "Falta el código." });
    }

    const suscriptor = await Subscriber.findOne({ codigoDescuento: codigo.trim().toUpperCase() });

    if (!suscriptor) {
      return res.status(404).json({ valido: false, mensaje: "Código no encontrado." });
    }

    // ⏳ Validar expiración
    const ahora = new Date();
    const expiracion = new Date(suscriptor.fechaExpiracion);

    if (ahora > expiracion) {
      return res.status(200).json({
        valido: false,
        mensaje: "⏰ Este código ha caducado.",
      });
    }

    // 🚫 Validar si ya fue usado
    if (suscriptor.usado) {
      return res.status(200).json({
        valido: false,
        mensaje: "🚫 Este código ya fue utilizado.",
      });
    }

    // ✅ Código válido
    return res.status(200).json({
      valido: true,
      mensaje: `🎉 Código válido y vigente hasta el ${expiracion.toLocaleDateString("es-ES")}`,
      suscriptor: {
        nombre: suscriptor.nombre,
        correo: suscriptor.correo,
        telefono: suscriptor.telefono,
        fechaExpiracion: suscriptor.fechaExpiracion,
      },
    });
  } catch (error) {
    console.error("❌ Error al validar código:", error);
    res.status(500).json({ valido: false, mensaje: "Error interno del servidor." });
  }
};


module.exports = {
  crearSuscriptor,
  listarSuscriptores,
  obtenerSuscriptorPorId,
  eliminarSuscriptor,
  validarCodigoDescuento,
};
