const { createCrudController } = require('./crud.controller');

// Controlador de clientes del CRM.
module.exports = createCrudController('client', ['id', 'fullName', 'telephone', 'classification', 'summary', 'empresaId', 'createdAt', 'updatedAt']);
