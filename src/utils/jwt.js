const jwt = require('jsonwebtoken');

function generateToken(payload) {
  const secret = process.env.JWT_SECRET;
    const options = { expiresIn: '1h' }; // El token expirará en 1 hora
    return jwt.sign(payload, secret, options);
}

function verifyToken(token) {
    const secret = process.env.JWT_SECRET;
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        return null; // Token inválido o expirado
    }
}
module.exports = { generateToken, verifyToken };