const { createCrudController } = require('./crud.controller');

// Controlador de mensajes detallados de una conversación.
module.exports = createCrudController('detailconversation', ['id', 'conversationId', 'message', 'typeagent', 'userenterpriseId', 'state', 'content', 'createdAt', 'updatedAt']);
