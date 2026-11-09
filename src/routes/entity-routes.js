// Cada entidad tiene su propio archivo de rutas y su propio controlador.
const enterpriseRoutes = require('./enterprise.routes');
const userenterpriseRoutes = require('./userenterprise.routes');
const clientRoutes = require('./client.routes');
const conversationRoutes = require('./conversation.routes');
const detailconversationRoutes = require('./detailconversation.routes');
const taskRoutes = require('./task.routes');

module.exports = {
  enterpriseRoutes,
  userenterpriseRoutes,
  clientRoutes,
  conversationRoutes,
  detailconversationRoutes,
  taskRoutes,
};
