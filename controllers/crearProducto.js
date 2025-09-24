const Categoria = require('../models/Category');
const Producto = require('../models/Products');
const slugify = require('slugify');

const crearProducto = async (req, res) => {
  try {
    const { categoriaNombre, subcategoriaNombre, ...producto } = req.body;

    if (!categoriaNombre || !producto.nombre || !producto.precio) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    const categoriaSlug = slugify(categoriaNombre, { lower: true });
    const subcategoriaSlug = subcategoriaNombre ? slugify(subcategoriaNombre, { lower: true }) : null;

    const categoria = await Categoria.findOne({ slug: categoriaSlug });
    if (!categoria) {
      return res.status(400).json({ error: "La categoría no existe" });
    }

    if (subcategoriaSlug && !categoria.subcategorias.find(s => s.slug === subcategoriaSlug)) {
      return res.status(400).json({ error: "La subcategoría no existe en la categoría" });
    }

    const slug = slugify(producto.nombre, { lower: true });

    const precioDescuento = producto.tieneDescuento && producto.porcentajeDescuento > 0
      ? +(producto.precio - (producto.precio * producto.porcentajeDescuento / 100)).toFixed(2)
      : null;

    const nuevoProducto = new Producto({
      ...producto,
      slug,
      precioDescuento,
      categoria: categoriaSlug,
      subcategoria: subcategoriaSlug || null,
    });

    await nuevoProducto.save();
    res.status(201).json({ mensaje: "Producto creado exitosamente", producto: nuevoProducto });
  } catch (error) {
    console.error("❌ Error al crear producto:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};



const listarProductos = async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json({ productos });
  } catch (error) {
    console.error("❌ Error al listar productos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const listarCategoriasConProductos = async (req, res) => {
  try {
    const categorias = await Categoria.find();
    const productos = await Producto.find();

    const resultado = categorias.map(cat => {
      const productosCat = productos.filter(p => p.categoria === cat.slug && !p.subcategoria);
      const subcategorias = cat.subcategorias.map(sub => ({
        nombre: sub.nombre,
        slug: sub.slug,
        productos: productos.filter(p => p.subcategoria === sub.slug)
      }));

      return {
        nombre: cat.nombre,
        slug: cat.slug,
        productos: productosCat,
        subcategorias
      };
    });

    res.json({ categorias: resultado });
  } catch (error) {
    console.error("❌ Error al listar categorías con productos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};



const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const datos = req.body;

    if (datos.nombre) {
      datos.slug = slugify(datos.nombre, { lower: true });
    }

    if (datos.tieneDescuento && datos.porcentajeDescuento > 0) {
      datos.precioDescuento = +(datos.precio - (datos.precio * datos.porcentajeDescuento / 100)).toFixed(2);
    } else {
      datos.precioDescuento = null;
    }

    if (datos.categoria) {
      datos.categoria = slugify(datos.categoria, { lower: true });
    }

    if (datos.subcategoria) {
      datos.subcategoria = slugify(datos.subcategoria, { lower: true });
    }

    const producto = await Producto.findByIdAndUpdate(id, datos, { new: true });
    if (!producto) return res.status(404).json({ error: "Producto no encontrado" });

    res.json({ mensaje: "Producto actualizado", producto });
  } catch (error) {
    console.error("❌ Error al actualizar producto:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Eliminar producto
const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByIdAndDelete(id);
    if (!producto) return res.status(404).json({ error: "Producto no encontrado" });

    res.json({ mensaje: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar producto:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};





module.exports = { crearProducto, listarProductos, listarCategoriasConProductos, actualizarProducto, eliminarProducto };
