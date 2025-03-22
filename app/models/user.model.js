const bcrypt = require('bcryptjs')
module.exports = (sequelize, DataTypes) => {
    const Usuario = sequelize.define(
        'Usuario', {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            nombre: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            rut: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            rol: {
                type: DataTypes.ENUM('cliente', 'admin'),
                defaultValue: 'cliente',
                allowNull: false,
            },
        },
    {
        tableName: 'usuarios',
        timestamps: true,
        hooks: {
            // Hash the password before saving it
            beforeCreate: async (usuario) => {
                if (usuario.password) {
                    const salt = await bcrypt.genSalt(10);
                    usuario.password = await bcrypt.hash(usuario.password, salt);
                }
            },
        }
    }
    )

    Usuario.prototype.validarPassword = function (password) {
        return bcrypt.compareSync(password, this.password);
    };

    return Usuario
}






