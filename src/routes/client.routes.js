const express = require('express');
const controller = require('../controllers/client.controller');
const router = express.Router();
router.get('/', controller.getClients);
router.get('/:id', controller.getClientById);
router.post('/', controller.createClient);
router.patch('/:id', controller.updateClient);
router.delete('/:id', controller.deleteClient);
module.exports = router;
