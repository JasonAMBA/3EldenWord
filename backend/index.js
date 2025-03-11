const express = require('express');
const app = express();
require('dotenv').config();
const userRoutes = require('./routes/user');
const regionRoute = require('./routes/region');
const bossesRoute = require('./routes/boss');

app.use(express.json());

app.use('/users', userRoutes);
app.use('/regions', regionRoute);
app.use('/boss', bossesRoute);

app.listen(process.env.PORT, () => {
  console.log(`Serveur démarré sur le port ${process.env.PORT}`);
})