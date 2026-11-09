const { createCrudController } = require('./crud.controller');

// Campos de enterprise según contract.prisma.
module.exports = createCrudController({
  model: 'enterprise',
  fields: ['nameenterprise', 'country', 'userId', 'state'],
  required: ['nameenterprise', 'country', 'userId'],
});
