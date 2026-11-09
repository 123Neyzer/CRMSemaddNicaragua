const { createCrudController } = require('./crud.controller');

// Campos de conversation según contract.prisma.
module.exports = createCrudController({
  model: 'conversation',
  fields: ['clientId', 'userId', 'enterpriseId', 'message', 'canal', 'state'],
  required: ['clientId', 'userId', 'enterpriseId', 'message', 'canal'],
});
