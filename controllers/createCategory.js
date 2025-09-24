// routes/categorias.js
const Categoria = require('../models/Category');
const slugify = require('slugify');

// Crear una categoría con subcategorías
const crearCategoria = async (req, res) => {
  try {
    const { nombre, subcategorias = [] } = req.body;
    const slug = slugify(nombre, { lower: true });

    // Verifica si la categoría ya existe
    const existe = await Categoria.findOne({ slug });
    if (existe) {
      return res.status(400).json({ error: 'La categoría ya existe' });
    }

    // Construye el array de subcategorías con slug
    const subcategoriasFormateadas = subcategorias.map((sub) => ({
      nombre: sub,
      slug: slugify(sub, { lower: true }),
    }));

    const nuevaCategoria = new Categoria({
      nombre,
      slug,
      subcategorias: subcategoriasFormateadas,
    });

    await nuevaCategoria.save();

    res.status(201).json({
      mensaje: 'Categoría creada correctamente',
      categoria: nuevaCategoria,
    });
  } catch (err) {
    console.error('Error al crear categoría:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener todas las categorías con subcategorías
const obtenerCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.find().lean();

    const categoriasReducidas = categorias.map(cat => ({
      _id: cat._id,
      nombre: cat.nombre,
      slug: cat.slug,
      subcategorias: cat.subcategorias.map(sub => ({
        _id: sub._id,
        nombre: sub.nombre,
        slug: sub.slug
      }))
    }));

    res.status(200).json(categoriasReducidas);
  } catch (err) {
    console.error('Error al obtener categorías:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  crearCategoria,
  obtenerCategorias
};
