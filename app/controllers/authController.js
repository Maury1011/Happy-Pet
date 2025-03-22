const bcrypt = require('bcryptjs');
const db = require('../models');
const Usuario = db.Usuario;
require('dotenv').config();

exports.registrarUsuario = async (req, res) => {
    const { nombre, rut, email, password } = req.body;

    try {
        const usuarioExistente = await Usuario.findOne({ where: { email } });
        if (usuarioExistente) {
            return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
        }

        if (!nombre || !email || !rut) {
            return res.status(400).send({ message: 'El nombre, el RUT y el email son obligatorios' });
        }

        const nuevoUsuario = await Usuario.create({ nombre, rut, email, password: password });

        // Guardar los datos del usuario en la sesión
        req.session.user = { id: nuevoUsuario.id, email: nuevoUsuario.email, rol: nuevoUsuario.rol };

        res.status(201).json({ 
            message: 'Usuario registrado exitosamente.',
            usuario: { id: nuevoUsuario.id, nombre: nuevoUsuario.nombre, email: nuevoUsuario.email, rol: nuevoUsuario.rol } 
        });
    } catch (error) {
        console.error('Error al registrar el usuario:', error.message, error.stack);
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

exports.loginUsuario = async (req, res) => {
    const { email, password } = req.body;

    try {
        const usuario = await Usuario.findOne({ where: { email } });
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        const esValido = await bcrypt.compare(password, usuario.password);
        if (!esValido) {
            return res.status(400).json({ message: 'Contraseña incorrecta.' });
        }

        // Guardar los datos del usuario en la sesión
        req.session.user = { id: usuario.id, email: usuario.email, rol: usuario.rol };

        res.json({ message: 'Inicio de sesión exitoso.', rol: usuario.rol });
    } catch (error) {
        console.error('Error al iniciar sesión:', error.message, error.stack);
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

exports.logoutUsuario = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Error al cerrar sesión' });
        }
        res.json({ message: 'Sesión cerrada exitosamente' });
    });
};


//crear y guardar un usuario
exports.createUser = async (req, res) => {
    try {
        const { nombre, apellido, email } = req.body

        if (!nombre || !email || !apellido) {
            return res.status(400).send({ message: 'el nombre, el apellido y el email son obligatorios' })
        }

        const newUser = await Usuario.create({ nombre, apellido, email })
        res.status(201).send(newUser)
        console.log('se ha creado el usuario: ')
        console.log({id: newUser.id, nombre: nombre, apellido: apellido, email: email, updatedAt: newUser.updatedAt, createdAt: newUser.createdAt})
    } catch (error) {
        res.status(500).send({
            message: 'error al crear el usuario',
            error: error.message,
        });
    }
};

//obtener los bootcamps de un usuario por su id
exports.findUserById = async (req, res) => {
    try {
        const { id } = req.params

        const user = await Usuario.findByPk(id, {
            include: Bootcamp,
        });

        if (!user) {
            return res.status(404).send({ message: `usuario con id ${id} no encontrado.` })
        }

        res.send(user)
    } catch (error) {
        res.status(500).send({
            message: 'error al buscar el usuario',
            error: error.message,
        });
    }
};

//obtener todos los usuarios, incluyendo los bootcamps relacionados
exports.findAll = async (req, res) => {
    try {
        const users = await Usuario.findAll({
            include: Bootcamp,
        })
        res.send(users)
    } catch (error) {
        res.status(500).send({
            message: 'error al obtener los usuarios',
            error: error.message,
        });
    }
};

//actualizar un usuario por id
exports.updateUserById = async (req, res) => {
    try {
        const { id } = req.params
        const { nombre, apellido, email } = req.body

        const user = await Usuario.findByPk(id)
        if (!user) {
            return res.status(404).send({ message: `usuario con id ${id} no encontrado` })
        }

        user.nombre = nombre || user.nombre
        user.apellido = apellido|| user.apellido
        user.email = email || user.email
        await user.save()

        res.send({ message: 'usuario actualizado con exito', user })
    } catch (error) {
        res.status(500).send({
            message: 'error al actualizar el usuario',
            error: error.message,
        })
    }
}

//eliminar un usuario por id
exports.deleteUserById = async (req, res) => {
    try {
        const { id } = req.params

        const user = await Usuario.findByPk(id)
        if (!user) {
            return res.status(404).send({ message: `usuario con id ${id} no encontrado` })
        }

        await user.destroy()
        res.send({ message: `usuario con id ${id} eliminado con exito` })
    } catch (error) {
        res.status(500).send({
            message: 'error al eliminar el usuario',
            error: error.message,
        });
    }
};

















