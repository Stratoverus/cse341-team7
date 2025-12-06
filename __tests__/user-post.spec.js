const app = require('../app')
const supertest = require('supertest');
const { expect } = require('@jest/globals');
const request = supertest(app)
const mongodb = require('../data/database');

// this code will      establish a connection to the database before running any tests
beforeAll((done) => {
  mongodb.initDb((err) => {
    if (err) return done(err);
    done();
  });
});

describe('Test Handlers', () => {
    test('responds to post /user', async () => {
        const res = await request.post('/user').send(    {
            username: "jdoe",
            name: "John",
            email: "jdoe@gmail.com",
            role: "user",
            password: "Password123!",
        });
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(201)
    })

    
})

