const db = require('../models');
const Producto = db.Producto;

// Obtener todos los productos con sus relaciones
exports.obtenerProductos = async (req, res) => {
    try {
        const productos = await Producto.findAll({
            include: [
                { model: db.Categorias, as: 'categoria' },
                { model: db.Especies, as: 'especie' },
                { model: db.Inventario, as: 'inventario' }
            ]
        });

        res.render('productos', { productos });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send('Error al cargar productos');
    }
};




//obtener un producto por su id
exports.productoId = async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await Producto.findByPk(id, {
            include: [
                { model: db.Categorias, as: 'categoria' },
                { model: db.Especies, as: 'especie' },
                { model: db.Inventario, as: 'inventario' }
            ]
        });
        if (producto) {
            res.render('productoDetalle', { producto });
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (error) {
        console.error('Error al obtener detalles del producto:', error);
        res.status(500).send('Error al cargar detalles del producto');
    }
}

exports.verProductos = async (req, res) => {
    try { 
        const productos = await Producto.findAll(); 
        res.render('admin/productos', { productos }); 
    } catch (error) { 
        console.error('Error al obtener productos:', error); 
        res.status(500).send('Error al cargar productos'); 
    } 
};

exports.formularioNuevoProducto = (req, res) => {
    res.render('admin/nuevoProducto');
};

exports.crearProducto = async (req, res) => {
    try {
        const { sku, nombre, imagen, imagen2, imagen3, material, tamaño, color, peso, especie, categoria, disponibilidad, precio } = req.body;
        const nuevoProducto = await Producto.create({ sku, nombre, imagen, imagen2, imagen3, material, tamaño, color, peso, especie, categoria, disponibilidad, precio });
        res.status(201).json({ message: 'Producto creado exitosamente', producto: nuevoProducto });
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({ message: 'Error al crear producto' });
    }
};

exports.formularioEditarProducto = async (req, res) => {
    try {
        const producto = await Producto.findByPk(req.params.id);
        res.render('admin/editarProducto', { producto });
    } catch (error) {
        console.error('Error al obtener producto:', error);
        res.status(500).send('Error al cargar producto');
    }
};

exports.editarProducto = async (req, res) => {
    try {
        const { sku, nombre, imagen, imagen2, imagen3, material, tamaño, color, 
            peso, especie, categoria, disponibilidad, precio } = req.body;
        await Producto.update(
            { sku, nombre, imagen, imagen2, imagen3, material, tamaño, color, 
                peso, especie, categoria, disponibilidad, precio },
            { where: { id: req.params.id } }
        );
        res.redirect('/admin/productos');
    } catch (error) {
        console.error('Error al editar producto:', error);
        res.status(500).send('Error al editar producto');
    }
};

exports.eliminarProducto = async (req, res) => {
    try {
        await Producto.destroy({ where: { id: req.params.id } });
        res.redirect('/admin/productos');
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).send('Error al eliminar producto');
    }
};











