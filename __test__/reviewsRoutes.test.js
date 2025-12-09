//  TO TEST ONLY THIS FILE 
//  jest --coverage __test__/reviewsRoutes.test.js --detectOpenHandles

const app = require("../server");
const supertest = require('supertest');
const request = supertest(app);
const mongodb =  require("../data/database");

beforeAll( (done) => {
    mongodb.initDb( (err) => {
        if (err) return done(err);
        done();
    });
});

describe(" Review GET ", () => {

    test('responds to GET /user with 200 and JSON', async () => {
        const res = await request.get('/review');
        expect(res.header['content-type']).toMatch(/application\/json/);
        expect(res.statusCode).toBe(200);
    });

    test('responds to GET /review/:id with invalid id format', async () => {
        const res = await request.get('/review/321');
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message', 'Invalid review ID');
        // if (!ObjectId.isValid(id) || id.length !== 24) {
        //     return res.status(400).json({ message: "Review not found" });
        // }
    });

    test('responds to GET /review/:id with ID  No available', async () => {
        const res = await request.get('/review/692afabc7419d225ee1d8120'); // fake ID used
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('message', 'Review not found');
    });
});
