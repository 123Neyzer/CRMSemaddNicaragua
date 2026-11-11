const express = require('express');
const router = express.Router();

const {loginUser, logoutUser} = require('../controllers/login.controller');
router.post('/', loginUser);
router.post('/logout', logoutUser);
module.exports = router;
