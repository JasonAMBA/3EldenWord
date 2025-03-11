const db = require("../config/db");
const util = require('util');

// Récupérer le nom de la région, l'image de la région, le nom des bosses, la première indice du boss et le level correspondant
exports.getRegionAndBosses = async (req, res) => {
  try {
    const {id: regionId} = req.params;
    const query = util.promisify(db.query).bind(db);
    const regionAndBosses = await query("SELECT regions.id AS region_id, regions.name AS region_name, regions.image_url AS region_url, bosses.id AS boss_id, bosses.image_hint1 AS boss_hint1, bosses.level AS lvl FROM regions JOIN bosses on regions.id = bosses.region_id WHERE regions.id = ? ORDER BY bosses.level ASC", [regionId]);

    if (regionAndBosses.length === 0) {
      return res.status(404).json({ message: "Région non trouvée"});
    }

    // Reformulation des données
    const region = {
      id: regionAndBosses[0].region_id,
      name: regionAndBosses[0].region_name,
      image: regionAndBosses[0].region_url
    };

    const bosses = regionAndBosses
      .filter(row => row.boss_id != null)
      .map(row => ({
        id: row.boss_id,
        hint1: row.boss_hint1,
        lvl: row.lvl
      }));

    res.status(200).json({region, bosses});

  } catch (err) {
    console.error(err);
    res.status(500).json({message: "Erreur lors de la récupération des données"})
  }
}

exports.getBossById = async (req, res) => {
  try {
    const {id: bossId} = req.params;
    const query = util.promisify(db.query).bind(db);
    const boss = await query("SELECT name, level, image_hint1, image_hint2, image_hint3, real_image FROM bosses WHERE id = ?", [bossId]);

    if (boss.length === 0) {
      return res.status(404).json({ message: "Boss non trouvé"});
    }

    const result = boss[0];
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({message: "Erreur lors de la récupération du boss !"});
  }
}