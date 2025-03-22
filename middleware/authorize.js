module.exports = (role) => {
    return (req, res, next) => {
        if (!req.session.user) {
            return res.status(403).send('Acceso denegado: Usuario no autenticado');
        }
        if (req.session.user.rol === role) {
            next();
        } else {
            res.status(403).send('Acceso denegado: Permisos insuficientes');
        }
    };
};




