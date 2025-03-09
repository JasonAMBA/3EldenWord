const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../middlewares/authJWT');

// routes pour user
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/refresh-token', userController.refreshToken);
router.delete('/logout', userController.logout);
router.put('/', authController, userController.updateUser);

module.exports = router;