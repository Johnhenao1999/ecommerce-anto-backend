const mongoose = require('mongoose');

const VarianteSchema = new mongoose.Schema({
  color: String,
  imagen: String,
});

const ProductoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: String,
  marca: String,
  slug: { type: String, required: true, unique: true },
  imagen: String,
  precio: { type: Number, required: true },
  tieneDescuento: { type: Boolean, default: false },
  porcentajeDescuento: Number,
  precioDescuento: Number,
  variantes: [VarianteSchema],
  categoria: { type: String, required: true },     // slug de categoría
  subcategoria: { type: String },                  // slug de subcategoría (opcional)
}, { timestamps: true });

module.exports = mongoose.model('Products', ProductoSchema);
