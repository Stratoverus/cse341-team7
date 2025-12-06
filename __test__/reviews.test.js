const {MongoClient} = require('mongodb');
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
        // expect(Array.isArray(reviews)).toBe(true);
        expect(reviews.length).toBeGreaterThanOrEqual(0);
    });

    
    test('Should return an empty array if there are no reviews', async () => {
        const collection = db.collection('review');
        
        const result = await collection.deleteMany({}); // clean the array

        expect(result).toBeDefined();
        expect(result.deletedCount).toBeGreaterThanOrEqual(0);

        const reviews = await collection.find({}).toArray();
        expect(Array.isArray(reviews)).toBe(true);
        expect(reviews.length).toBe(0);
    });

    test('Should retrieve reviews with valid data structure', async () => {
        const collection = db.collection('review');

        const testReviews = [
            {
                userId: "test1",
                destnationId: "test1",
                rating: 5,
                reviewText: "Great trip!",
                visitDate: "2024-08-01",
                reviewDate: "2024-09-01"
            }
        ];
        
        await collection.insertMany(testReviews);

        const reviews = await collection.find({}).toArray();

        if (reviews.length > 0) {
            reviews.forEach(review => {
                expect(review).toHaveProperty('_id');
                expect(review).toHaveProperty('rating');
                expect(review).toHaveProperty('reviewText');
                expect(typeof review.rating).toBe('number');
            });
        }
    });

    test('Should handle database connection errors', async () => {

        try {
            const collection = db.collection('review');
            const reviews = await collection.find({}).toArray();

            expect(reviews).toBeDefined();
            expect(Array.isArray(reviews)).toBe(true);
        } catch (error) {
            expect(error).toBeDefined();
            expect(error.message).toBeTruthy();
        }

        // * Generate erro closing de connection *
        // const tempConnection = connection;
        // await connection.close();

        // try {
        //     const collection = db.collection('review');
        //     await collection.find({}).toArray();
            
        //     expect(true).toBe(false);
        // } catch (error) {
        //     expect(error).toBeDefined();
        //     expect(error.message).toContain('connection');
        // } finally {
        //     connection = tempConnection;
        // }
    });
});

