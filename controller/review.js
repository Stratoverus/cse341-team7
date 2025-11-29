const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    //#swagger.tags=["Reviews"]
    try {
        const review = await mongodb.getDatabase().db('lucky7Travel').collection('review').find().toArray();

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(review);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getAll };