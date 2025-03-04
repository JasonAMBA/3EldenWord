const express = require('express');
const app = express();
require('dotenv').config();
const userRoutes = require('./routes/user');

app.use(express.json());

app.use('/users', userRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Serveur démarré sur le port ${process.env.PORT}`);
})