module.exports = (sequelize, DataTypes) => {
    const Especies = sequelize.define('Especies', {
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
        tableName: 'especies',
        timestamps: true
    });

    Especies.associate = (models) => {
        Especies.hasMany(models.Producto, {
            foreignKey: 'especie_id',
            as: 'productos'
        });
    };

    return Especies;
};














