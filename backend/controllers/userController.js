const db = require('../config/db');
const bcrypt = require('bcrypt');
const util = require('util');
require('dotenv').config();
const crypto = require('crypto');

exports.register = async (req, res) => {
  try {
    const {username, email, password} = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({message: "Tous les champs n'ont pas été remplis !"});
    }

    // Convertir db.query en une fonction qui retourne une Promise
    const query = util.promisify(db.query).bind(db);

    // Vérifier si l'utilisateur existe déjà
    const verificationQuery = "SELECT * FROM users WHERE username = ? OR email = ?";
    const existingUser = await query(verificationQuery, [username, email]);

    if (existingUser.length > 0) {
      return res.status(400).json({message:"L'utilisateur ou l'email existe déjà !"});
    }

    // Hash du mot de passe
    const hachedPassword = await bcrypt.hash(password, 10);

    // Ajouter l'utilisateur dans la base de données
    const user = {username, email, password:hachedPassword};
    const addUserQuery = "INSERT INTO users set ?";
    await query(addUserQuery, [user]);

    res.status(201).json({message:"L'utilisateur a été ajouté avec succès !"});
  } catch (err) {
    console.error(err);
    res.status(500).json({message:"Une erreur est survenue lors de l'ajout de l'utilisateur"});
  }
};