const express = require('express');
const controller = require('../controllers/detailconversation.controller');

const router = express.Router();

router.get('/', controller.getDetailConversations);
router.get('/:id', controller.getDetailConversationById);
router.post('/', controller.createDetailConversation);
router.patch('/:id', controller.updateDetailConversation);
router.delete('/:id', controller.deleteDetailConversation);

module.exports = router;