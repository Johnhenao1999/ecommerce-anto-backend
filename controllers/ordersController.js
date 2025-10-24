const Order = require('../models/Order');

// 🟢 Crear nueva orden
const crearOrden = async (req, res) => {
  try {
    const { cliente, items, total } = req.body;

    if (!cliente || !items || !total) {
      return res.status(400).json({ error: "Faltan datos obligatorios para crear la orden" });
    }

    const nuevaOrden = new Order({
      cliente,
      items,
      total,
      estado: "Recibido",
      fecha: new Date(),
    });

    await nuevaOrden.save();
    res.status(201).json({ mensaje: "✅ Orden creada exitosamente", orden: nuevaOrden });
  } catch (error) {
    console.error("❌ Error al crear la orden:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// 🟡 Listar todas las órdenes
const listarOrdenes = async (req, res) => {
  try {
    const ordenes = await Order.find().sort({ createdAt: -1 });
    res.json({ ordenes });
  } catch (error) {
    console.error("❌ Error al listar órdenes:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// 🟣 Obtener una orden por ID
const obtenerOrdenPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const orden = await Order.findById(id);

    if (!orden) {
      return res.status(404).json({ error: "Orden no encontrada" });
    }

    res.json({ orden });
  } catch (error) {
    console.error("❌ Error al obtener la orden:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// 🔵 Actualizar estado de la orden
const actualizarEstadoOrden = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const estadosPermitidos = ["Recibido", "En preparación", "En camino", "Listo", "Cancelado"];
    if (!estadosPermitidos.includes(estado)) {
      return res.status(400).json({ error: "Estado no válido" });
    }

    const orden = await Order.findByIdAndUpdate(id, { estado }, { new: true });
    if (!orden) {
      return res.status(404).json({ error: "Orden no encontrada" });
    }

    res.json({ mensaje: "✅ Estado actualizado correctamente", orden });
  } catch (error) {
    console.error("❌ Error al actualizar estado de la orden:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// 🔴 Eliminar una orden
const eliminarOrden = async (req, res) => {
  try {
    const { id } = req.params;
    const orden = await Order.findByIdAndDelete(id);

    if (!orden) {
      return res.status(404).json({ error: "Orden no encontrada" });
    }

    res.json({ mensaje: "🗑️ Orden eliminada correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar la orden:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = {
  crearOrden,
  listarOrdenes,
  obtenerOrdenPorId,
  actualizarEstadoOrden,
  eliminarOrden
};
