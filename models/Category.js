const mongoose = require('mongoose');

const SubcategoriaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  slug: { type: String, required: true },
});

const CategoriaSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  subcategorias: [SubcategoriaSchema],
}, { timestamps: true });

module.exports = mongoose.model('Categoria', CategoriaSchema);
 