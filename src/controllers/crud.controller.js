const { db } = require('../prisma/db');

// Convierte los identificadores y fechas recibidos desde Postman al tipo esperado por Prisma.
const normalizeValue = (field, value) => {
  if (value === undefined) return value;
  if (field === 'fechadeVencimiento' || field === 'createdAt' || field === 'updatedAt') {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) throw new Error(`La fecha ${field} no es válida`);
    return date;
  }
  if (field.endsWith('Id') || field === 'empresaId' || field === 'state') return Number(value);
  return value;
};

// Crea un controlador completo: listar, consultar, crear, actualizar y eliminar definitivamente.
const createCrudController = ({ model, fields, required = [] }) => {
  const publicFields = ['id', ...fields, 'createdAt', 'updatedAt'];
  const getData = (body) => Object.fromEntries(
    fields.filter((field) => body[field] !== undefined)
      .map((field) => [field, normalizeValue(field, body[field])]),
  );

  // GET /resource: devuelve todos los registros.
  const getAll = async (req, res, next) => {
    try { res.json(await db.orm[model].select(...publicFields).all()); } catch (error) { next(error); }
  };

  // GET /resource/:id: devuelve un registro por su identificador.
  const getOne = async (req, res, next) => {
    try {
      const record = await db.orm[model].where({ id: Number(req.params.id) }).first();
      if (!record) return res.status(404).json({ message: 'Registro no encontrado' });
      res.json(record);
    } catch (error) { next(error); }
  };

  // POST /resource: valida los campos obligatorios y crea un registro.
  const create = async (req, res, next) => {
    try {
      const missing = required.filter((field) => req.body[field] === undefined || req.body[field] === '');
      if (missing.length) return res.status(400).json({ message: `Campos obligatorios: ${missing.join(', ')}` });
      const record = await db.orm[model].create(getData(req.body));
      res.status(201).json(record);
    } catch (error) { next(error); }
  };

  // PATCH /resource/:id: actualiza únicamente los campos enviados.
  const update = async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const current = await db.orm[model].where({ id }).first();
      if (!current) return res.status(404).json({ message: 'Registro no encontrado' });
      const data = getData(req.body);
      if (!Object.keys(data).length) return res.status(400).json({ message: 'No hay campos para actualizar' });
      res.json(await db.orm[model].where({ id }).update(data));
    } catch (error) { next(error); }
  };

  // DELETE /resource/:id: elimina físicamente el registro de la base de datos.
  const remove = async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const current = await db.orm[model].where({ id }).first();
      if (!current) return res.status(404).json({ message: 'Registro no encontrado' });
      await db.orm[model].where({ id }).delete();
      res.status(204).send();
    } catch (error) { next(error); }
  };

  return { getAll, getOne, create, update, remove };
};

module.exports = { createCrudController };
