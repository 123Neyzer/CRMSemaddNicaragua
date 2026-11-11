const { db } = require('../prisma/db');
const { hashPassword } = require('./auth.helpers');

// Campos permitidos en las respuestas públicas. Nunca devolvemos contraseñas.
const publicUserFields = ['id', 'name', 'email', 'role', 'state', 'createdAt', 'updatedAt'];

// Elimina datos sensibles antes de enviar un usuario al cliente.
const sanitizeUser = (user) => {
  if (!user) return user;
  return Object.fromEntries(publicUserFields.map((field) => [field, user[field]]));
};

// Obtiene todos los usuarios registrados.
const getUsers = async (req, res, next) => {
  try {
    const users = await db.orm.user.select(...publicUserFields).all();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// Obtiene un usuario por su identificador.
const getUser = async (req, res, next) => {
  try {
    const user = await db.orm.user.where({ id: Number(req.params.id) }).first();
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(sanitizeUser(user));
  } catch (error) {
    next(error);
  }
};

// Valida y crea un usuario nuevo.
const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role = 'admin', state = 1 } = req.body;
    if (!name || !email || typeof password !== 'string') {
      return res.status(400).json({ message: 'name, email y password son obligatorios' });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: 'password debe tener al menos 8 caracteres' });
    }
    const passwordHash = await hashPassword(password);
    const user = await db.orm.user.create({ name, email, password: passwordHash, role, state: Number(state) });
    res.status(201).json(sanitizeUser(user));
  } catch (error) {
    if (error?.code === 'ORM.UNIQUE_CONSTRAINT') {
      return res.status(409).json({ message: 'El email ya está registrado' });
    }
    next(error);
  }
};

// Actualiza únicamente los campos enviados en la petición.
const updateUser = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const data = {};
    for (const field of ['name', 'email', 'role', 'state']) {
      if (req.body[field] !== undefined) data[field] = field === 'state' ? Number(req.body[field]) : req.body[field];
    }
    if (req.body.password !== undefined) {
      if (typeof req.body.password !== 'string' || req.body.password.length < 8) {
        return res.status(400).json({ message: 'password debe tener al menos 8 caracteres' });
      }
      data.password = await hashPassword(req.body.password);
    }
    if (!Object.keys(data).length) return res.status(400).json({ message: 'No hay campos para actualizar' });
    const user = await db.orm.user.where({ id }).update(data);
    res.json(sanitizeUser(user));
  } catch (error) {
    if (error?.code === 'ORM.UNIQUE_CONSTRAINT') return res.status(409).json({ message: 'El email ya está registrado' });
    next(error);
  }
};

// Desactiva un usuario sin eliminarlo de la base de datos.
const deleteUser = async (req, res, next) => {
  try {
    await db.orm.user.where({ id: Number(req.params.id) }).update({ state: 0 });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// Elimina definitivamente el registro del usuario.
const hardDeleteUser = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const user = await db.orm.user.where({ id }).first();
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    await db.orm.user.where({ id }).delete();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, getUser, createUser, updateUser, deleteUser, hardDeleteUser };
