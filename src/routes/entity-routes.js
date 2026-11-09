const { createCrudRouter } = require('./crud.routes');
const enterpriseController = require('../controllers/enterprise.controller');
const userenterpriseController = require('../controllers/userenterprise.controller');
const clientController = require('../controllers/client.controller');
const conversationController = require('../controllers/conversation.controller');
const detailconversationController = require('../controllers/detailconversation.controller');
const taskController = require('../controllers/task.controller');

// Cada exportación representa el router REST de una entidad del CRM.
module.exports = {
  enterpriseRoutes: createCrudRouter(enterpriseController),
  userenterpriseRoutes: createCrudRouter(userenterpriseController),
  clientRoutes: createCrudRouter(clientController),
  conversationRoutes: createCrudRouter(conversationController),
  detailconversationRoutes: createCrudRouter(detailconversationController),
  taskRoutes: createCrudRouter(taskController),
};
