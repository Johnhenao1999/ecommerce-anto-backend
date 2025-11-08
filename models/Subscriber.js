const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    correo: { type: String, required: true, unique: true, lowercase: true, trim: true },
    telefono: { type: String, required: true, unique: true, trim: true },
    codigoDescuento: { type: String, required: true, unique: true },
    usado: { type: Boolean, default: false },
    fechaSuscripcion: { type: Date, default: Date.now },
    fechaExpiracion: {
      type: Date,
      default: () => {
        const fecha = new Date();
        fecha.setMonth(fecha.getMonth() + 1); // ✅ +1 mes de validez
        return fecha;
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Subscriber', subscriberSchema);
