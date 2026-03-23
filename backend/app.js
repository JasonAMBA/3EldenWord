require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Importation des routes
const usersRoutes = require('./routes/user');
const regionRoute = require('./routes/region');
const bossesRoutes = require('./routes/boss');
const gameRoutes = require('./routes/game');

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/users', usersRoutes);
app.use('/regions', regionRoute);
app.use('/boss', bossesRoutes);
app.use('/game', gameRoutes);

module.exports = app;