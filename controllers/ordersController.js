const Order = require('../models/Order');
const Subscriber = require('../models/Subscriber');

const crearOrden = async (req, res) => {
  try {
    const { cliente, items, total, codigoDescuento } = req.body;
    console.log("🟢 [crearOrden] Payload recibido:", {
      cliente,
      itemsCount: items?.length,
      total,
      codigoDescuento,
    });

    if (!cliente || !items || !total) {
      console.warn("⚠️ [crearOrden] Datos incompletos para la orden");
      return res.status(400).json({ error: "Faltan datos obligatorios para crear la orden" });
    }

    let descuentoAplicado = 0;
    let nuevoTotal = total;
    let subscriber = null;

    // 🔍 Validar cupón si viene en el payload
    if (codigoDescuento) {
      console.log("🔍 [crearOrden] Buscando cupón:", codigoDescuento);

      // Normalizar (por si hay minúsculas o espacios)
      const codigoNormalizado = codigoDescuento.trim().toUpperCase();
      subscriber = await Subscriber.findOne({ codigoDescuento: codigoNormalizado });
      console.log("🧩 [crearOrden] Resultado de búsqueda:", subscriber);

      if (!subscriber) {
        console.warn("⚠️ [crearOrden] No se encontró el cupón en la BD");
        return res.status(400).json({ error: "Código de descuento no válido" });
      }

      if (subscriber.usado) {
        console.warn("⚠️ [crearOrden] Cupón ya fue utilizado:", subscriber.codigoDescuento);
        return res.status(400).json({ error: "Este código ya fue utilizado" });
      }

      const hoy = new Date();
      console.log("📅 [crearOrden] Fecha actual:", hoy, "| Expira:", subscriber.fechaExpiracion);
      if (hoy > subscriber.fechaExpiracion) {
        console.warn("⚠️ [crearOrden] Cupón expirado");
        return res.status(400).json({ error: "El código ha expirado 😞" });
      }

      // 💸 Aplica el descuento
      descuentoAplicado = +(total * 0.1).toFixed(2);
      nuevoTotal = +(total - descuentoAplicado).toFixed(2);
      console.log(`💰 [crearOrden] Descuento del 10% aplicado: $${descuentoAplicado} | Nuevo total: $${nuevoTotal}`);

      // 🔒 Marcar cupón como usado
      subscriber.usado = true;
      await subscriber.save();
      console.log("🔒 [crearOrden] Cupón marcado como usado en la BD");
    } else {
      console.log("ℹ️ [crearOrden] No se envió ningún código de descuento");
    }

    // 🧾 Crear y guardar orden
    const nuevaOrden = new Order({
      cliente,
      items,
      total: nuevoTotal,
      codigoDescuento: codigoDescuento || null,
      descuentoAplicado,
      estado: "Recibido",
      fecha: new Date(),
    });

    await nuevaOrden.save();
    console.log("✅ [crearOrden] Orden guardada correctamente con ID:", nuevaOrden._id);

    res.status(201).json({
      mensaje: "✅ Orden creada exitosamente",
      orden: {
        ...nuevaOrden.toObject(),
        descuentoOriginal: total,
        descuentoAplicado,
        codigoDescuento: codigoDescuento || null,
        descuentoInfo: descuentoAplicado
          ? `Se aplicó un descuento de $${descuentoAplicado.toLocaleString("es-CO")} (10%)`
          : "Sin descuento aplicado",
      },
    });
  } catch (error) {
    console.error("❌ [crearOrden] Error al crear la orden:", error);
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
