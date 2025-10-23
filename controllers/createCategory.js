// routes/categorias.js
const express = require('express');
const router = express.Router();
const Categoria = require('../models/Category');
const slugify = require('slugify');

/* ================================
   Crear una categoría con subcategorías
=================================== */
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
    console.error('❌ Error al crear categoría:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/* ================================
   Obtener todas las categorías con subcategorías
=================================== */
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
        slug: sub.slug,
      })),
    }));

    res.status(200).json(categoriasReducidas);
  } catch (err) {
    console.error('❌ Error al obtener categorías:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/* ================================
   Actualizar nombre de una categoría
=================================== */
const actualizarCategoria = async (req, res) => {
  try {
    const { nombre } = req.body;
    const slug = slugify(nombre, { lower: true });

    const categoriaActualizada = await Categoria.findByIdAndUpdate(
      req.params.id,
      { nombre, slug },
      { new: true }
    );

    if (!categoriaActualizada) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    res.status(200).json({
      mensaje: 'Categoría actualizada correctamente',
      categoria: categoriaActualizada,
    });
  } catch (err) {
    console.error('❌ Error al actualizar categoría:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/* ================================
   Actualizar nombre de una subcategoría
=================================== */
const actualizarSubcategoria = async (req, res) => {
  try {
    const { nombre } = req.body;
    const { catId, subId } = req.params;

    const categoria = await Categoria.findById(catId);
    if (!categoria) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    const sub = categoria.subcategorias.id(subId);
    if (!sub) {
      return res.status(404).json({ error: 'Subcategoría no encontrada' });
    }

    sub.nombre = nombre;
    sub.slug = slugify(nombre, { lower: true });

    await categoria.save();

    res.status(200).json({
      mensaje: 'Subcategoría actualizada correctamente',
      subcategoria: sub,
    });
  } catch (err) {
    console.error('❌ Error al actualizar subcategoría:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/* ================================
   Agregar una nueva subcategoría a una categoría existente
=================================== */
const agregarSubcategoria = async (req, res) => {
  try {
    const { nombre } = req.body;
    const { catId } = req.params;

    console.log('📥 Datos recibidos:', { catId, nombre });

    const categoria = await Categoria.findById(catId);
    if (!categoria) {
      console.warn('⚠️ Categoría no encontrada para ID:', catId);
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    const slug = slugify(nombre, { lower: true });
    categoria.subcategorias.push({ nombre, slug });

    console.log('🧱 Antes de guardar:', categoria.subcategorias);

    await categoria.save();

    console.log('✅ Subcategoría agregada correctamente');

    res.status(201).json({
      mensaje: 'Subcategoría agregada correctamente',
      subcategorias: categoria.subcategorias,
    });
  } catch (err) {
    console.error('❌ Error al agregar subcategoría:', err.message);
    res.status(500).json({
      error: 'Error interno del servidor',
      detalle: err.message,
      stack: err.stack,
    });
  }
};


/* ================================
   Exportación de controladores
=================================== */
module.exports = {
  crearCategoria,
  obtenerCategorias,
  actualizarCategoria,
  actualizarSubcategoria,
  agregarSubcategoria,
};
