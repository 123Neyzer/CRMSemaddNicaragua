const { db } = require('../prisma/db');

// Lista todas las tareas.
const getTasks = async (req, res, next) => {
  try {
    res.json(await db.orm.task.all());
  } catch (error) {
    next(error);
  }
};

// Obtiene una tarea por ID.
const getTaskById = async (req, res, next) => {
  try {
    const item = await db.orm.task.where({ id: Number(req.params.id) }).first();
    if (!item) return res.status(404).json({ message: 'Tarea no encontrada' });

    res.json(item);
  } catch (error) {
    next(error);
  }
};

// Crea una tarea.
const createTask = async (req, res, next) => {
  try {
    const {
      title,
      description,
      userenterpriseId,
      clientId,
      priority,
      state,
      fechadeVencimiento,
    } = req.body;

    if ([title, description, userenterpriseId, clientId, fechadeVencimiento].some((value) => value === undefined || value === '')) {
      return res.status(400).json({
        message: 'title, description, userenterpriseId, clientId y fechadeVencimiento son obligatorios',
      });
    }

    const date = new Date(fechadeVencimiento);
    if (Number.isNaN(date.getTime())) {
      return res.status(400).json({ message: 'fechadeVencimiento no es válida' });
    }

    const task = await db.orm.task.create({
      title,
      description,
      userenterpriseId: Number(userenterpriseId),
      clientId: Number(clientId),
      fechadeVencimiento: date,
      ...(priority === undefined ? {} : { priority }),
      ...(state === undefined ? {} : { state: Number(state) }),
    });
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

// Actualiza los campos enviados.
const updateTask = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const data = { ...req.body };
    ['userenterpriseId', 'clientId', 'state'].forEach((field) => {
      if (data[field] !== undefined) data[field] = Number(data[field]);
    });

    if (data.fechadeVencimiento !== undefined) {
      data.fechadeVencimiento = new Date(data.fechadeVencimiento);
      if (Number.isNaN(data.fechadeVencimiento.getTime())) {
        return res.status(400).json({ message: 'fechadeVencimiento no es válida' });
      }
    }

    const current = await db.orm.task.where({ id }).first();
    if (!current) return res.status(404).json({ message: 'Tarea no encontrada' });

    res.json(await db.orm.task.where({ id }).update(data));
  } catch (error) {
    next(error);
  }
};

// Elimina definitivamente la tarea.
const deleteTask = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const current = await db.orm.task.where({ id }).first();
    if (!current) return res.status(404).json({ message: 'Tarea no encontrada' });

    await db.orm.task.where({ id }).delete();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
