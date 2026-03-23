require('dotenv').config();
const mysql = require('mysql');

// Configuration MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('Erreur lors de la connexion à MySQL', err);
    return;
  }
  console.log('Connecté à la base de donnée MySQL');
});

module.exports = db;