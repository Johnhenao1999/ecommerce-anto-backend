const { Router } = require('express');
const { crearProducto, listarCategoriasConProductos , actualizarProducto, eliminarProducto} = require('../controllers/crearProducto');
const { crearCategoria, obtenerCategorias } = require('../controllers/createCategory');
const { login, registrar, logout } = require('../controllers/authController');


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
// Rutas de autenticación
router.post('/auth/login', login);
router.post('/auth/register', registrar);
router.post('/auth/logout', logout);





module.exports = router;
