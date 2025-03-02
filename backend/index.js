const express = require('express');
const mysql = require('mysql');
const app = express();
require('dotenv').config();

// Configuration MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

global.db = db;

db.connect((err) => {
  if (err) {
    console.error('Erreur lors de la connexion à MySQL', err);
    return;
  }
  console.log('Connecté à la base de donnée MySQL');
})

app.use(express.json());

app.listen(process.env.PORT, () => {
  console.log(`Serveur démarré sur le port ${process.env.PORT}`);
  
})