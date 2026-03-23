const db = require('../config/db');
const util = require('util');

// L'utilisateur entre dans un niveau pour la première fois
exports.startLevel = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bossId } = req.body;

    if (!bossId) {
      return res.status(400).json({ message: "Boss non spécifié !" });
    }

    const query = util.promisify(db.query).bind(db);

    // Vérifier si une progression existe déjà
    const existingProgress = await query(
      "SELECT * FROM progress WHERE user_id = ? AND boss_id = ?",
      [userId, bossId]
    );

    // Si la progression existe déjà et que is_completed est égal à true
    if (existingProgress.length > 0 && existingProgress[0].is_completed === 1) {
      return res.status(409).json({ message: "Tu as déjà terminé ce niveau !" });
    }

    // Si la progression existe déjà et qu'elle est incomplète
    if (existingProgress.length > 0) {
      const guessData = await query(
        "SELECT attempt_number FROM guesses WHERE user_id = ? AND boss_id = ?",
        [userId, bossId]
      );
      const attemptsLeft = 5 - (guessData[0]?.attempt_number || 0);
      return res.status(200).json({ message: "Niveau déjà en cours", attemptsLeft });
    }

    // Vérifier si l'utilisateur peut accéder à ce niveau (niveau précédent terminé)
    const bossData = await query("SELECT level, region_id FROM bosses WHERE id = ?", [bossId]);

    if (bossData.length === 0) {
      return res.status(404).json({ message: "Boss non trouvé !" });
    }

    const { level, region_id } = bossData[0];

    if (level > 1) {
      const previousBoss = await query(
        "SELECT id FROM bosses WHERE region_id = ? AND level = ?",
        [region_id, level - 1]
      );

      if (previousBoss.length === 0) {
        return res.status(400).json({ message: "Niveau précédent non trouvé !" });
      }

      const previousBossId = previousBoss[0].id;

      const previousCompleted = await query(
        "SELECT * FROM progress WHERE user_id = ? AND boss_id = ? AND is_completed = 1",
        [userId, previousBossId]
      );

      if (previousCompleted.length === 0) {
        return res.status(403).json({ message: "Niveau précédent non complété !" });
      }
    }

    // Créer la progression
    await query(
      "INSERT INTO progress (user_id, boss_id, is_completed) VALUES (?, ?, ?)",
      [userId, bossId, false]
    );

    // Créer l'entrée pour les tentatives (avec 0 par défaut)
    await query(
      "INSERT INTO guesses (user_id, boss_id, attempt_number) VALUES (?, ?, ?)",
      [userId, bossId, 0]
    );

    return res.status(201).json({ message: "Niveau lancé avec succès !" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur lors du lancement du niveau !" });
  }
};

exports.makeGuess = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bossId, guess } = req.body;

    if (!bossId || !guess) {
      return res.status(400).json({ message: "Boss et réponse requis !" });
    }

    const query = util.promisify(db.query).bind(db);

    // Vérifier que l'utilisateur a bien commencé le niveau
    const progress = await query(
      "SELECT * FROM progress WHERE user_id = ? AND boss_id = ? AND is_completed = 0",
      [userId, bossId]
    );

    if (progress.length === 0) {
      return res.status(403).json({ message: "Vous n'avez pas commencé ce niveau ou il est déjà terminé !" });
    }

    // Récupérer les infos de tentative
    const attempts = await query(
      "SELECT * FROM guesses WHERE user_id = ? AND boss_id = ?",
      [userId, bossId]
    );

    if (attempts.length === 0) {
      return res.status(404).json({ message: "Les tentatives n'ont pas été initialisées !" });
    }

    const attempt = attempts[0];

    // Vérifier le délai de 3 secondes
    const now = new Date();
    const lastAttempt = new Date(attempt.last_attempt);
    const timeDiff = (now - lastAttempt) / 1000;

    if (timeDiff < 3) {
      return res.status(429).json({ message: "Attendez 3 secondes avant de réessayer !" });
    }

    // Vérifier si le joueur a dépassé 5 tentatives
    if (attempt.attempt_number >= 5) {
      await query("DELETE FROM progress WHERE user_id = ? AND boss_id = ?", [userId, bossId]);
      await query("DELETE FROM guesses WHERE user_id = ? AND boss_id = ?", [userId, bossId]);
      return res.status(403).json({ message: "Nombre de tentatives dépassé ! Retour à la page de sélection des régions !" });
    }

    // Récupérer le nom réel du boss
    const bossData = await query("SELECT name, real_image FROM bosses WHERE id = ?", [bossId]);

    if (bossData.length === 0) {
      return res.status(404).json({ message: "Boss non trouvé !" });
    }

    const correctAnswer = bossData[0].name;
    const correctAnswerImage = bossData[0].real_image;

    // Normaliser la réponse (minuscule, sans ponctuation)
    const normalize = str => str.toLowerCase().replace(/[^a-z0-9\s]/gi, '').trim();

    if (normalize(guess) === normalize(correctAnswer)) {
      // Bonne réponse : marquer le niveau comme terminé
      await query(
        "UPDATE progress SET is_completed = 1 WHERE user_id = ? AND boss_id = ?",
        [userId, bossId]
      );
      return res.status(200).json({ message: "Bonne réponse ! Niveau terminé !", correctAnswerImage });
    } else {
      // Mauvaise réponse
      const newAttemptCount = attempt.attempt_number + 1;
      await query(
        "UPDATE guesses SET attempt_number = ?, last_attempt = CURRENT_TIMESTAMP WHERE user_id = ? AND boss_id = ?",
        [newAttemptCount, userId, bossId]
      );
      return res.status(200).json({ message: "Mauvaise réponse ! Veuillez réessayer !", attemptsLeft: 5 - newAttemptCount });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur lors de la tentative !" });
  }
};

exports.getRegionProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { regionId } = req.params;

    if (!regionId) {
      return res.status(400).json({ message: "Région non spécifiée !" });
    }

    const query = util.promisify(db.query).bind(db);

    // Récupérer tous les boss de la région
    const bosses = await query("SELECT id FROM bosses WHERE region_id = ?", [regionId]);
    const bossIds = bosses.map(b => b.id);

    if (bossIds.length === 0) {
      return res.status(404).json({ message: "Aucun boss trouvé pour cette région !" });
    }

    // Récupérer les niveaux complétés par l'utilisateur
    const placeholders = bossIds.map(() => '?').join(',');
    const completedProgress = await query(
      `SELECT COUNT(*) AS completed FROM progress WHERE user_id = ? AND boss_id IN (${placeholders}) AND is_completed = 1`,
      [userId, ...bossIds]
    );

    const completed = completedProgress[0].completed;
    const total = bossIds.length;
    const percentage = Math.round((completed / total) * 100);

    return res.status(200).json({ completed, total, percentage });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur lors du calcul de la progression !" });
  }
};
