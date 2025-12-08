const itineraryController = require('../controller/itinerary');
const mongodb = require('../data/database');

describe('Itinerary Controller - GET Endpoints', () => {
  let req, res;

  beforeAll(async () => {
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
      send: jest.fn(),
      setHeader: jest.fn(),
    };
  });

  afterAll(async () => {
    const db = mongodb.getDatabase();
    if (db?.client) await db.client.close();
  });

  describe('getAll', () => {
    it('should return all itineraries → status 200 + array', async () => {
      await itineraryController.getAll(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(Array.isArray(res.json.mock.calls[0][0])).toBe(true);
    });
  });

  describe('getSingle', () => {
    it('should return 200 when valid ID exists', async () => {
      const doc = await mongodb.getDatabase()
        .db('lucky7Travel')
        .collection('itinerary')
        .findOne();

      if (doc) {
        req.params.id = doc._id.toString();
        await itineraryController.getSingle(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
      }
    });

    it('should return 404 for non-existent ID', async () => {
      req.params.id = '507f1f77bcf86cd799439999';
      await itineraryController.getSingle(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Itinerary not found!' });
    });
  });

  describe('getByUser', () => {
    it('should return 200 when user has itineraries', async () => {
      const doc = await mongodb.getDatabase()
        .db('lucky7Travel')
        .collection('itinerary')
        .findOne({ userId: { $exists: true } });

      if (doc) {
        req.params.userId = doc.userId;
        await itineraryController.getByUser(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
      }
    });
  });

  describe('getByDestination', () => {
    it('should return 200 when destination exists in some itinerary', async () => {
      const doc = await mongodb.getDatabase()
        .db('lucky7Travel')
        .collection('itinerary')
        .findOne({ destinations: { $ne: [] } });

      if (doc && doc.destinations?.length > 0) {
        req.params.destinationId = doc.destinations[0];
        await itineraryController.getByDestination(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
      }
    });
  });
});