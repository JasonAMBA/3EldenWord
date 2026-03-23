const request = require('supertest');
const app = require('../app');
const jwt = require('jsonwebtoken');
require('dotenv').config();

describe('GET /regions', () => {
  it('retourner toutes les régions avec un token valide', async () => {
    // Création d'un faux token valide
    const token = jwt.sign({ id: 1 }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Requête avec header Authorization
    const res = await request(app)
      .get('/regions')
      .set('Authorization', token);

    // Vérification des résultats
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  })
})
