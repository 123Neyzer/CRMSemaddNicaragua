const express = require('express');
const controller = require('../controllers/conversation.controller');
const router = express.Router();
router.get('/', controller.getConversations);
router.get('/:id', controller.getConversationById);
router.post('/', controller.createConversation);
router.patch('/:id', controller.updateConversation);
router.delete('/:id', controller.deleteConversation);
module.exports = router;
