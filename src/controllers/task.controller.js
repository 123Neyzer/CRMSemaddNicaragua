const { createCrudController } = require('./crud.controller');

// Controlador de tareas asignadas a agentes y clientes.
module.exports = createCrudController('task', ['id', 'title', 'description', 'userenterpriseId', 'clientId', 'priority', 'state', 'fechadeVencimiento', 'createdAt', 'updatedAt']);
