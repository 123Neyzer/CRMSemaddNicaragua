const { db } = require('../prisma/db');

const publicUserEnterpriseFields = [
  'id',
  'userId',
  'enterpriseId',
  'fullName',
  'email',
  'username',
  'role',
  'state',
  'createdAt',
  'updatedAt',
];

const sanitizeUserEnterprise = (userEnterprise) => Object.fromEntries(
  publicUserEnterpriseFields.map((field) => [field, userEnterprise[field]]),
);

// Lista todos los usuarios asociados a empresas.
const getUserEnterprises = async (req, res, next) => {
  try {
    const userEnterprises = await db.orm.userenterprise
      .select(...publicUserEnterpriseFields)
      .all();
    res.json(userEnterprises);
  } catch (error) {
    next(error);
  }
};

// Obtiene una asociación por ID.
const getUserEnterpriseById = async (req, res, next) => {
  try {
    const userEnterprise = await db.orm.userenterprise
      .where({ id: Number(req.params.id) })
      .first();
    if (!userEnterprise) {
      return res.status(404).json({ message: 'Usuario de empresa no encontrado' });
    }

    res.json(sanitizeUserEnterprise(userEnterprise));
  } catch (error) {
    next(error);
  }
};

// Crea una asociación entre un usuario y una empresa.
const createUserEnterprise = async (req, res, next) => {
  try {
    const {
      userId,
      enterpriseId,
      fullName,
      email,
      username,
      password,
      role = 'agente',
      state = 1,
    } = req.body;

    if ([userId, enterpriseId, fullName, email, username, password]
      .some((value) => value === undefined || value === '')) {
      return res.status(400).json({
        message: 'userId, enterpriseId, fullName, email, username y password son obligatorios',
      });
    }

    const userEnterprise = await db.orm.userenterprise.create({
      userId: Number(userId),
      enterpriseId: Number(enterpriseId),
      fullName,
      email,
      username,
      password,
      role,
      state: Number(state),
    });
    res.status(201).json(sanitizeUserEnterprise(userEnterprise));
  } catch (error) {
    next(error);
  }
};

// Actualiza únicamente los campos enviados.
const updateUserEnterprise = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const data = {};
    const textFields = ['fullName', 'email', 'username', 'password', 'role'];
    const numberFields = ['userId', 'enterpriseId', 'state'];

    textFields.forEach((field) => {
      if (req.body[field] !== undefined) data[field] = req.body[field];
    });
    numberFields.forEach((field) => {
      if (req.body[field] !== undefined) data[field] = Number(req.body[field]);
    });

    if (!Object.keys(data).length) {
      return res.status(400).json({ message: 'No hay campos para actualizar' });
    }

    const current = await db.orm.userenterprise.where({ id }).first();
    if (!current) {
      return res.status(404).json({ message: 'Usuario de empresa no encontrado' });
    }

    const userEnterprise = await db.orm.userenterprise.where({ id }).update(data);
    res.json(sanitizeUserEnterprise(userEnterprise));
  } catch (error) {
    next(error);
  }
};

// Elimina definitivamente la asociación.
const deleteUserEnterprise = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const current = await db.orm.userenterprise.where({ id }).first();
    if (!current) {
      return res.status(404).json({ message: 'Usuario de empresa no encontrado' });
    }

    await db.orm.userenterprise.where({ id }).delete();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserEnterprises,
  getUserEnterpriseById,
  createUserEnterprise,
  updateUserEnterprise,
  deleteUserEnterprise,
};
