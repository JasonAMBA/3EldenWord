const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const usersRoutes = require('./routes/user');
const regionRoute = require('./routes/region');
const bossesRoutes = require('./routes/boss');
const gameRoutes = require('./routes/game');

app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true
}));

app.use(express.json());

app.use(cookieParser());

app.use('/users', usersRoutes);
app.use('/regions', regionRoute);
app.use('/boss', bossesRoutes);
app.use('/game', gameRoutes);


app.listen(process.env.PORT, () => {
  console.log(`Serveur démarré sur le port ${process.env.PORT}`);
})

console.log(`Environnement actuel : ${process.env.NODE_ENV}`);