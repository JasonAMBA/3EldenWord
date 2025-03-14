const express = require('express');
const router = express.Router();
const gameController = require("../controllers/gameController");
const authController = require("../middlewares/authJWT");

// Le joueur entre dans un niveau pour la première fois
router.post("/start-level", authController, gameController.startLevel);

// Le joueur tente de de deviner un boss
router.post("/guess-boss", authController, gameController.makeGuess);

module.exports = router;