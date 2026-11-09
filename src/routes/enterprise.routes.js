const express = require('express');
const controller = require('../controllers/enterprise.controller');
const router = express.Router();
router.get('/', controller.getEnterprises);
router.get('/:id', controller.getEnterpriseById);
router.post('/', controller.createEnterprise);
router.patch('/:id', controller.updateEnterprise);
router.delete('/:id', controller.deleteEnterprise);
module.exports = router;
