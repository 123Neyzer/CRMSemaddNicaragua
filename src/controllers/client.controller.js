const { createCrudController } = require('./crud.controller');

// Campos de client según contract.prisma.
module.exports = createCrudController({
  model: 'client',
  fields: ['fullName', 'telephone', 'classification', 'summary', 'empresaId'],
  required: ['fullName', 'telephone', 'classification', 'summary', 'empresaId'],
});
