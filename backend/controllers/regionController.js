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
    res.status(500).json({ message: "Erreur lors de la récupération des régions" });
  }
};

// Récupérer une région par son id
exports.getRegionById = async (req, res) => {
  try {
    const { id: regionId } = req.params;
    const query = util.promisify(db.query).bind(db);
    const region = await query("SELECT * FROM regions WHERE id = ?", [regionId]);

    if (region.length === 0) {
      return res.status(404).json({ message: "Région non trouvée" });
    }

    res.status(200).json(region[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la récupération de la région !" });
  }
};
