const { db } = require('../prisma/db');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwt');
const { sanitizeUser } = require('./user.controller');
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'email y password son obligatorios' });
    }
    const user = await db.orm.users.where({ email }).first();
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    const token = generateToken({ id: user.id, email: user.email });
    res.json({ token, user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
};
const logoutUser = async (req, res, next) => {
  try {  
    res.json({ message: 'Sesión cerrada correctamente' });
  } catch (error) {
    next(error);
  }
};
module.exports = { loginUser, logoutUser };
