const request = require('supertest');
const app = require('../app');
require('dotenv').config();

describe('POST /users', () => {
  it("Créer l'utilisateur si tous les champs sont remplis", async () => {
    const res = await request(app)
      .post('/users/register')
      .send({
        username: 'Test1000',
        email: 'test1000@gmail.com',
        password: 'test123'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', "L'utilisateur a été ajouté avec succès !");
  });
});