const express = require('express');
const controller = require('../controllers/userenterprise.controller');
const router = express.Router();
router.get('/', controller.getUserEnterprises);
router.get('/:id', controller.getUserEnterpriseById);
router.post('/', controller.createUserEnterprise);
router.patch('/:id', controller.updateUserEnterprise);
router.delete('/:id', controller.deleteUserEnterprise);
module.exports = router;
