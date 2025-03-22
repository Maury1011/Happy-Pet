module.exports = (sequelize, DataTypes) => {
    const Categorias = sequelize.define('Categorias', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'categorias',
        timestamps: true
    });

    Categorias.associate = (models) => {
        Categorias.hasMany(models.Producto, {
            foreignKey: 'categoria_id',
            as: 'productos'
        });
    };

    return Categorias;
};











