const { db } = require('../prisma/db');

// Crea controladores CRUD reutilizables para los modelos del CRM.
const createCrudController = (modelName, fields) => {
  const getAll = async (req, res, next) => {
    try { res.json(await db.orm[modelName].select(...fields).all()); } catch (error) { next(error); }
  };

  const getOne = async (req, res, next) => {
    try {
      const record = await db.orm[modelName].where({ id: Number(req.params.id) }).first();
      if (!record) return res.status(404).json({ message: 'Registro no encontrado' });
      res.json(record);
    } catch (error) { next(error); }
  };

  const create = async (req, res, next) => {
    try {
      const data = Object.fromEntries(fields.filter((field) => field !== 'id').filter((field) => req.body[field] !== undefined).map((field) => [field, req.body[field]]));
      const record = await db.orm[modelName].create(data);
      res.status(201).json(record);
    } catch (error) { next(error); }
  };

  const update = async (req, res, next) => {
    try {
      const data = Object.fromEntries(fields.filter((field) => field !== 'id').filter((field) => req.body[field] !== undefined).map((field) => [field, req.body[field]]));
      if (!Object.keys(data).length) return res.status(400).json({ message: 'No hay campos para actualizar' });
      const record = await db.orm[modelName].where({ id: Number(req.params.id) }).update(data);
      res.json(record);
    } catch (error) { next(error); }
  };

  const remove = async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const record = await db.orm[modelName].where({ id }).first();
      if (!record) return res.status(404).json({ message: 'Registro no encontrado' });
      await db.orm[modelName].where({ id }).delete();
      res.status(204).send();
    } catch (error) { next(error); }
  };

  return { getAll, getOne, create, update, remove };
};

module.exports = { createCrudController };
