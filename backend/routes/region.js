const express = require('express');
const router = express.Router();
const regionController = require('../controllers/regionController');
const authController = require('../middlewares/authJWT');

// Récupérer les régions
router.get('/', authController, regionController.getAllRegions);
router.get('/:id', authController, regionController.getRegionById);

module.exports = router;