const app = require('../server')
const supertest = require('supertest');
const { expect } = require('@jest/globals');
const request = supertest(app)
const mongodb = require('../data/database');

beforeAll((done) => {
  mongodb.initDb((err) => {
    if (err) return done(err);
    done();
  });
});

describe('user Get', () => {
    test('responds to GET /user with 200 and JSON', async () => {
    const res = await request.get('/user');
    expect(res.header['content-type']).toMatch(/application\/json/);
    expect(res.statusCode).toBe(200);
  });

  test('responds to GET /user/:id with valid ID', async () => {

    const res = await request.get(`/user/${id}`);
    expect(res.header['content-type']).toMatch(/application\/json/);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('email', 'janedoe@mail.com');
  });

  test('responds to GET /user/:id with invalid ID format', async () => {
    const res = await request.get('/user/123'); // not a valid ObjectId
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Invalid user ID');
  });

  test('responds to GET /user/:id with non-existent ID', async () => {
    const fakeId = '507f1f77bcf86cd799439011'; // valid ObjectId but not in DB
    const res = await request.get(`/user/${fakeId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'User not found');
  });
});