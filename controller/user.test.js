const userController = require('./user');
const mongodb = require('../data/database');

describe('User Controller', () => {
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
        // Attempting to force close the MongoDB connection... but might not be working though. 
        const db = mongodb.getDatabase();
        if (db && db.client) {
            await db.client.close(true);
        }
    });

    // Testing the getall function
    describe('getAll', () => {
        it('should return all users with status 200', async () => {
            await userController.getAll(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalled();
            
            const responseData = res.json.mock.calls[0][0];
            expect(Array.isArray(responseData)).toBe(true);
        });
    });

    // testing the getsingle function
    describe('getSingle', () => {
        it('should return a single user with status 200 for valid ID', async () => {
            const users = await mongodb.getDatabase()
                .db('lucky7Travel')
                .collection('user')
                .find()
                .limit(1)
                .toArray();
            
            if (users.length > 0) {
                req.params.id = users[0]._id.toString();
                await userController.getSingleUser(req, res);

                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalled();
            }
        });

        it('should return 404 for invalid ID', async () => {
            req.params.id = '507f1f77bcf86cd799439011';
            await userController.getSingleUser(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
        });
    });
});