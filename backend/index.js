const express = require('express');
const app = express();
require('dotenv').config();
const usersRoutes = require('./routes/user');
const regionRoute = require('./routes/region');
const bossesRoutes = require('./routes/boss');
const gameRoutes = require('./routes/game');

app.use(express.json());

app.use('/users', usersRoutes);
app.use('/regions', regionRoute);
app.use('/boss', bossesRoutes);
app.use('/game', gameRoutes);


app.listen(process.env.PORT, () => {
  console.log(`Serveur démarré sur le port ${process.env.PORT}`);
})