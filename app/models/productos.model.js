module.exports = (sequelize, DataTypes) => {
    const Producto = sequelize.define('Producto', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        sku: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notEmpty: true }
        },
        imagen: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        imagen2: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        imagen3: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        material: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        tamaño: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        color: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        peso: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        especie_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'especies',
                key: 'id'
            }
        },
        categoria_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'categorias',
                key: 'id'
            }
        },
        disponible: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        precio: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
    }, {
        tableName: 'productos',
        timestamps: true,
    });

    Producto.associate = (models) => {
        Producto.belongsTo(models.Especies, {
            foreignKey: 'especie_id',
            as: 'especie',
            onDelet: 'SET NULL',
            onUpdate: 'CASCADE'
        });
        Producto.belongsTo(models.Categorias, {
            foreignKey: 'categoria_id',
            as: 'categoria',
        });
        Producto.hasOne(models.Inventario, {
            foreignKey: 'producto_id',
            as: 'inventario'
        });
    };

    return Producto;
};













