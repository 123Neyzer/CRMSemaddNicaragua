const { createCrudController } = require('./crud.controller');

// Controlador de empresas y sus relaciones principales.
module.exports = createCrudController('enterprise', ['id', 'nameenterprise', 'country', 'userId', 'state', 'createdAt', 'updatedAt']);
