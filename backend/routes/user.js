const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// routes pour user
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/refresh-token', userController.refreshToken);
router.delete('/logout', userController.logout);
module.exports = router;