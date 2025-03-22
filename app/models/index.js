const { Sequelize, DataTypes } = require('sequelize');
const dbConfig = require('../config/db.config.js');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.DIALECT,
    logging: false
});

const db = {};

db.Usuario = require('./user.model.js')(sequelize, DataTypes);
db.Producto = require('./productos.model.js')(sequelize, DataTypes);
db.Inventario = require('./inventario.model.js')(sequelize, DataTypes);
db.Especies = require('./especies.model.js')(sequelize, DataTypes);
db.Categorias = require('./categorias.model.js')(sequelize, DataTypes);

// Configuración de asociaciones
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Función para inicializar la base de datos y crear el usuario admin
async function initializeDatabase() {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida exitosamente');

        // Sincronizar las tablas en el orden correcto
        await db.Especies.sync({alter: true});
        await db.Categorias.sync({alter: true});
        await db.Producto.sync({alter: true});
        await db.Inventario.sync({alter: true});
        await db.Usuario.sync({alter: true});

        console.log('Tablas creadas o actualizadas con éxito');

        const categorias = ['aseo', 'juguetes', 'accesorios', 'alimento', 'comedores', 'ropa', 'collares'];

        for (const nombre of categorias) {
            await db.Categorias.findOrCreate({
                where: { nombre },
                defaults: { nombre }
            });
        }

        const especies = ['perro', 'gato', 'hasmter', 'caballo', 'tortuga', 'conejo', 'pez', 'pajaro', 'iguana', 'cerdo'];
        for (const nombre of especies) {
            await db.Especies.findOrCreate({
                where: { nombre },
                defaults: { nombre }
            });
        }
        console.log('Especies agregadas correctamente.');
        
        await db.Usuario.findOrCreate({
            where: { email: 'admin@correo.com' },
            defaults: {
                nombre: 'admin',
                rut: '12345678-9',
                password: 'admin123',
                rol: 'admin'
            }
        });

        console.log('Usuario admin creado correctamente.');

        // Agregar productos
        const productos = [
            { sku: 'SKU001', nombre: 'Juguete para perro', precio: 15.99, categoria_id: 2, especie_id: 1, disponible: true },
            { sku: 'SKU002', nombre: 'Comida para gato', precio: 25.50, categoria_id: 4, especie_id: 2, disponible: true },
            { sku: 'SKU003', nombre: 'Collar para perro', precio: 9.99, categoria_id: 7, especie_id: 1, disponible: true },
            { sku: 'SKU004', nombre: 'Cepillo para caballo', precio: 20.00, categoria_id: 1, especie_id: 4, disponible: true },
            { sku: 'SKU005', nombre: 'Ropa para conejo', precio: 12.00, categoria_id: 6, especie_id: 6, disponible: true },
            { sku: 'SKU006', nombre: 'Acuario para peces', precio: 50.00, categoria_id: 3, especie_id: 7, disponible: true },
            { sku: 'SKU007', nombre: 'Jaula para pájaros', precio: 70.00, categoria_id: 3, especie_id: 8, disponible: true },
            { sku: 'SKU008', nombre: 'Casa para gato', precio: 35.00, categoria_id: 3, especie_id: 2, disponible: true },
            { sku: 'SKU009', nombre: 'Snacks para perro', precio: 8.50, categoria_id: 4, especie_id: 1, disponible: true },
            { sku: 'SKU010', nombre: 'Hamaca para hámster', precio: 5.00, categoria_id: 3, especie_id: 3, disponible: true },
            { sku: 'SKU011', nombre: 'Pelota interactiva', precio: 18.00, categoria_id: 2, especie_id: 1, disponible: true },
            { sku: 'SKU012', nombre: 'Rascador para gatos', precio: 45.00, categoria_id: 3, especie_id: 2, disponible: true },
            { sku: 'SKU013', nombre: 'Correa retráctil', precio: 14.99, categoria_id: 7, especie_id: 1, disponible: true },
            { sku: 'SKU014', nombre: 'Comedero automático', precio: 60.00, categoria_id: 5, especie_id: 2, disponible: true },
            { sku: 'SKU015', nombre: 'Juguete masticable', precio: 7.00, categoria_id: 2, especie_id: 1, disponible: true },
            { sku: 'SKU016', nombre: 'Alimento premium', precio: 40.00, categoria_id: 4, especie_id: 2, disponible: true },
            { sku: 'SKU017', nombre: 'Ropa de invierno', precio: 22.00, categoria_id: 6, especie_id: 1, disponible: true },
            { sku: 'SKU018', nombre: 'Arena para gato', precio: 15.00, categoria_id: 1, especie_id: 2, disponible: true },
            { sku: 'SKU019', nombre: 'Caseta para perro', precio: 100.00, categoria_id: 3, especie_id: 1, disponible: true },
            { sku: 'SKU020', nombre: 'Filtro de agua', precio: 30.00, categoria_id: 5, especie_id: 7, disponible: true },
        ];

        for (const producto of productos) {
            const [nuevoProducto] = await db.Producto.findOrCreate({
                where: { sku: producto.sku },
                defaults: producto
            });

            await db.Inventario.findOrCreate({
                where: { producto_id: nuevoProducto.id },
                defaults: { producto_id: nuevoProducto.id, stock: Math.floor(Math.random() * 60) + 1 }
            });
        }

        console.log('Productos e inventario agregados correctamente.');
    } catch (error) {
        console.error('Error durante la inicialización:', error);
    }
}

initializeDatabase();

module.exports = db;
















