const { createCrudController } = require('./crud.controller');

// Campos de detailconversation según contract.prisma.
module.exports = createCrudController({
  model: 'detailconversation',
  fields: ['conversationId', 'message', 'typeagent', 'userenterpriseId', 'state', 'content'],
  required: ['conversationId', 'message', 'typeagent', 'userenterpriseId', 'content'],
});
