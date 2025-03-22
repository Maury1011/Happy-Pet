const jwt = require('jsonwebtoken');
require('dotenv').config();
const secretKey = process.env.JWT_SECRET;

function verificarToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: 'No se proporcionó token.' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(500).json({ message: 'Fallo al autenticar el token.' });
        }
        req.user = decoded;
        next();
    });
};

module.exports = { verificarToken };




















