const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// routes pour user
router.post('/register', userController.register);

module.exports = router;