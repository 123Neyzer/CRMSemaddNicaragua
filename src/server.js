const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/user.routes');
const enterpriseRoutes = require('./routes/enterprise.routes');
const userEnterpriseRoutes = require('./routes/userenterprise.routes');
const clientRoutes = require('./routes/client.routes');
const conversationRoutes = require('./routes/conversation.routes');
const detailConversationRoutes = require('./routes/detailconversation.routes');
const taskRoutes = require('./routes/task.routes');
const loginRoutes = require('./routes/login.routes');

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'CRM Semadd Nicaragua API', status: 'ok' });
});

app.use('/api/users', userRoutes);
app.use('/api/enterprises', enterpriseRoutes);
app.use('/api/user-enterprises', userEnterpriseRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/detail-conversations', detailConversationRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/login', loginRoutes);


app.use((error, req, res, next) => {
  console.error('[api]', error);
  if (res.headersSent) return next(error);
  res.status(500).json({ message: 'Error interno del servidor' });
});

if (require.main === module) {
  app.listen(port, () => console.log(`Server running on port ${port}`));
}

module.exports = app;
