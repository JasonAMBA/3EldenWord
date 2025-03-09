const db = require('../config/db');
const util = require('util');

// Récupérer toutes les régions
exports.getAllRegions = async (req, res) => {
  try {
    const query = util.promisify(db.query).bind(db);
    const regions = await query("SELECT * FROM regions");
    res.status(200).json(regions);
  } catch (err) {
    console.error(err);
    res.status(500).json({message: "Erreur lors de la récupération des régions"});
  }
}