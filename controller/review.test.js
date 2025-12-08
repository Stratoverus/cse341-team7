const reviewController = require('../controller/review');
const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

describe('Review Controller - GET Endpoints', () => {
  let req, res;
  let testReview;

  beforeAll(async () => {
    await new Promise((resolve, reject) => {
      mongodb.initDb(err => err ? reject(err) : resolve());
    });
    
    testReview = {
      userId: 'test-user-123',
      destinationId: 'dest-abc',
      rating: 5,
      comment: 'Test review'
    };
    
    const result = await mongodb.getDatabase()
      .db('lucky7Travel')
      .collection('review')
      .insertOne(testReview);

    testReview._id = result.insertedId;
  });

  beforeEach(() => {
    req = { params: {}, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn(),
      setHeader: jest.fn(),
    };
  });

  afterAll(async () => {
    await mongodb.getDatabase()
      .db('lucky7Travel')
      .collection('review')
      .deleteOne({ _id: testReview._id });

    const db = mongodb.getDatabase();
    if (db?.client) await db.client.close();
  });

  describe('getAll', () => {
    it('should return all reviews → status 200 + array', async () => {
      await reviewController.getAll(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(Array.isArray(res.json.mock.calls[0][0])).toBe(true);
    });
  });

  describe('getSingle', () => {
    it('should return 200 when valid ID exists', async () => {
      req.params.id = testReview._id.toString();
      await reviewController.getSingle(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
    });

    it('should return 404 for non-existent ID', async () => {
      req.params.id = '507f1f77bcf86cd799439999';
      await reviewController.getSingle(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Review not found!' });
    });
  });

  describe('getByUser', () => {
    it('should return 200 when user has reviews', async () => {
      req.params.id = testReview.userId;
      await reviewController.getByUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();

      const responseData = res.json.mock.calls[0][0];
      expect(Array.isArray(responseData)).toBe(true);
      expect(responseData.some(r => r._id.toString() === testReview._id.toString())).toBe(true);
    });

    it('should return 404 when user has no reviews', async () => {
      req.params.id = 'non-existent-user-999';
      await reviewController.getByUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Review not found!' });
    });
  });

  describe('getByDestination', () => {
    it('should return 200 when destination exists in some review', async () => {
      req.params.id = testReview.destinationId;
      await reviewController.getByDestination(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();

      const responseData = res.json.mock.calls[0][0];
      expect(Array.isArray(responseData)).toBe(true);
      expect(responseData.some(r => r._id.toString() === testReview._id.toString())).toBe(true);
    });
    it('should return 404 when destination has no reviews', async () => {
      req.params.id = 'non-existent-destination-999';

      await reviewController.getByDestination(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Review not found!' });
    });
  });
});