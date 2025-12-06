const destinationController = require('./destination');
const mongodb = require('../data/database');

describe('Destination Controller', () => {
    let req, res;

    beforeAll(async () => {
        // Initialize DB connection with callback
        await new Promise((resolve, reject) => {
            mongodb.initDb((err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    });

    beforeEach(() => {
        req = { params: {}, body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            setHeader: jest.fn(),
            send: jest.fn()
        };
    });

    afterAll(async () => {
        // Force close the MongoDB connection
        const db = mongodb.getDatabase();
        if (db && db.client) {
            await db.client.close(true); // Force close
        }
    });

    describe('getAll', () => {
        it('should return all destinations with status 200', async () => {
            await destinationController.getAll(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalled();
            
            const responseData = res.json.mock.calls[0][0];
            expect(Array.isArray(responseData)).toBe(true);
        });
    });

    describe('getSingle', () => {
        it('should return a single destination with status 200 for valid ID', async () => {
            const destinations = await mongodb.getDatabase()
                .db('lucky7Travel')
                .collection('destination')
                .find()
                .limit(1)
                .toArray();
            
            if (destinations.length > 0) {
                req.params.id = destinations[0]._id.toString();
                await destinationController.getSingle(req, res);

                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalled();
            }
        });

        it('should return 404 for invalid ID', async () => {
            req.params.id = '507f1f77bcf86cd799439011';
            await destinationController.getSingle(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Destination not found!' });
        });
    });
});