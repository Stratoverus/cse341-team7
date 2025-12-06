const {MongoClient, Collection} = require('mongodb');
require('dotenv').config();

describe("Function GetAll on Review Collection", () => {
    let connection, db;

    beforeAll( async () => {
        const mongoUri = process.env.MONGODB_URI;

        if (!mongoUri) {
            throw new Error('URI not available');
        }

        connection = await MongoClient.connect( mongoUri);

        db = connection.db('lucky7Travel');
    });

    afterAll( async () => {
        if (connection) {
            await connection.close();
        }
    });

    test('Should retrieve al the reviews', async () => {
        const collection = db.collection('review');
        const reviews = await collection.find({}).toArray();

        expect(reviews).toBeDefined();
        expect(reviews.length).toBeGreaterThanOrEqual(0);
    });
});

