const express = require('express');
const session = require('express-session');
const path = require('path');
const productoController = require('./app/controllers/producto.controller');
const authController = require('./app/controllers/authController');
const authorize = require('./middleware/authorize');
const { verificarToken } = require('./middleware/auth');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'tu-secreto-de-sesion',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Usa 'secure: true' si estás usando HTTPS
}));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal
app.get('/', (req, res) => {
    res.render('index');
});

// Rutas de autenticación
app.get('/auth', (req, res) => {
    res.render('auth');
});
app.post('/auth/register', authController.registrarUsuario);
app.post('/auth/login', authController.loginUsuario);
app.get('/logout', authController.logoutUsuario);

// Rutas para productos (protegidas)
app.get('/productos', productoController.obtenerProductos);
app.get('/productos/:id', productoController.productoId);

// Rutas de administración de productos (solo admin)
app.get('/admin/productos', authorize('admin'), productoController.verProductos);
app.get('/admin/productos/nuevo', authorize('admin'), productoController.formularioNuevoProducto);
app.post('/admin/productos/nuevo', authorize('admin'), productoController.crearProducto);
app.get('/admin/productos/:id/editar', authorize('admin'), productoController.formularioEditarProducto);
app.post('/admin/productos/:id/editar', authorize('admin'), productoController.editarProducto);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`servidor corriendo en http://localhost:${PORT}`);
});
