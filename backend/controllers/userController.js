const db = require('../config/db');
const jwt = require('jsonwebtoken');
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

exports.login = async (req, res) => {
  try {
    const {username, password} = req.body;

    if (!username || !password) {
      return res.status(400).json({message: "Tous les champs n'ont pas été remplis !"});
    }

    const query = util.promisify(db.query).bind(db);

    const connexionQuery = "SELECT * FROM users WHERE username = ?";
    const login = await query(connexionQuery, [username]);

    if (login.length === 0) {
      return res.status(401).send( "Identifiants incorrects !");
    }

    const user = login[0];

    // Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).send("Mot de passe incorrect !")
    }

    // Génération du token d'accès
    const accessToken = jwt.sign({id: user.id, name: user.username}, process.env.JWT_SECRET, {expiresIn:"1h"});

    // Génération du token de rafraichissement
    const refreshToken = crypto.randomBytes(64).toString('hex');

    // Eviter l'accumulation de token de rafraichissement
    const deleteOldTokenQuery = "DELETE FROM tokens WHERE user_id = ?";
    await query (deleteOldTokenQuery, [user.id]);

    // Enregistrement du token de rafraichissement dans la base de données
    const refreshTokenQuery = "INSERT INTO tokens (user_id, refresh_token) VALUES (?, ?)";
    await query(refreshTokenQuery, [user.id, refreshToken]);

    res.status(200).json({message: "Connexion réussie !", accessToken, refreshToken});
  } catch (err) {
    console.error(err);
    res.status(500).json({message: "Erreur lors de la connexion !"});
  }
}