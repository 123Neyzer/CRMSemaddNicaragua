const { db } = require('../prisma/db');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwt');
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
    let isMatch = false;
    try {
      isMatch = await bcrypt.compare(password, user.password);
    } catch {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    const token = generateToken({ id: user.id, email: user.email });
    const publicUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      state: user.state,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    res.json({ token, user: publicUser });
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
