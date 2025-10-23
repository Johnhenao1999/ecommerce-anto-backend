const express = require('express');
const router = express.Router();
const Categoria = require('../models/Category');
const Products = require('../models/Products'); // 👈 tu modelo actual
const slugify = require('slugify');

/**
 * Genera el sitemap.xml con categorías, subcategorías y productos
 * URL final: https://antostoremakeup.vercel.app/sitemap.xml
 */
router.get('/sitemap.xml', async (req, res) => {
  try {
    const baseUrl = 'https://antostoremakeup.vercel.app';

    // Consultar categorías y productos
    const categorias = await Categoria.find().lean();
    const productos = await Products.find().lean();

    // 🔹 Estructura base de URLs
    let urls = [
      { loc: `${baseUrl}/`, changefreq: 'weekly', priority: '1.0' },
    ];

    // 🔹 Agregar categorías y subcategorías
    categorias.forEach((cat) => {
      urls.push({
        loc: `${baseUrl}/categoria/${cat.slug}`,
        changefreq: 'weekly',
        priority: '0.9',
      });

      cat.subcategorias.forEach((sub) => {
        urls.push({
          loc: `${baseUrl}/categoria/${cat.slug}/${sub.slug}`,
          changefreq: 'weekly',
          priority: '0.8',
        });
      });
    });

    // 🔹 Agregar productos
    productos.forEach((prod) => {
      const productoSlug = prod.slug || slugify(prod.nombre, { lower: true });
      urls.push({
        loc: `${baseUrl}/producto/${productoSlug}`,
        changefreq: 'monthly',
        priority: '0.7',
      });
    });

    // 🔹 Construir XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `
  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('')}
</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (err) {
    console.error('❌ Error generando sitemap:', err);
    res.status(500).send('Error generando sitemap.xml');
  }
});

module.exports = router;
