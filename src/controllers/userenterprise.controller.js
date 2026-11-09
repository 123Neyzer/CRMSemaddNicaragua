const { createCrudController } = require('./crud.controller');

// Campos de userenterprise según contract.prisma.
module.exports = createCrudController({
  model: 'userenterprise',
  fields: ['userId', 'enterpriseId', 'fullName', 'email', 'username', 'role', 'password', 'state'],
  required: ['userId', 'enterpriseId', 'fullName', 'email', 'username', 'password'],
});
