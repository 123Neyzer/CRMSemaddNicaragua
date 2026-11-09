const { createCrudController } = require('./crud.controller');

// Controlador de conversaciones entre usuarios y clientes.
module.exports = createCrudController('conversation', ['id', 'clientId', 'userId', 'enterpriseId', 'message', 'canal', 'state', 'createdAt', 'updatedAt']);
