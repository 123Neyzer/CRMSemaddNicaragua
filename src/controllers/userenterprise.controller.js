const { createCrudController } = require('./crud.controller');

// Controlador de usuarios vinculados a una empresa.
module.exports = createCrudController('userenterprise', ['id', 'userId', 'enterpriseId', 'fullName', 'email', 'username', 'role', 'password', 'state', 'createdAt', 'updatedAt']);
