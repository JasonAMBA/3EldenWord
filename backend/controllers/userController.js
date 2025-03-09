const db = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const util = require('util');
require('dotenv').config();
const crypto = require('crypto');

// Inscription de l'utilisateur
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

// Connexion de l'utilisateur
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
    const accessToken = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn:"1h"});

    // Génération du token de rafraichissement
    const refreshToken = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn:"7d"});

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

// Rafraichissement du token
exports.refreshToken = async (req, res) => {
  try {
    const {refreshToken} = req.body;

    if (!refreshToken) {
      return res.status(401).json({message: "Token de rafraichissement manquant !"});
    }

    // Vérification de la présence du token de rafraichissement dans la base de données
    const query = util.promisify(db.query).bind(db);
    const refreshTokenQuery = "SELECT * FROM tokens WHERE refresh_token = ?";
    const token = await query(refreshTokenQuery, [refreshToken]);

    if (token.length === 0) {
      return res.status(401).send("Token incorrect !");
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
      const userId = decoded.id;

      // Génération d'un nouveau accessToken
      const newAccessToken = jwt.sign({id: userId}, process.env.JWT_SECRET, {expiresIn:"1h"});

      // Génération d'un nouveau refreshToken en base
      const newRefreshToken = jwt.sign({id: userId}, process.env.JWT_SECRET, {expiresIn:"7d"});

      // Suppression de l'ancien refreshToken
      await query("DELETE FROM tokens WHERE user_id = ?", [userId]);
      
      // Enregistrement du nouveau refreshToken en base
      await query("INSERT INTO tokens (user_id, refresh_token) VALUES (?, ?)", [userId, newRefreshToken]);

      return res.status(200).json({message: "Token rafraichi avec succès !", newAccessToken, newRefreshToken});

    } catch (err) {
      return res.status(401).json({message: "Token de rafraichissement invalide ou expiré !"})
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({message: "Erreur lors du rafraichissement du token !"});
  }
}

exports.logout = async (req, res) => {
  try {
    const {refreshToken} = req.body;

    if (!refreshToken) {
      return res.status(400).json({message: "Token de rafraichissement manquant !"})
    }

    const query = util.promisify(db.query).bind(db);

    // Vérification de l'éxistence du token en base
    const refreshTokenQuery = "SELECT * FROM tokens WHERE refresh_token = ?";
    const token = await query(refreshTokenQuery, [refreshToken]);

    if (token.length === 0) {
      return res.status(401).json({message: "Token invalide !"});
    }

    // Suppression du token de rafraichissement
    await query("DELETE FROM tokens WHERE refresh_token = ?", [refreshToken]);

    return res.status(200).json({message: "Déconnexion réussi !"});
  } catch (err) {
    console.error(err);
    res.status(500).json({message: "Erreur lors de la déconnexion !"});
  }
}

exports.updateUser = async (req, res) => {
  try {
    const userId = req.user.id; // On récupère l'id de l'utilisateur depuis le token d'accès

    let {username, email, password} = req.body;

    // Vérifier si l'utilisateur existe en base
    const query = util.promisify(db.query).bind(db);
    const userQuery = "SELECT * FROM users WHERE id = ?"
    const user = await query(userQuery, [userId]);

    if (user.length === 0) {
      return res.status(404).json({message: "Utilisateur non trouvé"});
    }

    // Vérifier si au moins un champ a été envoyé

    if (!username && !email && !password) {
      return res.status(400).json({message: "Aucune information à mettre à jour !"})
    }

    // Hacher le mot de passe si il est fourni
    if (password) {
      password = await bcrypt.hash(password, 10);
    }

    const updateUserQuery = "UPDATE users set username = ?, email = ?, password = ? WHERE id = ?"
    await query (updateUserQuery, [
      username || user[0].username,
      email || user[0].email,
      password || user[0].password,
      userId
    ]);

    return res.status(200).json({message : "Utilisateur mis à jour avec succès !"})

  } catch (err) {
    console.error(err);
    return res.status(500).json({message: "Erreur lors de la mise à jour des informations de l'utilisateur !"})
  }
}