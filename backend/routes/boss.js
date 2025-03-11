const express = require('express');
const router = express.Router();
const bossController = require('../controllers/bossController');
const authController = require('../middlewares/authJWT');

// Récupérer la région et les premières indices de boss
router.get('/regionandbosses/:id', authController, bossController.getRegionAndBosses);
router.get('/:id', authController, bossController.getBossById);

module.exports = router;