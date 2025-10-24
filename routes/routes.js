const { Router } = require('express');
const { crearProducto, listarCategoriasConProductos, actualizarProducto, eliminarProducto } = require('../controllers/crearProducto');
const { crearCategoria, obtenerCategorias, actualizarCategoria, actualizarSubcategoria, agregarSubcategoria, eliminarCategoria, eliminarSubcategoria } = require('../controllers/createCategory');
const { login, registrar, logout } = require('../controllers/authController');
const { crearOrden, listarOrdenes, obtenerOrdenPorId, actualizarEstadoOrden, eliminarOrden } = require('../controllers/ordersController');


const router = Router();

// Ruta para crear un nuevo producto
router.post('/products', crearProducto);
// Ruta para listar todos los productos
router.get('/products', listarCategoriasConProductos);
// Ruta para actualizar un producto por ID
router.put('/products/:id', actualizarProducto);
// Ruta para eliminar un producto por ID
router.delete('/products/:id', eliminarProducto);
// Rutas para manejar categorías
router.post('/categories', crearCategoria);
// Ruta para obtener todas las categorías
router.get('/categories', obtenerCategorias);
router.put('/categories/:id', actualizarCategoria);
router.put('/categories/sub/:catId/:subId', actualizarSubcategoria);
router.post('/categories/:catId/sub', agregarSubcategoria);
router.delete('/categories/:id', eliminarCategoria);
router.delete('/categories/:catId/sub/:subId', eliminarSubcategoria);
// Rutas de autenticación
router.post('/auth/login', login);
router.post('/auth/register', registrar);
router.post('/auth/logout', logout);

router.post('/orders', crearOrden);              // Crear una orden
router.get('/orders', listarOrdenes);            // Listar todas
router.get('/orders/:id', obtenerOrdenPorId);     // Obtener una específica
router.put('/orders/:id', actualizarEstadoOrden); // Actualizar estado
router.delete('/orders/:id', eliminarOrden);      // Eliminar orden





module.exports = router;
