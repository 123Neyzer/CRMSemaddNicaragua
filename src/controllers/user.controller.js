const { db } = require('../prisma/db');

const publicUserFields = ['id', 'name', 'email', 'role', 'state', 'createdAt', 'updatedAt'];

const sanitizeUser = (user) => {
  if (!user) return user;
  return Object.fromEntries(publicUserFields.map((field) => [field, user[field]]));
};

const getUsers = async (req, res, next) => {
  try {
    const users = await db.orm.user.select(...publicUserFields).all();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await db.orm.user.where({ id: Number(req.params.id) }).first();
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(sanitizeUser(user));
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role = 'admin', state = 1 } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email y password son obligatorios' });
    }
    const user = await db.orm.user.create({ name, email, password, role, state: Number(state) });
    res.status(201).json(sanitizeUser(user));
  } catch (error) {
    if (error?.code === 'ORM.UNIQUE_CONSTRAINT') {
      return res.status(409).json({ message: 'El email ya está registrado' });
    }
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const data = {};
    for (const field of ['name', 'email', 'password', 'role', 'state']) {
      if (req.body[field] !== undefined) data[field] = field === 'state' ? Number(req.body[field]) : req.body[field];
    }
    if (!Object.keys(data).length) return res.status(400).json({ message: 'No hay campos para actualizar' });
    const user = await db.orm.user.where({ id }).update(data);
    res.json(sanitizeUser(user));
  } catch (error) {
    if (error?.code === 'ORM.UNIQUE_CONSTRAINT') return res.status(409).json({ message: 'El email ya está registrado' });
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await db.orm.user.where({ id }).update({ state: 0 });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, getUser, createUser, updateUser, deleteUser };
