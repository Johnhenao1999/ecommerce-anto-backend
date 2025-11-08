const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    cliente: {
      nombre: { type: String, required: true },
      celular: { type: String, required: true },
      departamento: { type: String, required: true },
      ciudad: { type: String, required: true },
      direccion: { type: String, required: true },
      formaPago: {
        type: String,
        enum: ["Efectivo", "Nequi", "Daviplata"],
        required: true,
      },
      observaciones: { type: String, required: false },
    },
    items: [
      {
        id: String,
        nombre: String,
        cantidad: Number,
        precio: Number,
      },
    ],

    // 💸 Campos para descuentos y códigos promocionales
    codigoDescuento: { type: String, required: false },
    descuentoAplicado: { type: Number, default: 0 },

    total: { type: Number, required: true },
    estado: {
      type: String,
      enum: ["Recibido", "En preparación", "En camino", "Listo", "Cancelado"],
      default: "Recibido",
    },
    fecha: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
