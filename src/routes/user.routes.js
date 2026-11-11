const express = require('express');
const controller = require('../controllers/user.controller');
const { login } = require('../controllers/login.controller');

const router = express.Router();

// Inicio de sesión: POST /api/users/login
router.post('/login', login);
router.get('/', controller.getUsers);
router.get('/:id', controller.getUser);
router.post('/', controller.createUser);
router.patch('/:id', controller.updateUser);
// Desactivación lógica: conserva el registro con state = 0.
router.delete('/:id', controller.deleteUser);

// Eliminación física: borra definitivamente el registro.
router.delete('/:id/permanent', controller.hardDeleteUser);

module.exports = router;
