module.exports = (sequelize, DataTypes) => {
    const Inventario = sequelize.define('Inventario', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        producto_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'productos',
                key: 'id'
            }
        },
        stock: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        tableName: 'inventario',
        timestamps: true
    });

    Inventario.associate = (models) => {
        Inventario.belongsTo(models.Producto, {
            foreignKey: 'producto_id',
            as: 'producto'
        });
    };

    return Inventario;
};
