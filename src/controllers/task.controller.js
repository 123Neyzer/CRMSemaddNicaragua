const { createCrudController } = require('./crud.controller');

// Campos de task según contract.prisma.
module.exports = createCrudController({
  model: 'task',
  fields: ['title', 'description', 'userenterpriseId', 'clientId', 'priority', 'state', 'fechadeVencimiento'],
  required: ['title', 'description', 'userenterpriseId', 'clientId', 'fechadeVencimiento'],
});
